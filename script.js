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
const heroImage = document.getElementById('hero-main-image');
const whoImage = document.getElementById('who-image');

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
    if (heroImage) {
        const heroSrc = imageMap.hero[breakpoint] || imageMap.hero[1920];
        if (heroImage.src !== new URL(heroSrc, window.location.href).href) {
            heroImage.src = heroSrc;
        }
    }
    
    // Update who image
    if (whoImage) {
        const whoSrc = imageMap.who[breakpoint] || imageMap.who[1920];
        if (whoImage.src !== new URL(whoSrc, window.location.href).href) {
            whoImage.src = whoSrc;
        }
    }
}

// Initialize images with retry mechanism
function initImages() {
    let attempts = 0;
    const maxAttempts = 5;
    
    function tryInit() {
        attempts++;
        const heroImg = document.getElementById('hero-main-image');
        const whoImg = document.getElementById('who-image');
        
        if (heroImg && whoImg) {
            updateImages();
        } else if (attempts < maxAttempts) {
            setTimeout(tryInit, 100);
        } else {
            console.error('Failed to find images after multiple attempts');
            // Fallback to 1920px images
            if (heroImg) heroImg.src = imageMap.hero[1920];
            if (whoImg) whoImg.src = imageMap.who[1920];
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
const debouncedCheckScreenWidth = debounce(checkScreenWidth, 150);

// Screen width check for redirect
function checkScreenWidth() {
    if (window.innerWidth <= 440) {
        window.location.replace('index2.html');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initImages();
    checkScreenWidth();
    initGallery();
});

window.addEventListener('load', () => {
    initImages();
    updateImages();
});

window.addEventListener('resize', () => {
    debouncedUpdateImages();
    debouncedCheckScreenWidth();
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

