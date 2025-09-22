/**
 * @file Main script for the blog, handling dynamic content, interactions, and page-specific logic.
 * @author Alves Pataca
 */

/**
 * Main entry point of the script.
 * This event listener waits for the DOM to be fully loaded before executing the script.
 * It initializes all the global functionalities and page-specific logic.
 * @event DOMContentLoaded
 */
/**
 * Formats a date string into a localized string.
 * @param {string} dateString - The date string to format (e.g., 'YYYY-MM-DD').
 * @returns {string} The formatted date string.
 */
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    });
};

document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL ELEMENTS ---
    const body = document.body;
    const nav = document.getElementById('mainNav');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const preloader = document.querySelector('.preloader');
    const toast = document.getElementById('toast');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.querySelector('.nav-links');

    // --- GLOBAL FUNCTIONS ---

    /**
     * Loads the Giscus comment script with the correct theme.
     * It finds the Giscus container, clears it, and injects a new script tag
     * configured with the repository details and the current theme.
     */
    const loadGiscus = () => {
        const container = document.getElementById('giscus-container');
        if (!container) return; // Only runs on the post page

        container.innerHTML = ''; // Clears the container for reloading
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';

        // Attributes to configure Giscus
        script.setAttribute('data-repo', 'AlvesPataca/meuBlog');
        script.setAttribute('data-repo-id', 'R_kgDOPzTnBQ');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOPzTnBc4CvqPl');
        script.setAttribute('data-mapping', 'title');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-lang', 'pt');

        // Sets the theme based on the body class
        const currentTheme = body.classList.contains('light') ? 'light' : 'dark';
        script.setAttribute('data-theme', currentTheme);

        container.appendChild(script);
    };

    /**
     * Toggles the mobile navigation menu by adding or removing the 'nav-open' class from the body.
     */
    const toggleNav = () => {
        body.classList.toggle('nav-open');
    };

    /**
     * Handles clicks on the hamburger button and navigation links for mobile menu functionality.
     */
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', toggleNav);
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                body.classList.remove('nav-open');
            }
        });
    }

    /**
     * Hides the preloader animation by adding the 'hidden' class.
     */
    const hidePreloader = () => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    };

    /**
     * Handles scroll events to manage the appearance of the navigation bar and the 'back to top' button.
     * The nav gets a 'scrolled' class, and the button becomes visible after scrolling 50px down.
     */
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            if(backToTopBtn) backToTopBtn.classList.add('visible');
        } else {
            nav.classList.remove('scrolled');
            if(backToTopBtn) backToTopBtn.classList.remove('visible');
        }
    };

    /**
     * Highlights the active navigation link based on the current page's URL.
     */
    const highlightActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    /**
     * Displays a toast notification message.
     * @param {string} message - The message to display in the toast.
     * @param {string} [type='success'] - The type of toast ('success' or 'error'), which affects its styling.
     */
    const showToast = (message, type = 'success') => {
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast visible ${type}`;
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    };

    /**
     * Toggles the theme between light and dark mode, saves the preference to localStorage,
     * and reloads the Giscus comments to match the new theme.
     */
    const toggleTheme = () => {
        body.classList.toggle('light');
        localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
        loadGiscus(); // Reloads Giscus with the new theme
    };

    /**
     * Applies the theme saved in localStorage when the page loads.
     */
    const applySavedTheme = () => {
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light');
        }
    };

    // --- PAGE-SPECIFIC LOGIC ---

    /**
     * Initializes the home page functionality, including rendering posts and setting up filters.
     */
    const initHomePage = () => {
        const postContainer = document.getElementById('postContainer');
        if (!postContainer) return;

        const searchInput = document.getElementById('searchInput');
        const tagsContainer = document.getElementById('tagsContainer');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        let currentFilter = { term: '', tag: '' };
        let visiblePostsCount = 6;

        /**
         * Renders the list of blog posts based on the current search and tag filters.
         * It clears the post container and populates it with post cards.
         * It also controls the visibility of the "Load More" button.
         */
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
                    card.innerHTML = `<img src="${post.imageUrl}" alt="${post.title}" loading="lazy"><div class="card-content"><div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div><h2>${post.title}</h2><p>${formatDate(post.publishDate)}</p></div>`;
                    postContainer.appendChild(card);
                });
            }

            loadMoreBtn.style.display = (visiblePostsCount >= filteredPosts.length) ? 'none' : 'block';
        };

        /**
         * Renders the available tag filters based on the unique tags in the posts data.
         */
        const renderTags = () => {
            const allTags = [...new Set(postsData.flatMap(p => p.tags))];
            tagsContainer.innerHTML = `<span class="tag active" data-tag="">Todos</span>` + allTags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('');
        };

        /**
         * Event listener for the search input. Updates the filter and re-renders the posts.
         * @param {Event} e - The input event object.
         */
        searchInput.addEventListener('input', (e) => {
            currentFilter.term = e.target.value;
            visiblePostsCount = 6;
            renderPosts();
        });

        /**
         * Event listener for the tags container. Updates the filter and re-renders the posts.
         * @param {Event} e - The click event object.
         */
        tagsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                tagsContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                currentFilter.tag = e.target.dataset.tag;
                visiblePostsCount = 6;
                renderPosts();
            }
        });

        /**
         * Event listener for the "Load More" button. Increases the number of visible posts and re-renders them.
         */
        loadMoreBtn.addEventListener('click', () => {
            visiblePostsCount += 6;
            renderPosts();
        });

        renderTags();
        renderPosts();
        hidePreloader();
    };

    /**
     * Initializes the individual post page, loading the correct post content based on the URL parameter.
     */
    const initPostPage = () => {
        const articleContent = document.getElementById('article-content');
        if (!articleContent) return;

        const params = new URLSearchParams(window.location.search);
        const postId = parseInt(params.get('id'));
        const post = postsData.find(p => p.id === postId);

        if (post) {
            document.title = `${post.title} - Meu Blog Hardcore`;
            articleContent.innerHTML = `<article class="post-full"><header class="post-header"><img src="${post.imageUrl}" alt="${post.title}" class="post-image-full" loading="lazy"><h1 class="post-title-full">${post.title}</h1><div class="post-meta"><span>Por ${post.author}</span> | <span>${formatDate(post.publishDate)}</span></div><div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div></header><section class="post-content-full">${post.content}</section><footer class="post-footer"><h3>Partilhe este post:</h3><div class="share-buttons"><a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}" target="_blank" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" target="_blank" class="share-btn twitter"><i class="fab fa-twitter"></i> Twitter</a><a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" target="_blank" class="share-btn linkedin"><i class="fab fa-linkedin-in"></i> LinkedIn</a></div></footer></article>`;
        } else {
            document.title = "Post Não Encontrado - Meu Blog Hardcore";
            articleContent.innerHTML = '<h1 class="page-title">Erro 404</h1><p class="page-description">O post que procura não foi encontrado.</p>';
        }

        loadGiscus(); // Loads Giscus for the first time
        hidePreloader();
    };

    /**
     * Initializes static pages (like "About") by simply hiding the preloader.
     */
    const initStaticPage = () => {
        hidePreloader();
    };

    /**
     * Initializes the contact page, setting up the form submission logic with validation and feedback.
     */
    const initContactPage = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const submitBtn = document.getElementById('submitBtn');

        /**
         * Handles the contact form submission.
         * @param {Event} e - The submit event object.
         */
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

    // --- GENERAL INITIALIZATION ---

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

    // Runs the specific code for the current page
    if (document.getElementById('postContainer')) {
        initHomePage();
    } else if (document.getElementById('article-content')) {
        initPostPage();
    } else if (document.getElementById('contactForm')) {
        initContactPage();
    } else {
        initStaticPage(); // For simple pages like "About"
    }
});

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = { formatDate };
}
