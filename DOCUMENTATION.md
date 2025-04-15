# LUFS Audio Portfolio Website - Documentation

## Overview

This document provides detailed information about the LUFS Audio portfolio website, including its structure, functionality, and how to maintain it.

## Website Structure

The website consists of the following main pages:

1. **Homepage (index.html)**: Landing page with three interactive sections for Sound Design, Music Composition, and Technical Audio.
2. **Sound Design (sound-design.html)**: Showcases sound design projects.
3. **Music Composition (music-composition.html)**: Showcases music composition projects.
4. **Technical Audio (technical-audio.html)**: Showcases technical audio projects.
5. **Case Study Template (case-study-template.html)**: Template for creating detailed case studies.
6. **Project Template (project-template.html)**: Template for adding new projects.

## Key Features

### Interactive Elements

- **Three.js Background**: The website features a dynamic, audio-reactive background created with Three.js.
- **Category Visualizations**: Each category section has a unique visualization that responds to user interaction:
  - Sound Design: Waveform visualization
  - Music Composition: Particle system visualization
  - Technical Audio: Network/circuit visualization
- **Audio Feedback**: Interactive elements provide audio feedback when hovered or clicked.
- **Audio Toggle**: Users can toggle audio on/off using the button in the top-right corner.

### Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px and above)
- Tablet (768px to 1199px)
- Mobile (below 768px)

Special considerations have been made for:
- Touch devices (larger touch targets)
- Dark mode preferences
- Reduced motion preferences
- Print styling

### Modular Project System

The website uses a modular project template system that makes it easy to add new projects:
- Each project card follows the same structure
- Audio players are integrated into each project
- Tags can be customized for each project
- Links to case studies can be added

## How to Update Content

### Adding a New Project

1. Open the appropriate category page (sound-design.html, music-composition.html, or technical-audio.html)
2. Copy the project card template from project-template.html
3. Paste it into the #portfolio-projects section of the category page
4. Update the following elements:
   - Project image (in the .project-image img src attribute)
   - Audio file (in the .audio-player audio src attribute)
   - Project title (in the h2 element)
   - Project tags (in the .project-tags span elements)
   - Project description (in the p element)
   - Case study link (in the .project-link href attribute)
5. Add your project image to the images/ directory
6. Add your audio file to the audio/ directory

### Creating a Case Study

1. Duplicate the case-study-template.html file
2. Rename it to match your project (e.g., sound-design-project1-case-study.html)
3. Update the following sections:
   - Project title and tags
   - Overview
   - The Challenge
   - My Approach
   - Implementation
   - Results
   - Reflections
4. Add case study images to the images/ directory
5. Add case study audio to the audio/ directory
6. Update the "Back to Projects" link to point to the appropriate category page
7. Link to this case study from your project card

## Technical Details

### File Structure

```
portfolio-website/
├── index.html                  # Main landing page
├── sound-design.html           # Sound Design category page
├── music-composition.html      # Music Composition category page
├── technical-audio.html        # Technical Audio category page
├── case-study-template.html    # Template for case studies
├── project-template.html       # Template for adding new projects
├── css/
│   ├── styles.css              # Main stylesheet
│   ├── portfolio.css           # Styles for portfolio pages
│   └── responsive.css          # Responsive design styles
├── js/
│   ├── main.js                 # Main JavaScript functionality
│   ├── audio-controller.js     # Audio playback and control
│   ├── audio-feedback.js       # Interactive sound effects
│   ├── three-background.js     # Three.js background animation
│   └── category-visualizations.js # Category-specific visualizations
├── audio/
│   ├── hover.mp3               # UI interaction sounds
│   ├── click.mp3               # UI interaction sounds
│   ├── background-ambience.mp3 # Background audio
│   └── placeholder-*.mp3       # Placeholder audio files for projects
├── images/
│   └── placeholder-*.jpg       # Placeholder images for projects
└── assets/
    ├── lufs-logo.svg           # LUFS Audio logo
    ├── audio-on.svg            # Audio control icons
    ├── audio-off.svg           # Audio control icons
    └── lufs-squares-*.svg      # Brand assets
```

### CSS Structure

- **styles.css**: Contains base styles, layout, navigation, footer, and hero section styles
- **portfolio.css**: Contains styles for portfolio pages, project cards, and case studies
- **responsive.css**: Contains media queries and responsive adjustments

### JavaScript Structure

- **main.js**: Handles general interactions, smooth scrolling, and reveal animations
- **audio-controller.js**: Manages audio playback, loading screen, and background audio
- **audio-feedback.js**: Provides audio feedback for interactive elements
- **three-background.js**: Creates and animates the Three.js background
- **category-visualizations.js**: Creates category-specific Three.js visualizations

### Color Palette

The website uses the LUFS Audio brand colors:
- TEAL: #78BEBA
- RED: #D35233
- YELLOW: #E7B225
- BLUE: #2069af
- BLACK: #111111
- WHITE: #fbf9e2

## Performance Optimization

The website has been optimized for performance:
- Compressed audio files
- Optimized Three.js visualizations
- Responsive images
- Loading screen to ensure all assets are loaded before display
- Efficient CSS and JavaScript

## Browser Compatibility

The website has been tested and is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Maintenance Tips

- Regularly check for broken links
- Optimize new images before adding them to the website
- Compress audio files to reduce loading times
- Test any changes on multiple devices and browsers
- Keep Three.js library updated for security and performance improvements

## Support

For any questions or issues, please contact:
- Email: daniel@lufs.audio
