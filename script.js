// DOM Elements
const themeToggleButtons = document.querySelectorAll('.theme-toggle');
const langButtons = document.querySelectorAll('.lang-btn');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelectorAll('.nav-link');
const carSlides = document.querySelectorAll('.car-slide');
const sliderPrevBtn = document.querySelector('.slider-prev');
const sliderNextBtn = document.querySelector('.slider-next');
const contactForm = document.querySelector('.contact-form');
const body = document.body;

// Current state
let currentTheme = localStorage.getItem('theme') || 'light';
let currentLang = localStorage.getItem('language') || 'fa';
let currentSlide = 0;

// Initialize the page
function init() {
    // Set initial theme
    setTheme(currentTheme);
    
    // Set initial language
    setLanguage(currentLang);
    
    // Initialize car slider
    initCarSlider();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize form submission
    initContactForm();
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Theme functionality
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    }
    
    // Update toggle buttons
    themeToggleButtons.forEach(btn => {
        const moonIcon = btn.querySelector('.fa-moon');
        const sunIcon = btn.querySelector('.fa-sun');
        
        if (theme === 'dark') {
            moonIcon.style.opacity = '0';
            sunIcon.style.opacity = '1';
        } else {
            moonIcon.style.opacity = '1';
            sunIcon.style.opacity = '0';
        }
    });
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}

// Language functionality
function setLanguage(lang) {
    // Update UI for language buttons
    langButtons.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Set direction and font based on language
    if (lang === 'en') {
        body.setAttribute('dir', 'ltr');
        body.style.fontFamily = 'Poppins, sans-serif';
    } else {
        body.setAttribute('dir', 'rtl');
        body.style.fontFamily = 'Vazirmatn, sans-serif';
    }
    
    // Update all translatable elements
    updateTextContent(lang);
    
    // Save to localStorage
    localStorage.setItem('language', lang);
    currentLang = lang;

    function changeLanguage(lang) {
    // فرض می‌کنیم translations شیء اصلی ترجمه است
    const t = translations[lang];

    // به‌روزرسانی سایر عناصر (مثال‌های قبلی)
    document.getElementById('someElement').innerText = t.someKey;

     // به‌روزرسانی لوگو
     document.getElementById('logo-title').innerText = t.logo.title;
    document.getElementById('logo-subtitle').innerText = t.logo.subtitle;
}
}

// Update text content based on language
function updateTextContent(lang) {
    const translations = window.translations[lang];
    
    // Update elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        
        // Navigate through the translation object using the key path
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = `[${key}]`; // Fallback if translation not found
                break;
            }
        }
        
        // Set the content based on element type
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = value;
        } else {
            element.textContent = value;
        }
    });
}

// Car slider functionality
function initCarSlider() {
    // Set initial slide
    showSlide(currentSlide);
    
    // Add event listeners for slider controls
    if (sliderPrevBtn) {
        sliderPrevBtn.addEventListener('click', showPrevSlide);
    }
    
    if (sliderNextBtn) {
        sliderNextBtn.addEventListener('click', showNextSlide);
    }
    
    // Auto-advance slides every 5 seconds
    setInterval(showNextSlide, 5000);
}

function showSlide(index) {
    // Ensure index is within bounds
    if (index >= carSlides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = carSlides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Hide all slides
    carSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    carSlides[currentSlide].classList.add('active');
}

function showNextSlide() {
    showSlide(currentSlide + 1);
}

function showPrevSlide() {
    showSlide(currentSlide - 1);
}

// Mobile menu functionality
function initMobileMenu() {
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const navLinksContainer = document.querySelector('.nav-links');
    navLinksContainer.classList.toggle('mobile-visible');
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navLinksContainer = document.querySelector('.nav-links');
                navLinksContainer.classList.remove('mobile-visible');
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink();
            }
        });
    });
}

// Update active nav link based on scroll position
function updateActiveNavLink() {
    let currentSection = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Contact form functionality
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // In a real application, you would send this data to a server
            // For now, just show a success message
            alert(currentLang === 'fa' 
                ? 'پیام شما با موفقیت ارسال شد. با شما تماس خواهیم گرفت.' 
                : 'Your message has been sent successfully. We will contact you soon.');
            
            // Reset form
            this.reset();
        });
    }
}

// Event Listeners
themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
});

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const newLang = btn.dataset.lang;
        setLanguage(newLang);
    });
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add CSS for mobile menu
const mobileMenuCSS = `
@media (max-width: 768px) {
    .nav-links {
        position: fixed;
        top: 80px;
        right: 0;
        width: 100%;
        background-color: var(--bg-color);
        flex-direction: column;
        padding: 20px;
        box-shadow: var(--shadow-lg);
        border-top: 1px solid var(--border-color);
        transform: translateY(-100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        z-index: 999;
    }
    
    .nav-links.mobile-visible {
        transform: translateY(0);
        opacity: 1;
    }
    
    .nav-links li {
        width: 100%;
        margin: 8px 0;
    }
    
    .nav-link {
        display: block;
        padding: 12px 20px;
        margin: 0;
        border-radius: 8px;
        text-align: center;
    }
}
`;

// Inject mobile menu CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuCSS;
document.head.appendChild(styleSheet);