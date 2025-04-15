# LUFS Audio Portfolio Website

A professional portfolio website for LUFS Audio, showcasing sound design, music composition, and technical audio projects with interactive elements and audio feedback.

## Overview

This portfolio website was created for Daniel Ramirez's sound design business, LUFS Audio. The site features:

- A striking landing page with three distinct, visually engaging, and interactive sections
- Dedicated pages for Sound Design, Music Composition, and Technical Audio categories
- A modular project template system for easy content updates
- Three.js visualizations that respond to user interaction and audio
- Audio feedback for interactive elements with toggle option
- Fully responsive design for all devices

## Technologies Used

- HTML5, CSS3, and Vanilla JavaScript (no frameworks)
- Three.js for interactive visualizations
- Web Audio API for audio processing and visualization
- Responsive design with mobile-first approach

## Project Structure

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

## Features

### Interactive Landing Page

The landing page features three distinct sections for Sound Design, Music Composition, and Technical Audio, each with:
- Custom Three.js visualizations that respond to user interaction
- Hover and click effects with audio feedback
- Smooth transitions between sections

### Audio Integration

- Background ambient audio that can be toggled on/off
- Audio feedback for user interactions (hover, click)
- Category-specific audio for each section
- Audio players for portfolio projects

### Responsive Design

- Mobile-first approach ensuring compatibility across all devices
- Adaptive layouts for different screen sizes
- Touch-optimized interactions for mobile devices
- Reduced motion option for accessibility

### Three.js Visualizations

- Background particle system with network-inspired design
- Sound Design section: Waveform visualization
- Music Composition section: Particle system visualization
- Technical Audio section: Network/circuit visualization
- Audio reactivity that responds to sound playback

## How to Use

### Adding New Projects

1. Duplicate the `project-template.html` file
2. Update the project title, description, tags, and links
3. Add project images to the `images/` directory
4. Add project audio to the `audio/` directory
5. Link the new project from the appropriate category page

### Creating Case Studies

1. Duplicate the `case-study-template.html` file
2. Fill in all sections: Overview, Challenge, Approach, Implementation, Results, Reflections
3. Add case study images to the `images/` directory
4. Add case study audio to the `audio/` directory
5. Link the case study from the project card

### Customizing Visualizations

The Three.js visualizations can be customized in the following files:
- `js/three-background.js` - Main background visualization
- `js/category-visualizations.js` - Category-specific visualizations

## Browser Compatibility

The website has been tested and is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Considerations

- Three.js visualizations are optimized for performance
- Audio files are compressed for faster loading
- Responsive images for different device sizes
- Loading screen to ensure all assets are loaded before display

## Credits

- Design and Development: Based on the LUFS Audio brand guidelines
- Three.js: https://threejs.org/
- Audio Processing: Web Audio API
- Fonts: Helvetica Neue

## License

All rights reserved. This project is proprietary and confidential.
