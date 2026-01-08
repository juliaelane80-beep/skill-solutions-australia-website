/**
 * Skills Solutions Australia - Main JavaScript
 * Handles global functionality, navigation, and core interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initDarkMode();
    initNavigation();
    initScrollEffects();
    initUtilities();
    initTestimonialsCarousel();
    initPartnershipTestimonialsCarousel();
    
    console.log('Skills Solutions Australia website loaded successfully');
});

/**
 * Initialize dark mode as the default and only theme
 */
function initDarkMode() {
    const body = document.body;
    const hero = document.querySelector('.hero');
    
    // Force dark mode
    body.classList.add('theme-dark');
    body.classList.remove('theme-light');
    
    // Update browser theme color for dark mode
    updateThemeColor(true);
    
    // Apply dark hero styling
    if (hero) {
        hero.classList.add('dark-hero');
    }
    
    // Fix any text colors for dark mode
    fixTextColors(true);
}

/**
 * Fix text colors throughout the page for dark mode
 */
function fixTextColors(isDark) {
    // Find elements with problematic inline color styles
    const problematicSelectors = [
        '[style*="color: var(--charcoal)"]',
        '[style*="color: var(--light-grey)"]',
        '[style*="color: #2c3e50"]',
        '[style*="color: #5b6068"]'
    ];
    
    problematicSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Skip if it's an icon or number element that should keep its color
            if (element.classList.contains('step-number') || 
                element.classList.contains('step-icon') || 
                element.classList.contains('phase-number')) {
                return;
            }
            
            // Apply dark theme color
            element.style.color = 'var(--color-text-muted)';
        });
    });
}

/**
 * Update browser theme color meta tag for dark mode
 */
function updateThemeColor(isDark) {
    const themeColor = '#0d0d10'; // Always dark mode
    
    // Find existing theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
        // Update existing meta tag
        metaThemeColor.setAttribute('content', themeColor);
    } else {
        // Create new meta tag if none exists
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        metaThemeColor.setAttribute('content', themeColor);
        document.head.appendChild(metaThemeColor);
    }
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', updateHeader, { passive: true });
    
    // Mobile navigation toggle
    navToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Set active navigation link based on current page
    setActiveNavLink();
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === '/')) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize scroll-based effects
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
}

/**
 * Initialize scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Handle staggered animations
                if (entry.target.classList.contains('stagger-parent')) {
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                }
                
                // Handle counter animations
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Animate counter numbers
 * @param {Element} element - Counter element
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

/**
 * Initialize utility functions
 */
function initUtilities() {
    // Lazy loading for images
    initLazyLoading();
    
    // Handle external links
    initExternalLinks();
    
    // Initialize tooltips
    initTooltips();
    
    // Performance monitoring
    initPerformanceMonitoring();
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Handle external links
 */
function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('aria-label', link.textContent + ' (opens in new tab)');
        }
    });
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

/**
 * Show tooltip
 * @param {Event} e - Event object
 */
function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 200);
    }
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        
        if (loadTime > 3000) {
            console.warn('Page load time exceeded 3 seconds:', loadTime + 'ms');
        }
        
        // Log performance metrics for debugging
        if (performance.getEntriesByType) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log('Performance metrics:', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalLoad: navigation.loadEventEnd - navigation.fetchStart
                });
            }
        }
    });
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Utility function to throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
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
}

/**
 * Get element position relative to viewport
 * @param {Element} element - Target element
 * @returns {Object} Position object
 */
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        width: rect.width,
        height: rect.height
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Target element
 * @returns {boolean} True if in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export functions for use in other modules
window.SkillsSolutions = {
    debounce,
    throttle,
    getElementPosition,
    isInViewport,
    animateCounter,
    showTooltip,
    hideTooltip
};

