// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Loading Screen
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }
  }, 1000);
});

// Reading Progress
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  const progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
  }
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const icon = themeToggle.querySelector('i');
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      // Light theme colors
      document.documentElement.style.setProperty('--github-dark', '#ffffff');
      document.documentElement.style.setProperty('--github-card', '#f6f8fa');
      document.documentElement.style.setProperty('--github-border', '#d1d9e0');
      document.documentElement.style.setProperty('--github-text', '#24292e');
      document.documentElement.style.setProperty('--github-text-secondary', '#586069');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      // Dark theme colors
      document.documentElement.style.setProperty('--github-dark', '#0d1117');
      document.documentElement.style.setProperty('--github-card', '#161b22');
      document.documentElement.style.setProperty('--github-border', '#30363d');
      document.documentElement.style.setProperty('--github-text', '#f0f6fc');
      document.documentElement.style.setProperty('--github-text-secondary', '#8b949e');
    }
  });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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

// Active Navigation Link
window.addEventListener('scroll', () => {
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
});

// Blog Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const blogItems = document.querySelectorAll('.blog-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    
    blogItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
        item.setAttribute('data-aos', 'fade-up');
      } else {
        item.style.display = 'none';
      }
    });
    
    AOS.refresh();
  });
});

// Back to Top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      // Implement search logic
      console.log('Searching for:', searchTerm);
      // Filter blog posts based on search term
      blogItems.forEach(item => {
        const title = item.querySelector('.blog-title').textContent.toLowerCase();
        const excerpt = item.querySelector('.blog-excerpt').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

// Image Lazy Loading
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Performance Optimization - Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
  // Scroll-based animations
}, 100));

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close modals or reset search
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.blur();
    }
  }
});

// Add loading states
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

// Load articles from JSON
async function loadArticles() {
  try {
    const response = await fetch('blog/articles.json');
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}

// Load single article from JSON
async function loadArticle(articleId) {
  try {
    const response = await fetch(`blog/${articleId}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading article:', error);
    return null;
  }
}

// Render article content
function renderArticleContent(content) {
  const container = document.querySelector('.article-content');
  if (!container) return;

  container.innerHTML = '';

  content.forEach(item => {
    let element;

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
        element.textContent = item.text;
    }

    container.appendChild(element);
  });
}

// Initialize article page
async function initArticlePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  if (articleId) {
    const article = await loadArticle(articleId);
    if (article) {
      document.title = `${article.title} - RPL SMKN 4 Banjarmasin`;
      
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
      if (imageElement) imageElement.src = article.featuredImage;
      
      // Render content
      renderArticleContent(article.content);
      
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
    }
  }
}

// Initialize blog page
async function initBlogPage() {
  const articles = await loadArticles();
  const blogContainer = document.querySelector('.blog-container');
  
  if (blogContainer && articles.length > 0) {
    blogContainer.innerHTML = '';
    
    articles.forEach(article => {
      const articleCard = document.createElement('div');
      articleCard.className = 'col-md-6 blog-item';
      articleCard.setAttribute('data-category', article.category.toLowerCase());
      
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
  }
}

// Check current page and initialize accordingly
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.article-page')) {
    initArticlePage();
  } else if (document.querySelector('.blog-page')) {
    initBlogPage();
  }
});