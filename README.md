# LUFS Portfolio Website

This is the portfolio website for LUFS Audio, showcasing sound design, music composition, and technical audio work.

## Latest Updates

The website has been updated with the following improvements:

1. **Mobile Responsiveness**
   - Implemented a hamburger menu that slides from the right side with teal underlines
   - Created a fully responsive layout that works across all device sizes
   - Ensured proper scaling of content and elements

2. **Background Visualization**
   - Added a subtle grayscale particle-network background behind all content
   - Based on the main lufs.audio site's visualizer but with reduced saturation
   - Optimized for performance with reduced particle count and frame rate limiting

3. **Section Header Animations**
   - Extended the homepage animations to category headers
   - Ensured animations span the full width of the window
   - Maintained original colors and animation styles

4. **Media Player Styling**
   - Styled the media players with a cleaner, more consistent look
   - Commented out case study link buttons as requested

5. **Performance Optimization**
   - Reduced particle and line count for better performance
   - Implemented frame rate limiting to reduce CPU/GPU usage
   - Added visibility detection to pause animations when not visible
   - Proper cleanup of event listeners and WebGL contexts

## File Structure

```
lufs-portfolio/
├── assets/           # Images, logos, and other static assets
│   └── fonts/        # Font files (Host Grotesk and Inter)
├── audio/            # Audio files for the portfolio
├── css/              # Stylesheets
│   ├── cursor.css             # Custom cursor styles
│   ├── font-implementation.css # Font face declarations
│   ├── header-styles.css      # Styles for category headers
│   ├── logo-fix.css           # Logo positioning fixes
│   ├── media-player.css       # Styles for audio players
│   ├── mobile-menu.css        # Mobile menu styles
│   ├── portfolio.css          # Portfolio-specific styles
│   ├── responsive.css         # Responsive design styles
│   ├── section-fixes.css      # Section layout fixes
│   └── styles.css             # Main stylesheet
├── images/           # Project images
├── js/               # JavaScript files
│   ├── audio-controller.js       # Audio playback control
│   ├── background-visualizer.js  # Grayscale background visualization
│   ├── category-visualizations.js # Homepage section visualizations
│   ├── cursor.js                 # Custom cursor functionality
│   ├── header-visualizations.js  # Category header visualizations
│   ├── main.js                   # Main JavaScript functionality
│   └── mobile-menu.js            # Mobile menu functionality
├── index.html        # Homepage
├── sound-design.html # Sound Design category page
├── music-composition.html # Music Composition category page
├── technical-audio.html # Technical Audio category page
└── README.md         # This documentation file
```

## Implementation Details

### Background Visualization

The background visualization is implemented in `background-visualizer.js`. It creates a subtle grayscale particle network similar to the main lufs.audio site but with reduced saturation to avoid distracting from the foreground content. The visualization is rendered on a canvas with z-index -1 to ensure it appears behind all other content.

### Header Visualizations

The category header visualizations are implemented in `header-visualizations.js`. This script creates Three.js scenes for each category header that match the visualizations on the homepage. The visualizations extend to the full width of the window and maintain the original colors and animation styles.

### Mobile Menu

The mobile menu is implemented in `mobile-menu.js` and styled in `mobile-menu.css`. It slides in from the right side of the screen and uses teal underlines instead of bullet points for menu items, matching the style of the main lufs.audio site.

### Media Players

The media players are styled in `media-player.css`. The case study link buttons have been commented out as requested.

## Browser Compatibility

The website has been tested and is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Performance Considerations

Several optimizations have been implemented to improve performance:

1. **Reduced Particle Count**: The background visualization uses fewer particles on mobile and low-end devices.
2. **Frame Rate Limiting**: Animations are limited to 30 FPS to reduce CPU/GPU usage.
3. **Visibility Detection**: Animations pause when not visible in the viewport.
4. **Event Listener Cleanup**: All event listeners are properly removed when components are destroyed.
5. **WebGL Context Management**: WebGL contexts are properly managed to prevent memory leaks.
6. **Asset Preloading**: Critical assets are preloaded to improve initial load time.

## Installation

To use this code as a drop-in replacement:

1. Back up your existing files if needed
2. Copy all files from this package to your web server or hosting environment
3. Ensure all file paths are correct for your environment
4. Test the website to ensure everything is working correctly
