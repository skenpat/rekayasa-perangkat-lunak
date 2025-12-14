// IIFE for encapsulation
(function() {
    'use strict';

    // Cache DOM elements
    const elements = {
        loader: document.getElementById('loader'),
        readingProgress: document.getElementById('readingProgress'),
        themeToggle: document.getElementById('themeToggle'),
        navbar: document.getElementById('navbar'),
        backToTop: document.getElementById('backToTop'),
        searchInput: document.querySelector('.search-input'),
        searchBtn: document.querySelector('.search-btn'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        blogItems: document.querySelectorAll('.blog-item')
    };

    // Utility functions
    const utils = {
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        handleError: (error, context = '') => {
            console.error(`Error in ${context}:`, error);
            // Show user-friendly error message
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-container';
            errorContainer.innerHTML = `
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 class="error-title">Oops! Something went wrong</h2>
                <p class="error-message">We're working to fix the issue. Please try again later.</p>
            `;
            document.body.appendChild(errorContainer);
            setTimeout(() => errorContainer.remove(), 5000);
        },

        loadScript: (src, async = true, defer = true) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = async;
                script.defer = defer;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    };

    // Initialize AOS
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        }
    };

    // Loading Screen
    const initLoader = () => {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (elements.loader) {
                    elements.loader.style.opacity = '0';
                    elements.loader.style.visibility = 'hidden';
                }
            }, 1000);
        });
    };

    // Reading Progress
    const initReadingProgress = () => {
        const updateProgress = utils.throttle(() => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            if (elements.readingProgress) {
                elements.readingProgress.style.width = `${scrollPercent}%`;
            }
        }, 16);

        window.addEventListener('scroll', updateProgress);
    };

    // Theme Toggle
    const initThemeToggle = () => {
        if (!elements.themeToggle) return;

        const icon = elements.themeToggle.querySelector('i');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        
        // Apply saved theme
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            updateThemeColors(true);
        }

        elements.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            if (isLight) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
            
            updateThemeColors(isLight);
        });
    };

    const updateThemeColors = (isLight) => {
        if (isLight) {
            document.documentElement.style.setProperty('--github-dark', '#ffffff');
            document.documentElement.style.setProperty('--github-card', '#f6f8fa');
            document.documentElement.style.setProperty('--github-border', '#d1d9e0');
            document.documentElement.style.setProperty('--github-text', '#24292e');
            document.documentElement.style.setProperty('--github-text-secondary', '#586069');
        } else {
            document.documentElement.style.setProperty('--github-dark', '#0d1117');
            document.documentElement.style.setProperty('--github-card', '#161b22');
            document.documentElement.style.setProperty('--github-border', '#30363d');
            document.documentElement.style.setProperty('--github-text', '#f0f6fc');
            document.documentElement.style.setProperty('--github-text-secondary', '#8b949e');
        }
    };

    // Navbar Scroll Effect
    const initNavbar = () => {
        const handleScroll = utils.throttle(() => {
            if (elements.navbar) {
                if (window.scrollY > 50) {
                    elements.navbar.classList.add('scrolled');
                } else {
                    elements.navbar.classList.remove('scrolled');
                }
            }
        }, 16);

        window.addEventListener('scroll', handleScroll);
    };

    // Smooth Scrolling
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Active Navigation Link
    const initActiveNav = () => {
        const handleScroll = utils.throttle(() => {
            let current = '';
            const sections = document.querySelectorAll('section, header');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        }, 16);

        window.addEventListener('scroll', handleScroll);
    };

    // Blog Filter
    const initBlogFilter = () => {
        if (!elements.filterBtns.length || !elements.blogItems.length) return;

        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                elements.blogItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.setAttribute('data-aos', 'fade-up');
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            });
        });
    };

    // Back to Top
    const initBackToTop = () => {
        if (!elements.backToTop) return;

        const handleScroll = utils.throttle(() => {
            if (window.scrollY > 300) {
                elements.backToTop.classList.add('show');
            } else {
                elements.backToTop.classList.remove('show');
            }
        }, 16);

        window.addEventListener('scroll', handleScroll);
        
        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // Search Functionality
    const initSearch = () => {
        if (!elements.searchBtn || !elements.searchInput) return;

        const performSearch = () => {
            const searchTerm = elements.searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                elements.blogItems.forEach(item => {
                    const title = item.querySelector('.blog-title')?.textContent.toLowerCase() || '';
                    const excerpt = item.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
                    
                    if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            } else {
                // Reset display if search is empty
                elements.blogItems.forEach(item => {
                    item.style.display = 'block';
                });
            }
        };

        elements.searchBtn.addEventListener('click', performSearch);
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Clear search on escape
        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                elements.searchInput.value = '';
                elements.searchInput.blur();
                elements.blogItems.forEach(item => {
                    item.style.display = 'block';
                });
            }
        });
    };

    // Image Lazy Loading
    const initLazyLoading = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };

    // API Service
    const apiService = {
        async fetchArticles() {
            try {
                const response = await fetch('blog/articles.json', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'max-age=3600'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                utils.handleError(error, 'fetchArticles');
                return { articles: [] };
            }
        },

        async fetchArticle(articleId) {
            try {
                const response = await fetch(`blog/${articleId}.json`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'max-age=3600'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                utils.handleError(error, 'fetchArticle');
                return null;
            }
        }
    };

    // Article Renderer
    const articleRenderer = {
        renderArticleContent(content) {
            const container = document.querySelector('.article-content');
            if (!container) return;

            container.innerHTML = '';

            content.forEach(item => {
                let element;

                try {
                    switch (item.type) {
                        case 'heading':
                            element = document.createElement(`h${item.level}`);
                            element.textContent = item.text;
                            break;
                        case 'paragraph':
                            element = document.createElement('p');
                            element.textContent = item.text;
                            break;
                        case 'list':
                            element = document.createElement('ul');
                            item.items.forEach(liText => {
                                const li = document.createElement('li');
                                li.textContent = liText;
                                element.appendChild(li);
                            });
                            break;
                        case 'quote':
                            element = document.createElement('blockquote');
                            element.innerHTML = `<p>${item.text}</p><cite>${item.author}</cite>`;
                            break;
                        default:
                            element = document.createElement('div');
                            element.textContent = item.text || '';
                    }

                    if (element) {
                        container.appendChild(element);
                    }
                } catch (error) {
                    utils.handleError(error, 'renderArticleContent');
                }
            });
        },

        async renderArticlePage() {
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('id');

            if (articleId) {
                const article = await apiService.fetchArticle(articleId);
                if (article) {
                    // Update document title
                    document.title = `${article.title} - RPL SMK Negeri 4 Banjarmasin`;
                    
                    // Update meta tags
                    this.updateMetaTags(article);
                    
                    // Update article header
                    const titleElement = document.querySelector('.article-title');
                    if (titleElement) titleElement.textContent = article.title;
                    
                    const authorElement = document.querySelector('.article-author');
                    if (authorElement) authorElement.textContent = article.author;
                    
                    const dateElement = document.querySelector('.article-date');
                    if (dateElement) dateElement.textContent = article.date;
                    
                    const readTimeElement = document.querySelector('.article-read-time');
                    if (readTimeElement) readTimeElement.textContent = article.readTime;
                    
                    const imageElement = document.querySelector('.article-featured-image');
                    if (imageElement) {
                        imageElement.src = article.featuredImage;
                        imageElement.alt = article.title;
                    }
                    
                    // Render content
                    this.renderArticleContent(article.content);
                    
                    // Render tags
                    const tagsContainer = document.querySelector('.article-tags');
                    if (tagsContainer) {
                        tagsContainer.innerHTML = '';
                        article.tags.forEach(tag => {
                            const tagElement = document.createElement('span');
                            tagElement.className = 'blog-tag';
                            tagElement.textContent = tag;
                            tagsContainer.appendChild(tagElement);
                        });
                    }
                } else {
                    this.showError('Article not found');
                }
            }
        },

        updateMetaTags(article) {
            // Update Open Graph tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = article.title;

            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) ogDescription.content = article.excerpt || '';

            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) ogImage.content = article.featuredImage;

            // Update Twitter Card tags
            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) twitterTitle.content = article.title;

            const twitterDescription = document.querySelector('meta[name="twitter:description"]');
            if (twitterDescription) twitterDescription.content = article.excerpt || '';

            const twitterImage = document.querySelector('meta[name="twitter:image"]');
            if (twitterImage) twitterImage.content = article.featuredImage;
        },

        showError(message) {
            const container = document.querySelector('.article-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-container">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h2 class="error-title">Article Not Found</h2>
                        <p class="error-message">${message}</p>
                        <a href="blog.html" class="btn btn-primary">Back to Blog</a>
                    </div>
                `;
            }
        }
    };

    // Blog Renderer
    const blogRenderer = {
        async renderBlogPage() {
            const articles = await apiService.fetchArticles();
            const blogContainer = document.querySelector('.blog-container');
            
            if (blogContainer && articles.articles) {
                blogContainer.innerHTML = '';
                
                articles.articles.forEach(article => {
                    const articleCard = document.createElement('div');
                    articleCard.className = 'col-md-6 blog-item';
                    articleCard.setAttribute('data-category', article.category.toLowerCase());
                    articleCard.setAttribute('data-aos', 'fade-up');
                    
                    articleCard.innerHTML = `
                        <div class="blog-card">
                            <div class="blog-img-wrapper">
                                <img src="${article.image}" alt="${article.title}" class="blog-img" loading="lazy">
                                <span class="blog-date">${article.date}</span>
                            </div>
                            <div class="blog-body">
                                <div class="blog-meta">
                                    <span><i class="fas fa-user"></i> ${article.author}</span>
                                    <span><i class="fas fa-clock"></i> ${article.readTime}</span>
                                </div>
                                <h3 class="blog-title">${article.title}</h3>
                                <p class="blog-excerpt">${article.excerpt}</p>
                                <div class="blog-tags">
                                    ${article.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                                </div>
                                <a href="article.html?id=${article.id}" class="btn btn-primary mt-3">Baca Selengkapnya</a>
                            </div>
                        </div>
                    `;
                    
                    blogContainer.appendChild(articleCard);
                });

                // Reinitialize AOS for new elements
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }
        }
    };

    // Performance Monitoring
    const performanceMonitor = {
        init() {
            if ('performance' in window) {
                // Track page load performance
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        console.log('Page Load Performance:', {
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                            firstPaint: perfData.responseEnd - perfData.fetchStart
                        });
                    }, 0);
                });

                // Track long tasks
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach((entry) => {
                            if (entry.duration > 50) {
                                console.warn('Long task detected:', entry);
                            }
                        });
                    });
                    observer.observe({ entryTypes: ['longtask'] });
                }
            }
        }
    };

    // Service Worker Registration
    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    };

    // Initialize everything
    const init = () => {
        try {
            // Initialize core features
            initLoader();
            initReadingProgress();
            initThemeToggle();
            initNavbar();
            initSmoothScroll();
            initActiveNav();
            initBackToTop();
            initSearch();
            initLazyLoading();
            initBlogFilter();
            initAOS();
            
            // Initialize performance monitoring
            performanceMonitor.init();
            
            // Register service worker
            registerServiceWorker();
            
            // Initialize page-specific features
            if (document.querySelector('.article-page')) {
                articleRenderer.renderArticlePage();
            } else if (document.querySelector('.blog-page')) {
                blogRenderer.renderBlogPage();
            }
            
            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Close modals or reset search
                    if (elements.searchInput) {
                        elements.searchInput.value = '';
                        elements.searchInput.blur();
                    }
                }
            });
            
            // Add loading states to buttons
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (!this.classList.contains('no-loading')) {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                        this.disabled = true;
                        
                        setTimeout(() => {
                            this.innerHTML = originalText;
                            this.disabled = false;
                        }, 2000);
                    }
                });
            });
            
            console.log('RPL SMKN 4 Website initialized successfully');
        } catch (error) {
            utils.handleError(error, 'init');
        }
    };

    // Start the application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();