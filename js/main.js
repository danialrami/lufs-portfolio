// Main JavaScript for LUFS Audio Portfolio Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio controller
    window.audioController = {
        audioContext: null,
        gainNode: null,
        audioElements: [],
        isMuted: false,
        
        init: function() {
            // Create audio context
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
                this.gainNode = this.audioContext.createGain();
                this.gainNode.connect(this.audioContext.destination);
                
                // Find all audio elements
                const audioElements = document.querySelectorAll('audio');
                audioElements.forEach(audio => {
                    this.setupAudioElement(audio);
                });
                
                // Setup audio toggle button
                const toggleButton = document.getElementById('toggle-audio');
                if (toggleButton) {
                    toggleButton.addEventListener('click', () => this.toggleMute());
                }
            } catch (e) {
                console.error('Web Audio API is not supported in this browser', e);
            }
        },
        
        setupAudioElement: function(audioElement) {
            if (!this.audioContext) return;
            
            // Create media element source
            const source = this.audioContext.createMediaElementSource(audioElement);
            source.connect(this.gainNode);
            
            // Add to tracked elements
            this.audioElements.push({
                element: audioElement,
                source: source
            });
        },
        
        toggleMute: function() {
            this.isMuted = !this.isMuted;
            
            // Update gain value
            if (this.gainNode) {
                this.gainNode.gain.value = this.isMuted ? 0 : 1;
            }
            
            // Update toggle button appearance
            const toggleButton = document.getElementById('toggle-audio');
            if (toggleButton) {
                toggleButton.classList.toggle('muted', this.isMuted);
            }
            
            // Audio feedback temporarily disabled
            // if (!this.isMuted) {
            //     this.playClickSound();
            // }
        },
        
        // Audio feedback methods temporarily disabled
        playHoverSound: function() {
            // Disabled for now
            // if (this.isMuted) return;
            // 
            // const hoverSound = new Audio('audio/hover.mp3');
            // hoverSound.volume = 0.2;
            // hoverSound.play().catch(e => console.log('Audio play prevented:', e));
        },
        
        playClickSound: function() {
            // Disabled for now
            // if (this.isMuted) return;
            // 
            // const clickSound = new Audio('audio/click.mp3');
            // clickSound.volume = 0.3;
            // clickSound.play().catch(e => console.log('Audio play prevented:', e));
        }
    };
    
    // Initialize audio controller
    window.audioController.init();
    
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add reveal animation to elements
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Check on initial load
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
});

// Handle browser compatibility
function checkBrowserCompatibility() {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        console.warn('WebGL not supported. Disabling visualizations.');
        document.body.classList.add('no-webgl');
        return false;
    }
    
    // Check for Web Audio API support
    const audioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioContext) {
        console.warn('Web Audio API not supported. Disabling audio features.');
        document.body.classList.add('no-audio-api');
    }
    
    return true;
}

// Call compatibility check
checkBrowserCompatibility();