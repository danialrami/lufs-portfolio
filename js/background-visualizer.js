// Background visualization for LUFS Audio Portfolio Website
// Based on the visualizer.js from the main site, with grayscale modifications

class BackgroundVisualizer {
  constructor() {
    // Initialize properties
    this.container = document.getElementById('background-canvas');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.particleSystem = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.isInitialized = false;
    this.isActive = true;
    this.mousePosition = { x: 0, y: 0 };
    this.targetMousePosition = { x: 0, y: 0 };
    
    // Desaturated colors for background (more grayscale as requested)
    this.colors = {
      background: new THREE.Color('#111111'),
      teal: new THREE.Color('#607775'),    // Desaturated teal
      red: new THREE.Color('#6a5a55'),     // Desaturated red
      yellow: new THREE.Color('#6a6860'),  // Desaturated yellow
      blue: new THREE.Color('#4a5560'),    // Desaturated blue
      white: new THREE.Color('#aaa9a2')    // Desaturated white
    };
    
    // Line animation properties
    this.lineCount = 30; // Reduced for better performance
    this.lines = null;
    this.lineAnimationSpeed = 0.03; // Reduced speed for subtlety
    this.lineMovementDirections = [];
    
    // Bind methods
    this.init = this.init.bind(this);
    this.createScene = this.createScene.bind(this);
    this.createParticles = this.createParticles.bind(this);
    this.createLights = this.createLights.bind(this);
    this.createConnectingLines = this.createConnectingLines.bind(this);
    this.animateLines = this.animateLines.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.animate = this.animate.bind(this);
    this.updateParticles = this.updateParticles.bind(this);
    this.destroy = this.destroy.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.checkVisibility = this.checkVisibility.bind(this);
    
    // Check for WebGL support
    this.hasWebGL = this.checkWebGLSupport();
    
    // Initialize if WebGL is supported
    if (this.hasWebGL) {
      this.init();
    } else {
      console.warn('WebGL not supported for background visualization');
    }
  }
  
