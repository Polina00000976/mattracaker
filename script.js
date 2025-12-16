// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('loadingProgressBar');
    
    if (!loadingScreen || !progressBar) return;
    
    let progress = 0;
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);
    
    const progressInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Hide loading screen after completion
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 300);
        }
        progressBar.style.width = progress + '%';
    }, interval);
}

// Initialize loading screen immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen);
} else {
    initLoadingScreen();
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    }
});

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav) {
                    nav.classList.remove('active');
                }
            }
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
    
    lastScroll = currentScroll;
});

// Dynamic image updates based on screen width
const imageMap = {
    hero: {
        1920: 'img/mainpng1920.png',
        1366: 'img/mainpng1366.png',
        1194: 'img/mainpng1194.png',
        834: 'img/mainpng834.png',
        375: 'img/mainpng375.png'
    },
    who: {
        1920: 'img/who1920.svg',
        1366: 'img/who1366.svg',
        1194: 'img/who1194.svg',
        834: 'img/who834.svg',
        375: 'img/who375.svg'
    }
};

function getBreakpoint(width) {
    if (width >= 1920) return 1920;
    if (width >= 1366) return 1366;
    if (width >= 1194) return 1194;
    if (width >= 834) return 834;
    return 375;
}

function updateImages() {
    const width = window.innerWidth;
    const breakpoint = getBreakpoint(width);
    
    // Update hero image
    const heroImg = document.getElementById('hero-main-image');
    if (heroImg) {
        const heroSrc = imageMap.hero[breakpoint] || imageMap.hero[1920];
        // Get current src and normalize it
        let currentSrc = heroImg.getAttribute('src') || heroImg.src;
        // Remove query parameters and hash
        currentSrc = currentSrc.split('?')[0].split('#')[0];
        
        // Normalize paths for comparison
        const normalizedCurrent = currentSrc.replace(window.location.origin, '').replace(/^\/+/, '');
        const normalizedNew = heroSrc.replace(/^\/+/, '');
        
        if (normalizedCurrent !== normalizedNew) {
            heroImg.src = heroSrc;
            console.log('Hero image updated to:', heroSrc, 'for breakpoint:', breakpoint, 'width:', width);
        }
    } else {
        console.warn('Hero image element not found');
    }
    
    // Update who image (optional, may not exist)
    const whoImg = document.getElementById('who-image');
    if (whoImg) {
        const whoSrc = imageMap.who[breakpoint] || imageMap.who[1920];
        let currentSrc = whoImg.getAttribute('src') || whoImg.src;
        currentSrc = currentSrc.split('?')[0].split('#')[0];
        
        const normalizedCurrent = currentSrc.replace(window.location.origin, '').replace(/^\/+/, '');
        const normalizedNew = whoSrc.replace(/^\/+/, '');
        
        if (normalizedCurrent !== normalizedNew) {
            whoImg.src = whoSrc;
            console.log('Who image updated to:', whoSrc, 'for breakpoint:', breakpoint, 'width:', width);
        }
    }
}

// Initialize images with retry mechanism
function initImages() {
    let attempts = 0;
    const maxAttempts = 10;
    
    function tryInit() {
        attempts++;
        const heroImg = document.getElementById('hero-main-image');
        const whoImg = document.getElementById('who-image');
        
        if (heroImg) {
            updateImages();
            console.log('Images initialized, current width:', window.innerWidth);
        } else if (attempts < maxAttempts) {
            setTimeout(tryInit, 100);
        } else {
            console.error('Failed to find hero image after multiple attempts');
        }
        
        // who-image может отсутствовать, это нормально
        if (whoImg) {
            updateImages();
        }
    }
    
    tryInit();
}

// Debounce function
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

// Debounced resize handler
const debouncedUpdateImages = debounce(updateImages, 150);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize immediately
    const width = window.innerWidth;
    const breakpoint = getBreakpoint(width);
    console.log('DOMContentLoaded - Width:', width, 'Breakpoint:', breakpoint);
    
    initImages();
    initGallery();
    
    // Force update after a short delay to ensure images are in DOM
    setTimeout(() => {
        updateImages();
    }, 100);
});

