// Roda o script quando o DOM está completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS GLOBAIS ---
    const body = document.body;
    const nav = document.getElementById('mainNav');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const preloader = document.querySelector('.preloader');
    const toast = document.getElementById('toast');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.querySelector('.nav-links');

    // --- FUNÇÕES GLOBAIS ---

    // Envia o tema atual para o iframe do Giscus
    const updateGiscusTheme = () => {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (iframe) {
            // Usando temas Giscus padrão
            const theme = body.classList.contains('light') ? 'light' : 'github-dark'; 
            iframe.contentWindow.postMessage({ giscus: { setTheme: theme } }, 'https://giscus.app');
        }
    };

    // Lógica do Menu Hambúrguer
    const toggleNav = () => {
        body.classList.toggle('nav-open');
    };

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', toggleNav);
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                body.classList.remove('nav-open');
            }
        });
    }

    // Esconde o preloader
    const hidePreloader = () => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    };

    // Lida com eventos de scroll (nav e botão de topo)
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            if(backToTopBtn) backToTopBtn.classList.add('visible');
        } else {
            nav.classList.remove('scrolled');
            if(backToTopBtn) backToTopBtn.classList.remove('visible');
        }
    };

    // Destaca o link de navegação da página atual
    const highlightActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    // Mostra uma notificação (toast)
    const showToast = (message, type = 'success') => {
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast visible ${type}`;
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    };
    
    // Alterna o tema e atualiza o Giscus
    const toggleTheme = () => {
        body.classList.toggle('light');
        localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
        updateGiscusTheme(); // Apenas envia a mensagem para o Giscus
    };

    // Aplica o tema salvo no carregamento da página
    const applySavedTheme = () => {
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light');
        }
    };

    // --- LÓGICA ESPECÍFICA DE CADA PÁGINA ---

    const initHomePage = () => {
        const postContainer = document.getElementById('postContainer');
        if (!postContainer) return;

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

            postContainer.innerHTML = '';
            const postsToRender = filteredPosts.slice(0, visiblePostsCount);
            
            if (postsToRender.length === 0) {
                postContainer.innerHTML = '<p class="no-results">Nenhum post encontrado.</p>';
            } else {
                postsToRender.forEach(post => {
                    const card = document.createElement('a');
                    card.href = `post.html?id=${post.id}`;
                    card.className = 'card';
                    card.innerHTML = `<img src="${post.imageUrl}" alt="${post.title}" loading="lazy"><div class="card-content"><div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div><h2>${post.title}</h2><p>${new Date(post.publishDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p></div>`;
                    postContainer.appendChild(card);
                });
            }
            
            loadMoreBtn.style.display = (visiblePostsCount >= filteredPosts.length) ? 'none' : 'block';
        };

        const renderTags = () => {
            const allTags = [...new Set(postsData.flatMap(p => p.tags))];
            tagsContainer.innerHTML = `<span class="tag active" data-tag="">Todos</span>` + allTags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('');
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
        renderPosts();
        hidePreloader();
    };
    
    const initPostPage = () => {
        const articleContent = document.getElementById('article-content');
        if (!articleContent) return;
        
        const params = new URLSearchParams(window.location.search);
        const postId = parseInt(params.get('id'));
        const post = postsData.find(p => p.id === postId);
        
        if (post) {
            document.title = `${post.title} - Meu Blog Hardcore`;
            articleContent.innerHTML = `<article class="post-full"><header class="post-header"><img src="${post.imageUrl}" alt="${post.title}" class="post-image-full" loading="lazy"><h1 class="post-title-full">${post.title}</h1><div class="post-meta"><span>Por ${post.author}</span> | <span>${new Date(post.publishDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div><div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div></header><section class="post-content-full">${post.content}</section><footer class="post-footer"><h3>Partilhe este post:</h3><div class="share-buttons"><a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}" target="_blank" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" target="_blank" class="share-btn twitter"><i class="fab fa-twitter"></i> Twitter</a><a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" target="_blank" class="share-btn linkedin"><i class="fab fa-linkedin-in"></i> LinkedIn</a></div></footer></article>`;
        } else {
            document.title = "Post Não Encontrado - Meu Blog Hardcore";
            articleContent.innerHTML = '<h1 class="page-title">Erro 404</h1><p class="page-description">O post que procura não foi encontrado.</p>';
        }

        // Sincroniza o tema do Giscus no carregamento inicial da página
        const giscusSync = setInterval(() => {
            const iframe = document.querySelector('iframe.giscus-frame');
            if (iframe) {
                updateGiscusTheme();
                clearInterval(giscusSync); // Para de verificar uma vez que encontrou
            }
        }, 500); // Verifica a cada meio segundo

        hidePreloader();
    };
    
    const initStaticPage = () => {
        hidePreloader();
    };

    const initContactPage = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const submitBtn = document.getElementById('submitBtn');
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const action = contactForm.getAttribute('action');

            try {
                const response = await fetch(action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast('Obrigado! A sua mensagem foi enviada com sucesso.', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        const errorMsg = data["errors"].map(error => error["message"]).join(", ");
                        showToast(`Erro: ${errorMsg}`, 'error');
                    } else {
                        showToast('Ops! Ocorreu um erro ao enviar a sua mensagem.', 'error');
                    }
                }
            } catch (error) {
                showToast('Ops! Ocorreu um erro de rede. Tente novamente.', 'error');
            } finally {
                submitBtn.classList.remove('submitting');
                submitBtn.disabled = false;
            }
        });

        initStaticPage();
    };

    // --- INICIALIZAÇÃO GERAL ---
    
    applySavedTheme();
    highlightActiveLink();
    handleScroll();
    
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', toggleTheme);
    }
    window.addEventListener('scroll', handleScroll);
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Roda o código específico da página atual
    if (document.getElementById('postContainer')) {
        initHomePage();
    } else if (document.getElementById('article-content')) {
        initPostPage();
    } else if (document.getElementById('contactForm')) {
        initContactPage();
    } else {
        initStaticPage(); // Para páginas simples como "Sobre"
    }
});
