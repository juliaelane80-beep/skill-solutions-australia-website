# Futuristic Neon Theming Guide

## Overview
This documentation covers the enhanced cyberpunk/neon design system implemented for Skills Solutions Australia. The design maintains accessibility while providing a futuristic, immersive experience.

## Design Tokens

### Colors
```css
/* Neon Accent Colors */
--neon-pink: #FF007F
--neon-purple: #9D4EDD  
--neon-cyan: #00E5FF
--neon-blue: #3B82F6
--neon-yellow: #FFD700

/* Base Colors */
--color-bg: #0D0D0D (pure black for cyberpunk)
--color-surface: #1a1a1e
--color-text: #f4f4f5
--color-text-muted: #a1a1aa
```

### Gradients
```css
--gradient-primary: linear-gradient(120deg, var(--neon-cyan) 0%, var(--neon-purple) 60%, var(--neon-blue) 100%)
--gradient-neon-pink: linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-purple) 100%)
--gradient-cyber: linear-gradient(45deg, var(--neon-cyan) 0%, var(--neon-pink) 50%, var(--neon-yellow) 100%)
```

## Utility Classes

### Typography Effects
- `.text-neon` - Gradient text with subtle glow
- `.text-metallic-3d` - Chrome/metallic effect for H1 headlines only
- `.gradient-text` - Standard gradient text effect

### Visual Effects
- `.glow-soft` - Subtle cyan glow
- `.glow-pink` - Pink neon glow
- `.glow-purple` - Purple neon glow
- `.glow-yellow` - Yellow accent glow

### Borders & Containers
- `.border-neon` - Cyan neon border with inner/outer glow
- `.border-neon-pink` - Pink variant
- `.panel-glass` - Glassmorphism container with blur
- `.overlay-hologram` - Adds holographic shimmer effect

### Layout Components
- `.circuit-bg` - Animated circuit line background
- `.energy-divider` - Neon gradient divider with end caps

## Component Usage

### Buttons
```html
<!-- Primary neon button -->
<button class="btn btn-primary btn-neon" data-neon-trail="true">Action</button>

<!-- Secondary outline button -->
<button class="btn btn-secondary">Secondary</button>
```

### Cards
```html
<!-- Glass card with holographic effect -->
<div class="card card-neon panel-glass overlay-hologram">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

### Hero Section
```html
<section class="hero circuit-bg" id="hero-main" data-particles="40">
  <div class="container">
    <h1 class="hero-title text-metallic-3d">Headline</h1>
    <p class="hero-subtitle">Subheading with glow</p>
  </div>
</section>
```

## JavaScript Effects

The `effects.js` module provides:

### Particle System
```javascript
// Auto-initialized for elements with data-particles attribute
// Manual initialization:
NeonEffects.initParticles('#hero-main', {
  count: 50,
  speed: 0.5,
  colors: ['#00E5FF', '#9D4EDD', '#FF007F']
});
```

### Neon Trails
```javascript
// Auto-initialized for .btn-neon and [data-neon-trail="true"]
// Manual initialization:
NeonEffects.initNeonTrails('.interactive-element');
```

### Circuit Lines
```javascript
// Auto-initialized for .circuit-bg elements
// Manual initialization:
NeonEffects.initCircuitLines('.custom-circuit');
```

## Accessibility Features

### Reduced Motion Support
All animations respect `prefers-reduced-motion: reduce`:
- Particles are disabled
- Circuit animations stop
- Holographic shimmer effects pause
- Transition durations reduced to 0.01ms

### High Contrast Support
```css
@media (prefers-contrast: high) {
  /* Neon effects are toned down */
  /* Glows are removed for better contrast */
}
```

### Focus Indicators
Enhanced focus rings with neon styling:
```css
:focus-visible {
  outline: 2px solid var(--neon-cyan);
  box-shadow: 0 0 0 4px rgba(0, 229, 255, 0.3);
}
```

## Theme Switching

The design supports both dark and light modes:

### Dark Theme (Default)
- Pure black backgrounds (#0D0D0D)
- Full neon effects enabled
- Glassmorphism with dark glass

### Light Theme
- White/light grey backgrounds
- Neon effects adjusted for light backgrounds
- Maintains readability while preserving style

## Performance Considerations

### CSS Bundle Size
- Consolidated duplicate variables
- Efficient utility class structure
- Optimized gradient definitions

### JavaScript Effects
- `effects.js` is <6KB gzipped
- Uses requestAnimationFrame for smooth animations
- Fails fast on unsupported browsers
- Automatic cleanup on errors

### Image Optimisation
- SVG used for icons and patterns
- Inline data URIs for small graphics
- WebP/AVIF support for larger images

## Extending the System

### Adding New Neon Colors
1. Define in CSS custom properties
2. Create corresponding glow utilities
3. Add to gradient definitions if needed

### Custom Animations
- Respect prefers-reduced-motion
- Use CSS animations over JavaScript when possible
- Keep duration under 500ms for UI feedback

### New Components
Follow the established patterns:
- Use glassmorphism for containers
- Apply consistent neon accents
- Include holographic overlays where appropriate
- Ensure keyboard navigation works

## Browser Support
- Modern browsers with CSS custom properties
- Canvas 2D support for particles
- backdrop-filter for glassmorphism (graceful degradation)

## Known Constraints
1. Heavy glow effects may impact performance on low-end devices
2. Glassmorphism requires backdrop-filter support
3. Some effects disabled in high contrast mode
4. Particle system requires Canvas support

## Troubleshooting

### Effects Not Loading
Check console for error messages from effects.js. Common issues:
- Container element not found
- Canvas 2D context not supported
- prefers-reduced-motion enabled (expected behavior)

### Performance Issues
- Reduce particle count in data-particles attribute
- Disable holographic overlays on low-end devices
- Use will-change CSS property sparingly
