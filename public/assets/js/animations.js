/**
 * Skills Solutions Australia - Animation Controller
 * Handles scroll-triggered animations and interactive motion
 */

/**
 * Animation controller class
 */
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    /**
     * Initialize animation controller
     */
    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupParallaxEffects();
        this.setupRetroEffects();
    }

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: [0.1, 0.3, 0.5],
            rootMargin: '0px 0px -100px 0px'
        };

        // Main scroll observer
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerAnimation(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('[data-animate]').forEach(element => {
            scrollObserver.observe(element);
        });

        this.observers.set('scroll', scrollObserver);
    }

    /**
     * Trigger animation based on element's data attributes
     * @param {Element} element - Target element
     */
    triggerAnimation(element) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay) || 0;
        const duration = element.dataset.duration || 'normal';

        setTimeout(() => {
            switch (animationType) {
                case 'fade-up':
                    this.animateFadeUp(element, duration);
                    break;
                case 'fade-in':
                    this.animateFadeIn(element, duration);
                    break;
                case 'slide-left':
                    this.animateSlideLeft(element, duration);
                    break;
                case 'slide-right':
                    this.animateSlideRight(element, duration);
                    break;
                case 'scale-up':
                    this.animateScaleUp(element, duration);
                    break;
                case 'rotate-in':
                    this.animateRotateIn(element, duration);
                    break;
                case 'stagger':
                    this.animateStagger(element, duration);
                    break;
                case 'counter':
                    this.animateCounter(element);
                    break;
                case 'progress':
                    this.animateProgress(element);
                    break;
                default:
                    this.animateFadeUp(element, duration);
            }
        }, delay);
    }

    /**
     * Fade up animation
     * @param {Element} element - Target element
     * @param {string} duration - Animation duration
     */
    animateFadeUp(element, duration) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all ${this.getDuration(duration)} ease`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Fade in animation
     * @param {Element} element - Target element
     * @param {string} duration - Animation duration
     */
    animateFadeIn(element, duration) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${this.getDuration(duration)} ease`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    /**
     * Slide left animation
     * @param {Element} element - Target element
     * @param {string} duration - Animation duration
     */
    animateSlideLeft(element, duration) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = `all ${this.getDuration(duration)} ease`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    /**
     * Slide right animation
     * @param {Element} element - Target element
     * @param {string} duration - Animation duration
     */
    animateSlideRight(element, duration) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = `all ${this.getDuration(duration)} ease`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    /**
     * Scale up animation
     * @param {Element} element - Target element
     * @param {string} duration - Animation duration
     */
    animateScaleUp(element, duration) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = `all ${this.getDuration(duration)} ease`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    /**
     * Rotate in animation
     * @param {Element} element - Target element
     * @param {string} duration - Animation duration
     */
    animateRotateIn(element, duration) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-10deg) scale(0.9)';
        element.style.transition = `all ${this.getDuration(duration)} ease`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }

    /**
     * Stagger animation for multiple elements
     * @param {Element} container - Container element
     * @param {string} duration - Animation duration
     */
    animateStagger(container, duration) {
        const children = container.querySelectorAll('[data-stagger-item]');
        
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                child.style.transition = `all ${this.getDuration(duration)} ease`;
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Enhanced counter animation with easing and visual effects
     * @param {Element} element - Counter element
     */
    animateCounter(element) {
        // Prevent re-animation if already animated
        if (element.dataset.animated === 'true') return;
        element.dataset.animated = 'true';

        const target = parseInt(element.dataset.target || element.textContent);
        const duration = parseInt(element.dataset.duration) || 2000;
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        
        let current = 0;
        const startTime = performance.now();
        
        // Add initial scale effect
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
        
        // Easing function for smooth animation
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            
            current = Math.floor(target * easedProgress);
            
            // Update text with smooth counting
            element.textContent = prefix + current.toLocaleString() + suffix;
            
            // Add pulsing effect during animation
            if (progress < 1) {
                const pulse = 1 + (Math.sin(elapsed * 0.01) * 0.02);
                element.style.transform = `scale(${pulse})`;
                requestAnimationFrame(animate);
            } else {
                // Final state
                element.textContent = prefix + target.toLocaleString() + suffix;
                element.style.transform = 'scale(1)';
                
                // Add completion glow effect
                this.addCompletionGlow(element);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Add a completion glow effect to counter
     * @param {Element} element - Counter element
     */
    addCompletionGlow(element) {
        // Check if element has gradient text
        if (element.classList.contains('gradient-text')) {
            element.style.filter = 'drop-shadow(0 0 20px rgba(0, 150, 136, 0.6)) drop-shadow(0 0 30px rgba(156, 39, 176, 0.3))';
            element.style.transition = 'filter 0.5s ease';
            
            setTimeout(() => {
                element.style.filter = 'drop-shadow(0 2px 4px rgba(0, 150, 136, 0.3))';
            }, 800);
        } else {
            // Fallback for non-gradient text
            element.style.textShadow = '0 0 20px var(--primary-teal)';
            element.style.transition = 'text-shadow 0.5s ease';
            
            setTimeout(() => {
                element.style.textShadow = '0 2px 4px rgba(0, 150, 136, 0.3)';
            }, 500);
        }
    }

    /**
     * Progress bar animation
     * @param {Element} element - Progress element
     */
    animateProgress(element) {
        const target = parseInt(element.dataset.progress) || 100;
        const progressBar = element.querySelector('.progress-fill');
        
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 2s ease';
            
            requestAnimationFrame(() => {
                progressBar.style.width = target + '%';
            });
        }
    }

    /**
     * Get duration value
     * @param {string} duration - Duration key
     * @returns {string} CSS duration value
     */
    getDuration(duration) {
        const durations = {
            fast: '0.3s',
            normal: '0.6s',
            slow: '1s'
        };
        return durations[duration] || durations.normal;
    }

    /**
     * Setup hover animations
     */
    setupHoverAnimations() {
        // Enhanced button hovers
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Card hover effects
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Setup parallax effects
     */
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleParallax = window.SkillsSolutions.throttle(() => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16);

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    /**
     * Setup retro-futurism effects
     */
    setupRetroEffects() {
        this.createScanLines();
        this.createParticleEffects();
        this.setupNeonEffects();
    }

    /**
     * Create scan line effects
     */
    createScanLines() {
        const scanElements = document.querySelectorAll('[data-scan-lines]');
        
        scanElements.forEach(element => {
            const scanLine = document.createElement('div');
            scanLine.className = 'scan-line';
            scanLine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--accent-neon), transparent);
                animation: scanMove 3s linear infinite;
                pointer-events: none;
            `;
            
            element.style.position = 'relative';
            element.appendChild(scanLine);
        });
    }

    /**
     * Create particle effects
     */
    createParticleEffects() {
        const particleContainers = document.querySelectorAll('[data-particles]');
        
        particleContainers.forEach(container => {
            const particleCount = parseInt(container.dataset.particles) || 20;
            const colors = ['var(--primary-teal)', 'var(--primary-purple)', 'var(--chrome-silver)'];
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = 1 + Math.random() * 3;
                
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: particleFloat ${8 + Math.random() * 15}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                    opacity: ${0.3 + Math.random() * 0.5};
                    box-shadow: 0 0 ${size * 2}px ${color};
                `;
                
                container.appendChild(particle);
            }
        });
    }

    /**
     * Setup neon glow effects
     */
    setupNeonEffects() {
        const neonElements = document.querySelectorAll('[data-neon]');
        
        neonElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 0 30px var(--primary-teal), 0 0 60px var(--primary-teal)';
                element.style.borderColor = 'var(--primary-teal)';
                element.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
                element.style.borderColor = '';
                element.style.transform = '';
            });
        });

        // Add glow effects to buttons and cards
        const interactiveElements = document.querySelectorAll('.btn, .card, .nav-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (element.classList.contains('btn-primary')) {
                    element.style.filter = 'brightness(1.2) drop-shadow(0 0 20px var(--primary-teal))';
                } else if (element.classList.contains('btn-neon')) {
                    element.style.filter = 'drop-shadow(0 0 15px var(--primary-teal))';
                } else if (element.classList.contains('card')) {
                    element.style.filter = 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.3))';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.filter = '';
            });
        });
    }

    /**
     * Add animation to element
     * @param {Element} element - Target element
     * @param {string} animationType - Animation type
     * @param {number} delay - Delay in milliseconds
     */
    addAnimation(element, animationType, delay = 0) {
        element.dataset.animate = animationType;
        element.dataset.delay = delay;
        
        if (!this.animatedElements.has(element)) {
            this.triggerAnimation(element);
        }
    }

    /**
     * Remove all animations from element
     * @param {Element} element - Target element
     */
    removeAnimation(element) {
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
        this.animatedElements.delete(element);
    }

    /**
     * Cleanup all observers and effects
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.SkillsSolutions.AnimationController = new AnimationController();
});

// Export for global access
window.SkillsSolutions = window.SkillsSolutions || {};
window.SkillsSolutions.AnimationController = AnimationController;