window.addEventListener('load', () => {
    console.log('Window loaded - Width:', window.innerWidth);
    updateImages();
});

window.addEventListener('resize', () => {
    console.log('Resize event - Width:', window.innerWidth);
    debouncedUpdateImages();
});

// Tab switching in browser card
const tabs = document.querySelectorAll('.tab');
const posts = document.querySelectorAll('.post');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Gallery carousel
function initGallery() {
    const galleryImages = ['img/page1.png', 'img/page2.png', 'img/page3.png'];
    let currentGalleryIndex = 0;
    let isAnimating = false;

    const pageImg = document.getElementById('pageimg');
    const galleryArrowLeft = document.querySelector('.gallery-arrow-left');
    const galleryArrowRight = document.querySelector('.gallery-arrow-right');

    if (!pageImg || !galleryArrowLeft || !galleryArrowRight) {
        console.log('Gallery elements not found, retrying...');
        setTimeout(initGallery, 100);
        return;
    }

    function updateGalleryImage() {
        if (pageImg && !isAnimating) {
            isAnimating = true;
            pageImg.style.opacity = '0';
            pageImg.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                pageImg.src = galleryImages[currentGalleryIndex];
                pageImg.style.opacity = '1';
                pageImg.style.transform = 'scale(1)';
                setTimeout(() => {
                    isAnimating = false;
                }, 300);
            }, 150);
        }
    }

    galleryArrowLeft.addEventListener('click', () => {
        if (!isAnimating) {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
            updateGalleryImage();
        }
    });

    galleryArrowRight.addEventListener('click', () => {
        if (!isAnimating) {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
            updateGalleryImage();
        }
    });
}

// Scroll animations for feature items
const featureItems = document.querySelectorAll('.feature-item');

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
        }
    });
}, observerOptions);

featureItems.forEach(item => {
    // Remove inline styles if they exist, CSS will handle initial state
    if (item.hasAttribute('style')) {
        item.removeAttribute('style');
    }
    // Ensure initial state is set (CSS handles it, but JS ensures it)
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    featureObserver.observe(item);
});

// Scroll animations for FAQ items
const faqItemsForAnimation = document.querySelectorAll('.faq-item');

const faqObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

faqItemsForAnimation.forEach(item => {
    // Remove inline styles if they exist, CSS will handle it
    if (item.hasAttribute('style')) {
        item.removeAttribute('style');
    }
    // Set initial state
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    faqObserver.observe(item);
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

// Custom Cursor with Trail Effect (Desktop only)
function initCustomCursor() {
    if (window.innerWidth <= 834) {
        return; // Don't initialize on mobile
    }
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const trails = [];
    let trailCount = 0;
    const maxTrails = 10;

    document.addEventListener('mousemove', (e) => {
        // Update cursor position
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Create trail
        if (trailCount % 3 === 0) { // Create trail every 3rd movement for performance
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            document.body.appendChild(trail);

            trails.push(trail);

            // Remove trail after animation
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
                const index = trails.indexOf(trail);
                if (index > -1) {
                    trails.splice(index, 1);
                }
            }, 500);

            // Limit number of trails
            if (trails.length > maxTrails) {
                const oldTrail = trails.shift();
                if (oldTrail && oldTrail.parentNode) {
                    oldTrail.parentNode.removeChild(oldTrail);
                }
            }
        }
        trailCount++;
    });

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .btn, .faq-question, .gallery-arrow');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, rgba(176, 242, 234, 0.9) 0%, rgba(221, 212, 255, 0.6) 100%)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(221, 212, 255, 0.9) 0%, rgba(176, 242, 234, 0.6) 100%)';
        });
    });
}

// Initialize custom cursor
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
});

// Re-check on resize
window.addEventListener('resize', () => {
    const cursor = document.querySelector('.custom-cursor');
    if (window.innerWidth <= 834 && cursor) {
        cursor.remove();
    } else if (window.innerWidth > 834 && !cursor) {
        initCustomCursor();
    }
});

