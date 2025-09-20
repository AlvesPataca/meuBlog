// Roda o script quando o DOM está completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS GLOBAIS ---
    const body = document.body;
    const nav = document.getElementById('mainNav');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const preloader = document.querySelector('.preloader');
    const toast = document.getElementById('toast');

    // --- FUNÇÕES GLOBAIS (para todas as páginas) ---

    // Lógica do Preloader
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });
    
    // Função para comunicar o tema ao Giscus
    const updateGiscusTheme = () => {
        const theme = body.classList.contains('light') ? 'light' : 'dark';
        const iframe = document.querySelector('iframe.giscus-frame');
        if (iframe) {
            iframe.contentWindow.postMessage({ giscus: { setTheme: theme } }, 'https://giscus.app');
        }
    };

    // Alternar tema e salvar preferência
    const toggleTheme = () => {
        body.classList.toggle('light');
        localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
        updateGiscusTheme(); // Atualiza o tema do Giscus na troca
    };

    // Aplicar tema salvo
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light');
        }
        // O tema do Giscus será definido no HTML e atualizado depois via JS
    };

    // Header que encolhe e botão "Voltar ao Topo"
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            backToTopBtn.classList.add('visible');
        } else {
            nav.classList.remove('scrolled');
            backToTopBtn.classList.remove('visible');
        }
    };

    // Marcar link de navegação ativo
    const highlightActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };
    
    // Função de Notificação Toast
    const showToast = (message, type = 'success') => {
        toast.textContent = message;
        toast.className = `toast visible ${type}`;
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    };

    // --- LÓGICA ESPECÍFICA DE CADA PÁGINA ---

    // Lógica da PÁGINA INICIAL (index.html)
    const initHomePage = () => {
        const postContainer = document.getElementById('postContainer');
        const searchInput = document.getElementById('searchInput');
        const tagsContainer = document.getElementById('tagsContainer');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        let currentFilter = { term: '', tag: '' };
        let visiblePostsCount = 6;

        const renderPosts = () => {
            const filteredPosts = postsData.filter(post => {
                const searchTermMatch = post.title.toLowerCase().includes(currentFilter.term.toLowerCase());
                const tagMatch = currentFilter.tag ? post.tags.includes(currentFilter.tag) : true;
                return searchTermMatch && tagMatch;
            });

            postContainer.innerHTML = ''; // Limpa os posts
            const postsToRender = filteredPosts.slice(0, visiblePostsCount);
            
            if (postsToRender.length === 0) {
                postContainer.innerHTML = '<p class="no-results">Nenhum post encontrado.</p>';
            } else {
                postsToRender.forEach(post => {
                    const card = document.createElement('a');
                    card.href = `post.html?id=${post.id}`;
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${post.imageUrl}" alt="${post.title}" loading="lazy">
                        <div class="card-content">
                            <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                            <h2>${post.title}</h2>
                            <p>${new Date(post.publishDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                    `;
                    postContainer.appendChild(card);
                });
            }
            
            loadMoreBtn.style.display = (visiblePostsCount >= filteredPosts.length) ? 'none' : 'block';
        };

        const renderTags = () => {
            const allTags = [...new Set(postsData.flatMap(p => p.tags))];
            tagsContainer.innerHTML = `<span class="tag" data-tag="">Todos</span>` + 
                                      allTags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('');
        };
        
        searchInput.addEventListener('input', (e) => {
            currentFilter.term = e.target.value;
            visiblePostsCount = 6;
            renderPosts();
        });

        tagsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                tagsContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                currentFilter.tag = e.target.dataset.tag;
                visiblePostsCount = 6;
                renderPosts();
            }
        });
        
        loadMoreBtn.addEventListener('click', () => {
            visiblePostsCount += 6;
            renderPosts();
        });
        
        renderTags();
        tagsContainer.querySelector('.tag').classList.add('active');
        renderPosts();
    };
    
    // Lógica da PÁGINA DE POST (post.html)
    const initPostPage = () => {
        const articleContent = document.getElementById('article-content'); // **LINHA ATUALIZADA**
        if (!articleContent) return;

        const params = new URLSearchParams(window.location.search);
        const postId = parseInt(params.get('id'));
        const post = postsData.find(p => p.id === postId);

        if (post) {
            document.title = `${post.title} - Meu Blog Hardcore`;
            articleContent.innerHTML = `
                <article class="post-full">
                    <header class="post-header">
                        <img src="${post.imageUrl}" alt="${post.title}" class="post-image-full" loading="lazy">
                        <h1 class="post-title-full">${post.title}</h1>
                        <div class="post-meta">
                            <span>Por ${post.author}</span> | 
                            <span>${new Date(post.publishDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                    </header>
                    <section class="post-content-full">
                        ${post.content}
                    </section>
                    <footer class="post-footer">
                        <h3>Compartilhe este post:</h3>
                        <div class="share-buttons">
                            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}" target="_blank" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" target="_blank" class="share-btn twitter"><i class="fab fa-twitter"></i> Twitter</a>
                            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" target="_blank" class="share-btn linkedin"><i class="fab fa-linkedin-in"></i> LinkedIn</a>
                        </div>
                    </footer>
                </article>
            `;
        } else {
            document.title = "Post Não Encontrado - Meu Blog Hardcore";
            articleContent.innerHTML = '<h1 class="page-title">Erro 404</h1><p class="page-description">O post que você está procurando não foi encontrado.</p>';
        }

        // Garante que o Giscus receba o tema correto após carregar
        setTimeout(updateGiscusTheme, 1500);
    };
    
    // Lógica da PÁGINA DE CONTATO (contato.html)
    const initContactPage = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            showToast(`Obrigado, ${name}! Sua mensagem foi enviada.`);
            contactForm.reset();
        });
    };

    // --- INICIALIZAÇÃO GERAL ---
    applySavedTheme();
    highlightActiveLink();
    handleScroll();
    
    toggleThemeBtn.addEventListener('click', toggleTheme);
    window.addEventListener('scroll', handleScroll);
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Roda o código específico da página atual
    if (document.getElementById('postContainer')) {
        initHomePage();
    } else if (document.getElementById('article-content')) {
        initPostPage();
    } else if (document.getElementById('contactForm')) {
        initContactPage();
    }
});
