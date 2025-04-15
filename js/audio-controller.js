// Audio controller for LUFS Audio Portfolio Website

// Audio Controller Class
class AudioController {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.audioElements = [];
    this.isMuted = false;
    this.hoverSound = null;
    this.clickSound = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.setupAudioElement = this.setupAudioElement.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.playHoverSound = this.playHoverSound.bind(this);
    this.playClickSound = this.playClickSound.bind(this);
  }
  
  init() {
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
      
      // Preload sound effects
      this.preloadSoundEffects();
      
      // Setup audio toggle button
      const toggleButton = document.getElementById('toggle-audio');
      if (toggleButton) {
        toggleButton.addEventListener('click', this.toggleMute);
      }
    } catch (e) {
      console.error('Web Audio API is not supported in this browser', e);
    }
  }
  
  preloadSoundEffects() {
    // Preload hover sound
    this.hoverSound = new Audio('audio/hover.mp3');
    this.hoverSound.volume = 0.15; // Lower volume for subtle effect
    this.hoverSound.load();
    
    // Preload click sound
    this.clickSound = new Audio('audio/click.mp3');
    this.clickSound.volume = 0.25;
    this.clickSound.load();
  }
  
  setupAudioElement(audioElement) {
    if (!this.audioContext) return;
    
    // Create media element source
    const source = this.audioContext.createMediaElementSource(audioElement);
    source.connect(this.gainNode);
    
    // Add to tracked elements
    this.audioElements.push({
      element: audioElement,
      source: source
    });
    
    // Add play/pause event listeners for visualization sync
    audioElement.addEventListener('play', () => {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Notify visualizers if they exist
      if (window.categoryVisualizer && typeof window.categoryVisualizer.setAudioReactive === 'function') {
        window.categoryVisualizer.setAudioReactive(true);
      }
    });
    
    audioElement.addEventListener('pause', () => {
      // Notify visualizers if they exist
      if (window.categoryVisualizer && typeof window.categoryVisualizer.setAudioReactive === 'function') {
        window.categoryVisualizer.setAudioReactive(false);
      }
    });
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    // Update gain value with smooth transition
    if (this.gainNode) {
      const now = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(this.isMuted ? 0 : 1, now + 0.2);
    }
    
    // Update toggle button appearance
    const toggleButton = document.getElementById('toggle-audio');
    if (toggleButton) {
      toggleButton.classList.toggle('muted', this.isMuted);
    }
    
    // Play feedback sound
    if (!this.isMuted) {
      this.playClickSound();
    }
    
    // Store preference in local storage
    localStorage.setItem('lufs_audio_muted', this.isMuted ? 'true' : 'false');
  }
  
  playHoverSound() {
    if (this.isMuted || !this.hoverSound) return;
    
    // Clone the audio to allow overlapping sounds
    const hoverSoundClone = this.hoverSound.cloneNode();
    hoverSoundClone.volume = 0.15;
    
    // Play with error handling
    hoverSoundClone.play().catch(e => {
      console.log('Audio play prevented:', e);
    });
  }
  
  playClickSound() {
    if (this.isMuted || !this.clickSound) return;
    
    // Clone the audio to allow overlapping sounds
    const clickSoundClone = this.clickSound.cloneNode();
    clickSoundClone.volume = 0.25;
    
    // Play with error handling
    clickSoundClone.play().catch(e => {
      console.log('Audio play prevented:', e);
    });
  }
  
  // Check if audio context is running, resume if needed
  checkAndResumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
  
  // Load mute preference from local storage
  loadMutePreference() {
    const savedMutePreference = localStorage.getItem('lufs_audio_muted');
    if (savedMutePreference === 'true' && !this.isMuted) {
      this.toggleMute();
    }
  }
}

// Create and export audio controller
window.audioController = new AudioController();
