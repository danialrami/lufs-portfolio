// Improved custom cursor implementation for LUFS Audio Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
  // Create cursor element if it doesn't exist
  if (!document.querySelector('.custom-cursor')) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  }
  
  // Get cursor element
  const cursor = document.querySelector('.custom-cursor');
  
  // Check if device is touch-enabled
  const isTouchDevice = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
  
  // Only implement custom cursor on non-touch devices
  if (!isTouchDevice) {
    // Update cursor position on mouse move - more responsive with direct positioning
    document.addEventListener('mousemove', function(e) {
      // Direct positioning without transition for immediate response
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, .project-card, .category-section, .audio-toggle'
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        cursor.classList.add('hover');
        
        // Play hover sound if audio controller exists
        if (window.audioController && typeof window.audioController.playHoverSound === 'function') {
          window.audioController.playHoverSound();
        }
      });
      
      element.addEventListener('mouseleave', function() {
        cursor.classList.remove('hover');
      });
      
      element.addEventListener('mousedown', function() {
        cursor.classList.add('active');
      });
      
      element.addEventListener('mouseup', function() {
        cursor.classList.remove('active');
      });
    });
    
    // Show cursor
    cursor.style.opacity = '1';
  } else {
    // Hide cursor on touch devices
    if (cursor) {
      cursor.style.display = 'none';
    }
  }
});
