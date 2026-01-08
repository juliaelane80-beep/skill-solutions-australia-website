/**
 * Enhanced Navigation Module
 * Provides scroll effects, mobile menu, and progress bar functionality
 * Respects prefers-reduced-motion and fails fast on errors
 */

class NavigationController {
  constructor() {
    this.header = null;
    this.progress = null;
    this.mobileToggle = null;
    this.mobilePanel = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scrollTimeout = null;
  }

  /**
   * Initialize main navigation features
   * @returns {boolean} Success status
   */
  initNav() {
    try {
      this.header = document.querySelector('.site-header');
      if (!this.header) {
        throw new Error('Navigation header not found (.site-header)');
      }

      this.progress = document.querySelector('.nav-progress');
      
      // Set up scroll listener
      this.setupScrollEffects();
      
      // Set up logo hover effects
      this.setupLogoEffects();

      return true;
    } catch (error) {
      console.error('Navigation init failed:', error.message);
      return false;
    }
  }

  /**
   * Set up scroll-based header effects
   */
  setupScrollEffects() {
    const onScroll = () => {
      if (this.scrollTimeout) {
        cancelAnimationFrame(this.scrollTimeout);
      }

      this.scrollTimeout = requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;
        
        // Update header state
        this.header.classList.toggle('is-scrolled', scrollY > 20);
        
        // Update progress bar
        if (this.progress && !this.reducedMotion) {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
          this.progress.style.width = `${scrollProgress * 100}%`;
        }
      });
    };

    // Initial call
    onScroll();
    
    // Throttled scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * Set up logo hover effects
   */
  setupLogoEffects() {
    const logo = document.querySelector('.nav-logo');
    if (!logo || this.reducedMotion) return;

    logo.addEventListener('mouseenter', () => {
      logo.style.transform = 'scale(1.02)';
      logo.style.filter = 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.3))';
    });

    logo.addEventListener('mouseleave', () => {
      logo.style.transform = '';
      logo.style.filter = '';
    });
  }

  /**
   * Initialize mobile navigation menu
   * @returns {boolean} Success status
   */
  initMobileNav() {
    try {
      this.mobileToggle = document.querySelector('.nav-toggle');
      this.mobilePanel = document.querySelector('.nav-menu');
      this.navElement = document.querySelector('.nav');
      
      if (!this.mobileToggle || !this.mobilePanel || !this.navElement) {
        console.warn('Mobile navigation elements not found - mobile nav disabled');
        return false;
      }

      // Create and add overlay element
      this.createOverlay();
      
      this.setupMobileToggle();
      this.setupMobilePanel();
      this.setupKeyboardNavigation();

      return true;
    } catch (error) {
      console.error('Mobile navigation init failed:', error.message);
      return false;
    }
  }

  /**
   * Create overlay element for mobile menu
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'nav-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.navElement.appendChild(this.overlay);
    
    // Close menu when clicking overlay
    this.overlay.addEventListener('click', () => {
      this.closeMobileMenu();
    });
  }

  /**
   * Set up mobile menu toggle
   */
  setupMobileToggle() {
    this.mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });
  }

  /**
   * Set up mobile panel interactions
   */
  setupMobilePanel() {
    // Close menu when clicking on links
    this.mobilePanel.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        this.closeMobileMenu();
      }
    });

    // Don't close when clicking inside the panel content
    this.mobilePanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Set up keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobilePanel.classList.contains('is-open')) {
        this.closeMobileMenu();
        this.mobileToggle.focus();
      }
    });
  }

  /**
   * Toggle mobile menu state
   */
  toggleMobileMenu() {
    const isOpen = this.mobilePanel.classList.contains('is-open');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.mobilePanel.classList.add('is-open');
    this.navElement.classList.add('is-open');
    this.mobileToggle.classList.add('active');
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll
    document.body.classList.add('no-scroll');
    
    // Focus first link for accessibility
    const firstLink = this.mobilePanel.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }

    // Trigger staggered animations if not reduced motion
    if (!this.reducedMotion) {
      this.triggerStaggeredAnimation();
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.mobilePanel.classList.remove('is-open');
    this.navElement.classList.remove('is-open');
    this.mobileToggle.classList.remove('active');
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.classList.remove('no-scroll');
  }

  /**
   * Trigger staggered animation for mobile links
   */
  triggerStaggeredAnimation() {
    const links = this.mobilePanel.querySelectorAll('.nav-link');
    links.forEach((link, index) => {
      link.style.setProperty('--stagger-delay', index + 1);
    });
  }

  /**
   * Set active navigation link
   * @param {string} currentPath - Current page path
   */
  setActiveLink(currentPath) {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || 
          (currentPath === '/' && href === 'index.html') ||
          (currentPath.includes(href) && href !== 'index.html')) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
      }
    });
  }

  /**
   * Update progress bar manually
   * @param {number} progress - Progress value between 0 and 1
   */
  updateProgress(progress) {
    if (this.progress && !this.reducedMotion) {
      this.progress.style.width = `${Math.max(0, Math.min(100, progress * 100))}%`;
    }
  }

  /**
   * Clean up event listeners and resources
   */
  destroy() {
    if (this.scrollTimeout) {
      cancelAnimationFrame(this.scrollTimeout);
    }
    
    // Reset body overflow
    document.body.style.overflow = '';
    
    console.log('Navigation controller destroyed');
  }
}

// Export singleton instance
const navigationController = new NavigationController();

/**
 * Initialize main navigation features
 * @returns {boolean} Success status
 */
function initNav() {
  return navigationController.initNav();
}

/**
 * Initialize mobile navigation
 * @returns {boolean} Success status
 */
function initMobileNav() {
  return navigationController.initMobileNav();
}

/**
 * Initialize all navigation features
 * @returns {boolean} Success status
 */
function initNavAll() {
  try {
    const mainNav = initNav();
    const mobileNav = initMobileNav();
    
    // Set active link based on current page
    const currentPath = window.location.pathname;
    navigationController.setActiveLink(currentPath);
    
    return mainNav || mobileNav; // Success if at least one works
  } catch (error) {
    console.error('Navigation initialization failed:', error.message);
    return false;
  }
}

/**
 * Set active navigation link
 * @param {string} currentPath - Current page path
 */
function setActiveNavLink(currentPath) {
  navigationController.setActiveLink(currentPath);
}

/**
 * Update scroll progress manually
 * @param {number} progress - Progress between 0 and 1
 */
function updateScrollProgress(progress) {
  navigationController.updateProgress(progress);
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const success = initNavAll();
  if (success) {
    console.log('Enhanced navigation initialized successfully');
  }
});

// Handle page visibility changes to clean up
document.addEventListener('visibilitychange', () => {
  if (document.hidden && navigationController.mobilePanel?.classList.contains('is-open')) {
    navigationController.closeMobileMenu();
  }
});

// Export functions for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initNav, 
    initMobileNav, 
    initNavAll, 
    setActiveNavLink, 
    updateScrollProgress,
    navigationController 
  };
} else if (typeof window !== 'undefined') {
  window.Navigation = { 
    initNav, 
    initMobileNav, 
    initNavAll, 
    setActiveNavLink, 
    updateScrollProgress,
    controller: navigationController
  };
}