  // Check if WebGL is supported
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      console.warn('WebGL not supported for background visualization');
      return false;
    }
  }
  
  // Initialize the visualization
  init() {
    if (this.isInitialized) return;
    
    // Create the scene, camera, renderer
    this.createScene();
    
    // Add particles
    this.createParticles();
    
    // Add lights
    this.createLights();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('scroll', this.checkVisibility, { passive: true });
    
    // Check initial visibility
    this.checkVisibility();
    
    // Start animation loop
    this.animate();
    
    this.isInitialized = true;
    console.log('Background visualization initialized');
  }
  
  // Create the scene, camera, and renderer
  createScene() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = this.colors.background;
    this.scene.fog = new THREE.FogExp2(this.colors.background, 0.001);
    
    // Create camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1;
    const far = 2000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 1000;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump' // Use medium precision for better performance
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
  }
  
  // Create particle system
  createParticles() {
    const particleCount = this.getParticleCount();
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Create particles with random positions
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color - randomly choose from desaturated brand colors
      const colorChoice = Math.random();
      if (colorChoice < 0.25) {
        color.copy(this.colors.teal);
      } else if (colorChoice < 0.5) {
        color.copy(this.colors.red);
      } else if (colorChoice < 0.75) {
        color.copy(this.colors.yellow);
      } else {
        color.copy(this.colors.blue);
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size - vary based on distance from center
      const distance = Math.sqrt(x * x + y * y + z * z);
      const normalizedDistance = Math.min(distance / 1000, 1);
      sizes[i] = Math.max(2, 8 * (1 - normalizedDistance));
    }
    
    // Add attributes to geometry
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create material
    const particleMaterial = new THREE.PointsMaterial({
      size: 4,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.5, // Reduced opacity for subtlety
      blending: THREE.AdditiveBlending,
      depthWrite: false // Disable depth writing for better performance
    });
    
    // Create particle system
    this.particles = particles;
    this.particleSystem = new THREE.Points(particles, particleMaterial);
    this.scene.add(this.particleSystem);
    
    // Create connecting lines
    this.createConnectingLines();
  }
  
  // Get appropriate particle count based on device capabilities
  getParticleCount() {
    // Detect mobile or low-end devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = window.navigator.hardwareConcurrency && window.navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEnd) {
      return 100; // Reduced count for mobile/low-end devices
    } else {
      return 200; // Standard count for desktop
    }
  }
  
  // Create connecting lines between particles
  createConnectingLines() {
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: this.colors.teal,
      transparent: true,
      opacity: 0.2, // Reduced opacity for subtlety
      blending: THREE.AdditiveBlending,
      depthWrite: false // Disable depth writing for better performance
    });
    
    // Create lines
    const positions = this.particles.attributes.position.array;
    const linePositions = new Float32Array(this.lineCount * 6); // 2 points per line, 3 values per point
    
    // Initialize movement directions for each line endpoint
    this.lineMovementDirections = [];
    
    for (let i = 0; i < this.lineCount; i++) {
      // Select two random particles
      const index1 = Math.floor(Math.random() * (positions.length / 3)) * 3;
      const index2 = Math.floor(Math.random() * (positions.length / 3)) * 3;
      
      // Set line positions
      linePositions[i * 6] = positions[index1];
      linePositions[i * 6 + 1] = positions[index1 + 1];
      linePositions[i * 6 + 2] = positions[index1 + 2];
      
      linePositions[i * 6 + 3] = positions[index2];
      linePositions[i * 6 + 4] = positions[index2 + 1];
      linePositions[i * 6 + 5] = positions[index2 + 2];
      
      // Create random movement directions for each endpoint
      this.lineMovementDirections.push({
        start: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(this.lineAnimationSpeed),
        end: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(this.lineAnimationSpeed)
      });
    }
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.lines);
  }
  
  // Animate the lines - make them move continuously in 3D space
  animateLines() {
    if (!this.lines) return;
    
    const positionAttribute = this.lines.geometry.getAttribute('position');
    const positions = positionAttribute.array;
    
    // Update each line endpoint position
    for (let i = 0; i < this.lineCount; i++) {
      // First endpoint (start of line)
      positions[i * 6] += this.lineMovementDirections[i].start.x;
      positions[i * 6 + 1] += this.lineMovementDirections[i].start.y;
      positions[i * 6 + 2] += this.lineMovementDirections[i].start.z;
      
      // Second endpoint (end of line)
      positions[i * 6 + 3] += this.lineMovementDirections[i].end.x;
      positions[i * 6 + 4] += this.lineMovementDirections[i].end.y;
      positions[i * 6 + 5] += this.lineMovementDirections[i].end.z;
      
      // Check boundaries and reverse direction if needed
      // Keep lines within a reasonable volume
      const maxDistance = 1000;
      
      // Check first endpoint (start of line)
      for (let j = 0; j < 3; j++) {
        const pos = positions[i * 6 + j];
        if (Math.abs(pos) > maxDistance) {
          // Reverse direction
          if (j === 0) this.lineMovementDirections[i].start.x *= -1;
          if (j === 1) this.lineMovementDirections[i].start.y *= -1;
          if (j === 2) this.lineMovementDirections[i].start.z *= -1;
          
          // Keep within bounds
          positions[i * 6 + j] = Math.sign(pos) * maxDistance;
        }
      }
      
      // Check second endpoint (end of line)
      for (let j = 0; j < 3; j++) {
        const pos = positions[i * 6 + 3 + j];
        if (Math.abs(pos) > maxDistance) {
          // Reverse direction
          if (j === 0) this.lineMovementDirections[i].end.x *= -1;
          if (j === 1) this.lineMovementDirections[i].end.y *= -1;
          if (j === 2) this.lineMovementDirections[i].end.z *= -1;
          
          // Keep within bounds
          positions[i * 6 + 3 + j] = Math.sign(pos) * maxDistance;
        }
      }
      
      // Occasionally change direction randomly (reduced frequency for subtlety)
      if (Math.random() < 0.005) {
        this.lineMovementDirections[i].start.x = (Math.random() - 0.5) * 2 * this.lineAnimationSpeed;
        this.lineMovementDirections[i].start.y = (Math.random() - 0.5) * 2 * this.lineAnimationSpeed;
        this.lineMovementDirections[i].start.z = (Math.random() - 0.5) * 2 * this.lineAnimationSpeed;
      }
      
      if (Math.random() < 0.005) {
        this.lineMovementDirections[i].end.x = (Math.random() - 0.5) * 2 * this.lineAnimationSpeed;
        this.lineMovementDirections[i].end.y = (Math.random() - 0.5) * 2 * this.lineAnimationSpeed;
        this.lineMovementDirections[i].end.z = (Math.random() - 0.5) * 2 * this.lineAnimationSpeed;
      }
    }
    
    // Update the geometry
    positionAttribute.needsUpdate = true;
  }
  
  // Create lights
  createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
    
    // Point light at camera position
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.copy(this.camera.position);
    this.scene.add(pointLight);
    
    // Colored point lights (using desaturated colors)
    const colors = [
      this.colors.teal,
      this.colors.red,
      this.colors.yellow,
      this.colors.blue
    ];
    
    this.coloredLights = [];
    
    colors.forEach((color, index) => {
      const light = new THREE.PointLight(color, 0.3); // Reduced intensity for subtlety
      const angle = (index / colors.length) * Math.PI * 2;
      const radius = 300;
      
      light.position.x = Math.cos(angle) * radius;
      light.position.y = Math.sin(angle) * radius;
      light.position.z = 100;
      
      this.scene.add(light);
      this.coloredLights.push(light);
    });
  }
  
  // Handle window resize
  handleResize() {
    if (!this.camera || !this.renderer) return;
    
    // Update camera
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  // Handle mouse movement
  handleMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Store target mouse position for smooth movement
    this.targetMousePosition.x = this.mouse.x;
    this.targetMousePosition.y = this.mouse.y;
  }
  
  // Handle visibility change
  handleVisibilityChange() {
    // Pause animation when tab is not visible
    this.isActive = document.visibilityState === 'visible';
    
    if (this.isActive) {
      this.animate();
    }
  }
  
  // Check if visualization is visible in viewport
  checkVisibility() {
    if (!this.container) return;
    
    const rect = this.container.getBoundingClientRect();
    const isInViewport = (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
    
    if (isInViewport !== this.isActive) {
      this.isActive = isInViewport;
      
      if (this.isActive) {
        this.animate();
      }
    }
  }
  
  // Animation loop
  animate() {
    if (!this.isActive) return;
    
    requestAnimationFrame(this.animate);
    
    // Update particles
    this.updateParticles();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  // Update particles
  updateParticles() {
    if (!this.particleSystem) return;
    
    const time = this.clock.getElapsedTime();
    
    // Smoothly move to target mouse position
    this.mousePosition.x += (this.targetMousePosition.x - this.mousePosition.x) * 0.03;
    this.mousePosition.y += (this.targetMousePosition.y - this.mousePosition.y) * 0.03;
    
    // Rotate particle system based on mouse position (reduced sensitivity for subtlety)
    this.particleSystem.rotation.x = this.mousePosition.y * 0.3;
    this.particleSystem.rotation.y = this.mousePosition.x * 0.3;
    
    // Update colored lights
    this.coloredLights.forEach((light, index) => {
      const angle = time * 0.3 + (index / this.coloredLights.length) * Math.PI * 2;
      const radius = 300;
      
      light.position.x = Math.cos(angle) * radius;
      light.position.y = Math.sin(angle) * radius;
    });
    
    // Animate lines with continuous movement
    this.animateLines();
  }
  
  // Clean up resources
  destroy() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('scroll', this.checkVisibility);
    
    // Dispose of geometries and materials
    if (this.particleSystem) {
      this.particleSystem.geometry.dispose();
      this.particleSystem.material.dispose();
      this.scene.remove(this.particleSystem);
    }
    
    if (this.lines) {
      this.lines.geometry.dispose();
      this.lines.material.dispose();
      this.scene.remove(this.lines);
    }
    
    // Remove lights
    if (this.coloredLights) {
      this.coloredLights.forEach(light => {
        this.scene.remove(light);
      });
    }
    
    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.particleSystem = null;
    this.lines = null;
    this.coloredLights = null;
    
    this.isInitialized = false;
    this.isActive = false;
  }
}

// Initialize background visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create background canvas if it doesn't exist
  if (!document.getElementById('background-canvas')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.insertBefore(canvas, document.body.firstChild);
  }
  
  // Initialize background visualizer
  const backgroundVisualizer = new BackgroundVisualizer();
  
  // Store reference for potential cleanup
  window.backgroundVisualizer = backgroundVisualizer;
  
  // Clean up on page unload
  window.addEventListener('beforeunload', function() {
    if (backgroundVisualizer) {
      backgroundVisualizer.destroy();
    }
  });
});