/**
 * Testimonials Carousel Functionality
 * Handles swipeable testimonials with navigation
 */
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonials-prev');
    const nextBtn = document.getElementById('testimonials-next');
    const dotsContainer = document.getElementById('testimonials-dots');
    const container = track?.parentElement;
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const slides = track.children;
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Get visible slides count based on screen size
    function getVisibleSlides() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    // Calculate max index
    function getMaxIndex() {
        return Math.max(0, slides.length - getVisibleSlides());
    }
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const maxIndex = getMaxIndex();
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots
    function updateDots() {
        const dots = dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Update buttons
    function updateButtons() {
        const maxIndex = getMaxIndex();
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    // Move to slide
    function goToSlide(index) {
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        const visibleSlides = getVisibleSlides();
        const slideWidth = 100 / visibleSlides;
        const translateX = -(currentIndex * slideWidth);
        
        track.style.transform = `translateX(${translateX}%)`;
        updateDots();
        updateButtons();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Touch/Mouse events for swipe
    function handleStart(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        currentX = startX;
        container.classList.add('dragging');
        
        // Prevent default for mouse events
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        
        const diff = currentX - startX;
        const sensitivity = 0.3;
        
        // Add visual feedback during drag
        const visibleSlides = getVisibleSlides();
        const slideWidth = 100 / visibleSlides;
        const baseTranslateX = -(currentIndex * slideWidth);
        const dragOffset = (diff / container.offsetWidth) * 100 * sensitivity;
        
        track.style.transform = `translateX(${baseTranslateX + dragOffset}%)`;
    }
    
    function handleEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        container.classList.remove('dragging');
        
        const diff = currentX - startX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex > 0) {
                prevSlide();
            } else if (diff < 0 && currentIndex < getMaxIndex()) {
                nextSlide();
            } else {
                goToSlide(currentIndex); // Snap back
            }
        } else {
            goToSlide(currentIndex); // Snap back
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Touch events
    container.addEventListener('touchstart', handleStart, { passive: true });
    container.addEventListener('touchmove', handleMove, { passive: false });
    container.addEventListener('touchend', handleEnd, { passive: true });
    
    // Mouse events
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Window resize handler
    function handleResize() {
        createDots();
        goToSlide(Math.min(currentIndex, getMaxIndex()));
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Auto-play (optional)
    let autoplayInterval;
    const autoplayDelay = 5000;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex >= getMaxIndex()) {
                goToSlide(0);
            } else {
                nextSlide();
            }
        }, autoplayDelay);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Pause autoplay on hover/focus
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    container.addEventListener('focusin', stopAutoplay);
    container.addEventListener('focusout', startAutoplay);
    
    // Initialize
    createDots();
    goToSlide(0);
    startAutoplay();
    
    // Debounce utility
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
}

/**
 * Partnership Testimonials Carousel Functionality
 * Handles swipeable partnership testimonials with navigation
 */
function initPartnershipTestimonialsCarousel() {
    const track = document.getElementById('partnership-testimonials-track');
    const prevBtn = document.getElementById('partnership-testimonials-prev');
    const nextBtn = document.getElementById('partnership-testimonials-next');
    const dotsContainer = document.getElementById('partnership-testimonials-dots');
    const container = track?.parentElement;
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const slides = track.children;
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Get visible slides count based on screen size
    function getVisibleSlides() {
        return 1; // Always show one card at a time for partnership testimonials
    }
    
    // Calculate max index
    function getMaxIndex() {
        return Math.max(0, slides.length - getVisibleSlides());
    }
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const maxIndex = getMaxIndex();
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to partnership testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots
    function updateDots() {
        const dots = dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Update buttons
    function updateButtons() {
        const maxIndex = getMaxIndex();
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    // Move to slide
    function goToSlide(index) {
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        const visibleSlides = getVisibleSlides();
        const slideWidth = 100 / visibleSlides;
        const translateX = -(currentIndex * slideWidth);
        
        track.style.transform = `translateX(${translateX}%)`;
        updateDots();
        updateButtons();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Touch/Mouse events for swipe
    function handleStart(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        currentX = startX;
        container.classList.add('dragging');
        
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        
        const diff = currentX - startX;
        const sensitivity = 0.3;
        
        const visibleSlides = getVisibleSlides();
        const slideWidth = 100 / visibleSlides;
        const baseTranslateX = -(currentIndex * slideWidth);
        const dragOffset = (diff / container.offsetWidth) * 100 * sensitivity;
        
        track.style.transform = `translateX(${baseTranslateX + dragOffset}%)`;
    }
    
    function handleEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        container.classList.remove('dragging');
        
        const diff = currentX - startX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex > 0) {
                prevSlide();
            } else if (diff < 0 && currentIndex < getMaxIndex()) {
                nextSlide();
            } else {
                goToSlide(currentIndex);
            }
        } else {
            goToSlide(currentIndex);
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Touch events
    container.addEventListener('touchstart', handleStart, { passive: true });
    container.addEventListener('touchmove', handleMove, { passive: false });
    container.addEventListener('touchend', handleEnd, { passive: true });
    
    // Mouse events
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Window resize handler
    function handleResize() {
        createDots();
        goToSlide(Math.min(currentIndex, getMaxIndex()));
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Auto-play
    let autoplayInterval;
    const autoplayDelay = 6000; // Slightly longer for partnership testimonials
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex >= getMaxIndex()) {
                goToSlide(0);
            } else {
                nextSlide();
            }
        }, autoplayDelay);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Pause autoplay on hover/focus
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    container.addEventListener('focusin', stopAutoplay);
    container.addEventListener('focusout', startAutoplay);
    
    // Debounce utility (reuse from main function)
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
    
    // Initialize
    createDots();
    goToSlide(0);
    startAutoplay();
}
