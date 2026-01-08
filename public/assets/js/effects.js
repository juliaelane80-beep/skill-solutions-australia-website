/**
 * Futuristic Neon Effects Module
 * Provides particle systems, neon trails, and circuit animations
 * Respects prefers-reduced-motion and fails fast on errors
 */

class NeonEffects {
  constructor() {
    this.particles = [];
    this.animationId = null;
    this.canvas = null;
    this.ctx = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initialized = false;
  }

  /**
   * Initialize particle system for hero sections
   * @param {string} containerId - ID of container element
   * @param {Object} options - Configuration options
   * @returns {boolean} Success status
   */
  initParticles(containerId, options = {}) {
    if (this.reducedMotion) {
      console.log('Particles disabled: prefers-reduced-motion');
      return false;
    }

    try {
      const container = document.getElementById(containerId) || document.querySelector(containerId);
      if (!container) {
        throw new Error(`Container not found: ${containerId}`);
      }

      // Create canvas element
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '1';
      
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error('Canvas 2D context not supported');
      }

      container.style.position = 'relative';
      container.appendChild(this.canvas);

      // Configuration
      const config = {
        count: options.count || 50,
        speed: options.speed || 0.5,
        size: options.size || 2,
        colors: options.colors || ['#00E5FF', '#9D4EDD', '#FF007F'],
        ...options
      };

      this.setupCanvas();
      this.createParticles(config);
      this.startAnimation();
      this.initialized = true;

      // Handle resize
      window.addEventListener('resize', () => this.setupCanvas());

      return true;
    } catch (error) {
      console.error('Failed to initialize particles:', error.message);
      return false;
    }
  }

  /**
   * Setup canvas dimensions
   */
  setupCanvas() {
    if (!this.canvas) return;
    
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * Create particle objects
   * @param {Object} config - Particle configuration
   */
  createParticles(config) {
    this.particles = [];
    
    for (let i = 0; i < config.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: Math.random() * config.size + 1,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        life: Math.random() * 100
      });
    }
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += 0.5;

      // Wrap around screen
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.y > this.canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = this.canvas.height;

      // Pulse opacity
      particle.opacity = 0.3 + Math.sin(particle.life * 0.02) * 0.3;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      this.ctx.fill();

      // Add glow effect
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = particle.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    if (this.reducedMotion || this.animationId) return;
    this.animate();
  }

  /**
   * Initialize neon trails effect
   * @param {string} selector - CSS selector for elements
   * @returns {boolean} Success status
   */
  initNeonTrails(selector) {
    if (this.reducedMotion) {
      console.log('Neon trails disabled: prefers-reduced-motion');
      return false;
    }

    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        throw new Error(`No elements found for selector: ${selector}`);
      }

      elements.forEach(element => {
        element.addEventListener('mouseenter', this.createTrail.bind(this));
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize neon trails:', error.message);
      return false;
    }
  }

  /**
   * Create neon trail effect
   * @param {Event} event - Mouse event
   */
  createTrail(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    const trail = document.createElement('div');
    trail.style.position = 'absolute';
    trail.style.width = '4px';
    trail.style.height = '4px';
    trail.style.background = '#00E5FF';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.boxShadow = '0 0 10px #00E5FF';
    
    document.body.appendChild(trail);

    // Animate trail
    let opacity = 1;
    const animate = () => {
      opacity -= 0.05;
      trail.style.opacity = opacity;
      trail.style.transform = `translate(${rect.left + Math.random() * 100}px, ${rect.top + Math.random() * 20}px)`;
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(trail);
      }
    };
    
    animate();
  }

  /**
   * Initialize circuit line animations
   * @param {string} selector - CSS selector for circuit containers
   * @returns {boolean} Success status
   */
  initCircuitLines(selector) {
    if (this.reducedMotion) {
      console.log('Circuit animations disabled: prefers-reduced-motion');
      return false;
    }

    try {
      const containers = document.querySelectorAll(selector);
      if (containers.length === 0) {
        throw new Error(`No containers found for selector: ${selector}`);
      }

      containers.forEach(container => {
        this.createCircuitSVG(container);
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize circuit lines:', error.message);
      return false;
    }
  }

  /**
   * Create animated circuit SVG
   * @param {Element} container - Container element
   */
  createCircuitSVG(container) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,50 Q25,25 50,50 T100,50 Q125,75 150,50');
    path.setAttribute('stroke', '#00E5FF');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('opacity', '0.6');
    path.style.strokeDasharray = '10,5';
    path.style.strokeDashoffset = '0';
    path.style.animation = 'circuitFlow 3s linear infinite';

    svg.appendChild(path);
    container.style.position = 'relative';
    container.appendChild(svg);
  }

  /**
   * Destroy all effects and clean up
   */
  destroyEffects() {
    try {
      // Stop animation
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      // Remove canvas
      if (this.canvas && this.canvas.parentElement) {
        this.canvas.parentElement.removeChild(this.canvas);
      }

      // Clean up properties
      this.particles = [];
      this.canvas = null;
      this.ctx = null;
      this.initialized = false;

      console.log('Neon effects destroyed successfully');
    } catch (error) {
      console.error('Error destroying effects:', error.message);
    }
  }
}

// Export singleton instance
const neonEffects = new NeonEffects();

/**
 * Initialize particle system
 * @param {string} containerId - Container element ID or selector
 * @param {Object} options - Configuration options
 * @returns {boolean} Success status
 */
function initParticles(containerId, options = {}) {
  return neonEffects.initParticles(containerId, options);
}

/**
 * Initialize neon trail effects
 * @param {string} selector - CSS selector for interactive elements
 * @returns {boolean} Success status
 */
function initNeonTrails(selector) {
  return neonEffects.initNeonTrails(selector);
}

/**
 * Initialize circuit line animations
 * @param {string} selector - CSS selector for circuit containers
 * @returns {boolean} Success status
 */
function initCircuitLines(selector) {
  return neonEffects.initCircuitLines(selector);
}

/**
 * Destroy all effects and clean up resources
 */
function destroyEffects() {
  neonEffects.destroyEffects();
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Auto-detect particle containers
  const heroSections = document.querySelectorAll('.hero, [data-particles]');
  heroSections.forEach((section, index) => {
    const particleCount = section.dataset.particles || 30;
    if (!section.id) {
      section.id = `hero-particles-${index}`;
    }
    initParticles(`#${section.id}`, { count: parseInt(particleCount) });
  });

  // Auto-detect circuit containers
  const circuitContainers = document.querySelectorAll('.circuit-bg, [data-circuit="true"]');
  if (circuitContainers.length > 0) {
    initCircuitLines('.circuit-bg, [data-circuit="true"]');
  }

  // Auto-detect neon trail elements
  const trailElements = document.querySelectorAll('.btn-neon, [data-neon-trail="true"]');
  if (trailElements.length > 0) {
    initNeonTrails('.btn-neon, [data-neon-trail="true"]');
  }
});

// Export functions for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initParticles, initNeonTrails, initCircuitLines, destroyEffects };
} else if (typeof window !== 'undefined') {
  window.NeonEffects = { initParticles, initNeonTrails, initCircuitLines, destroyEffects };
}
