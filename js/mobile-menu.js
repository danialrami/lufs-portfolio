// Mobile menu implementation for LUFS Portfolio
// Implements a hamburger menu that slides from the right with teal underlines

document.addEventListener('DOMContentLoaded', function() {
  // Create mobile menu elements
  createMobileMenu();
  
  // Initialize mobile menu functionality
  initMobileMenu();
  
  // Handle window resize events
  window.addEventListener('resize', handleResize);
  
  // Initial check for mobile view
  handleResize();
});

// Create mobile menu elements
function createMobileMenu() {
  // Create mobile navigation container if it doesn't exist
  if (!document.querySelector('.mobile-nav-container')) {
    const nav = document.querySelector('nav');
    
    if (!nav) return;
    
    // Create mobile toggle button
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    // Create mobile navigation container
    const mobileNavContainer = document.createElement('div');
    mobileNavContainer.className = 'mobile-nav-container';
    
    // Create mobile navigation
    const mobileNav = document.createElement('div');
    mobileNav.className = 'main-nav';
    
    // Clone the navigation links
    const navLinks = nav.querySelector('ul').cloneNode(true);
    
    // Append elements
    mobileNav.appendChild(navLinks);
    mobileNavContainer.appendChild(mobileNav);
    
    // Add to document
    document.body.appendChild(menuToggle);
    document.body.appendChild(mobileNavContainer);
  }
}

// Initialize mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.main-nav');
  
  if (!menuToggle || !mobileNav) return;
  
  // Toggle menu on click
  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = menuToggle.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking on a link
  const navLinks = mobileNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!mobileNav.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        mobileNav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Handle escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Handle window resize
function handleResize() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.main-nav');
  
  if (!menuToggle || !mobileNav) return;
  
  // Reset menu state on resize to desktop
  if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
    menuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }
}
