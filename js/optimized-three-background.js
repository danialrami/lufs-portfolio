// Optimized Three.js background visualization with grayscale/desaturated colors
// Based on user feedback for more subtle, less resource-intensive animations

class ThreeBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.lines = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.animationFrameId = null;
    this.isVisible = true;
    this.lastFrameTime = 0;
    // this.frameRateLimit = 30; Limit to 30 FPS for better performance
    this.frameInterval = 1000 / this.frameRateLimit;
    
    // Desaturated colors (more grayscale as requested)
    this.colors = {
      teal: 0x607775,    // Desaturated teal
      red: 0x8a6a60,     // Desaturated red
      yellow: 0x8a8575,  // Desaturated yellow
      blue: 0x5a6a75     // Desaturated blue
    };
    
    // Bind methods
    this.init = this.init.bind(this);
    this.createParticles = this.createParticles.bind(this);
    this.createLines = this.createLines.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera with optimized settings
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 5, 2000);
    this.camera.position.z = 1000;
    
    // Create renderer with optimized settings
    const canvas = document.getElementById('background-canvas');
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      alpha: true,
      antialias: false, // Disable antialiasing for better performance
      powerPreference: 'high-performance',
      precision: 'mediump' // Use medium precision for better performance
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    // Create particles and lines with reduced count
    this.createParticles();
    this.createLines();
    
    // Add event listeners with passive option for better performance
    window.addEventListener('resize', this.onWindowResize, { passive: true });
    document.addEventListener('mousemove', this.onDocumentMouseMove, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Start animation
    this.animate();
  }
  
  createParticles() {
    // Reduce particle count for better performance
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 20)); 
    const particles = new THREE.Group();
    
    // Create particles for each section with different desaturated colors
    this.createSectionParticles(particles, particleCount, this.colors.teal, -window.innerWidth/3, 0);
    this.createSectionParticles(particles, particleCount, this.colors.yellow, 0, 0);
    this.createSectionParticles(particles, particleCount, this.colors.red, window.innerWidth/3, 0);
    
    this.scene.add(particles);
    this.particles = particles;
  }
  
  createSectionParticles(group, count, color, offsetX, offsetY) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Create random positions within a section
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 800 + offsetX;
      const y = (Math.random() - 0.5) * 800 + offsetY;
      const z = (Math.random() - 0.5) * 800;
      vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    // Create material with specified color and optimized settings
    const material = new THREE.PointsMaterial({
      size: 3,
      color: color,
      transparent: true,
      opacity: 0.5, // Reduced opacity for subtlety
      sizeAttenuation: true,
      depthWrite: false // Disable depth writing for better performance
    });
    
    const particles = new THREE.Points(geometry, material);
    group.add(particles);
  }
  
  createLines() {
    // Reduce line count for better performance
    this.createSectionLines(this.colors.teal, -window.innerWidth/3, 0);
    this.createSectionLines(this.colors.yellow, 0, 0);
    this.createSectionLines(this.colors.red, window.innerWidth/3, 0);
  }
  
  createSectionLines(color, offsetX, offsetY) {
    // Reduce line count for better performance
    const lineCount = Math.min(8, Math.floor(window.innerWidth / 150));
    const lineGroup = new THREE.Group();
    
    for (let i = 0; i < lineCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      
      // Create a curved line with random parameters
      const segments = 8; // Reduced segment count
      const amplitude = Math.random() * 80 + 40;
      const length = Math.random() * 300 + 150;
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const x = (t - 0.5) * length + offsetX;
        const y = Math.sin(t * Math.PI * 2) * amplitude + offsetY;
        const z = (Math.random() - 0.5) * 150;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      geometry.setFromPoints(points);
      
      // Create material with specified color and optimized settings
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3, // Reduced opacity for subtlety
        depthWrite: false // Disable depth writing for better performance
      });
      
      const line = new THREE.Line(geometry, material);
      lineGroup.add(line);
    }
    
    this.scene.add(lineGroup);
    
    if (!this.lines) {
      this.lines = [];
    }
    
    this.lines.push(lineGroup);
  }
  
  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  onDocumentMouseMove(event) {
    // Reduce mouse movement sensitivity for subtlety
    this.mouseX = (event.clientX - this.windowHalfX) * 0.02;
    this.mouseY = (event.clientY - this.windowHalfY) * 0.02;
  }
  
  handleVisibilityChange() {
    // Pause animation when tab is not visible
    this.isVisible = document.visibilityState === 'visible';
    
    if (this.isVisible && !this.animationFrameId) {
      this.lastFrameTime = performance.now();
      this.animate();
    }
  }
  
  animate() {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }
    
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Implement frame rate limiting for better performance
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;
    
    if (elapsed > this.frameInterval) {
      this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
      this.render();
    }
  }
  
  render() {
    // Subtle camera movement based on mouse position with reduced sensitivity
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.005;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.005;
    this.camera.lookAt(this.scene.position);
    
    // Subtle rotation of particles with reduced speed
    if (this.particles) {
      this.particles.rotation.y += 0.0002;
    }
    
    // Subtle movement of lines with reduced speed
    if (this.lines) {
      this.lines.forEach((lineGroup, index) => {
        lineGroup.rotation.y += 0.0001 * (index % 2 === 0 ? 1 : -1);
        lineGroup.rotation.z += 0.00005 * (index % 2 === 0 ? 1 : -1);
      });
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  cleanup() {
    // Proper cleanup to prevent memory leaks
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Dispose of geometries and materials
    if (this.particles) {
      this.particles.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }
    
    if (this.lines) {
      this.lines.forEach(lineGroup => {
        lineGroup.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
    }
    
    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.lines = null;
  }
}

// Optimized category-specific visualizations
class CategoryVisualization {
  constructor(containerId, type) {
    this.container = document.getElementById(containerId);
    this.type = type; // 'sound', 'music', or 'technical'
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.animationFrameId = null;
    this.isVisible = true;
    this.lastFrameTime = 0;
    this.frameRateLimit = 30; // Limit to 30 FPS for better performance
    this.frameInterval = 1000 / this.frameRateLimit;
    
    // Desaturated colors (more grayscale as requested)
    this.colors = {
      sound: 0x607775,    // Desaturated teal
      music: 0x8a8575,    // Desaturated yellow
      technical: 0x8a6a60 // Desaturated red
    };
    
    // Bind methods
    this.init = this.init.bind(this);
    this.createVisualization = this.createVisualization.bind(this);
    this.onContainerMouseMove = this.onContainerMouseMove.bind(this);
    this.onContainerResize = this.onContainerResize.bind(this);
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.checkVisibility = this.checkVisibility.bind(this);
  }
  
  init() {
    if (!this.container) return;
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera with optimized settings
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 5;
    
    // Create renderer with optimized settings
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false, // Disable antialiasing for better performance
      powerPreference: 'high-performance',
      precision: 'mediump' // Use medium precision for better performance
    });
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    this.container.appendChild(this.renderer.domElement);
    
    // Create visualization based on type
    this.createVisualization();
    
    // Add event listeners with passive option for better performance
    this.container.addEventListener('mousemove', this.onContainerMouseMove, { passive: true });
    window.addEventListener('resize', this.onContainerResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('scroll', this.checkVisibility, { passive: true });
    
    // Check initial visibility
    this.checkVisibility();
    
    // Start animation
    this.animate();
  }
  
  checkVisibility() {
    // Only render when in viewport for better performance
    if (!this.container) return;
    
    const rect = this.container.getBoundingClientRect();
    const isInViewport = (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
    
    if (isInViewport !== this.isVisible) {
      this.isVisible = isInViewport;
      
      if (this.isVisible && !this.animationFrameId) {
        this.lastFrameTime = performance.now();
        this.animate();
      }
    }
  }
  
  handleVisibilityChange() {
    // Pause animation when tab is not visible
    const wasVisible = this.isVisible;
    this.isVisible = document.visibilityState === 'visible' && wasVisible;
    
    if (this.isVisible && !this.animationFrameId) {
      this.lastFrameTime = performance.now();
      this.animate();
    }
  }
  
  createVisualization() {
    switch (this.type) {
      case 'sound':
        this.createSoundVisualization();
        break;
      case 'music':
        this.createMusicVisualization();
        break;
      case 'technical':
        this.createTechnicalVisualization();
        break;
      default:
        this.createDefaultVisualization();
    }
  }
  
  createSoundVisualization() {
    // Create a group of cubes for sound design with reduced count
    const group = new THREE.Group();
    const cubeCount = Math.min(12, Math.floor(this.container.clientWidth / 30));
    const color = this.colors.sound;
    
    for (let i = 0; i < cubeCount; i++) {
      const size = Math.random() * 0.3 + 0.1;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.random() * 0.4 + 0.2, // Reduced opacity for subtlety
        depthWrite: false // Disable depth writing for better performance
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (Math.random() - 0.5) * 4;
      cube.position.y = (Math.random() - 0.5) * 4;
      cube.position.z = (Math.random() - 0.5) * 4;
      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;
      
      // Store original position for animation
      cube.userData.originalPosition = cube.position.clone();
      cube.userData.animationOffset = Math.random() * Math.PI * 2;
      cube.userData.animationSpeed = Math.random() * 0.005 + 0.002; // Reduced speed for subtlety
      
      group.add(cube);
    }
    
    this.scene.add(group);
    this.mesh = group;
  }
  
  createMusicVisualization() {
    // Create a wave pattern for music composition with reduced complexity
    const waveCount = 3; // Reduced count
    const group = new THREE.Group();
    const color = this.colors.music;
    
    for (let w = 0; w < waveCount; w++) {
      const points = [];
      const segments = 30; // Reduced segment count
      const amplitude = 0.4 - (w * 0.1);
      const yOffset = (w - waveCount/2) * 0.4;
      
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * 8 - 4;
        const y = Math.sin(i * 0.2) * amplitude + yOffset;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5 - (w * 0.1), // Reduced opacity for subtlety
        depthWrite: false // Disable depth writing for better performance
      });
      
      const wave = new THREE.Line(geometry, material);
      wave.userData.originalPoints = points.map(p => p.clone());
      wave.userData.animationOffset = w * Math.PI / waveCount;
      
      group.add(wave);
    }
    
    this.scene.add(group);
    this.mesh = group;
  }
  
  createTechnicalVisualization() {
    // Create a particle system for technical audio with reduced count
    const particleCount = Math.min(60, Math.floor(this.container.clientWidth / 15));
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    const color = this.colors.technical;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 8;
      vertices.push(x, y, z);
      
      sizes.push(Math.random() * 0.08 + 0.04); // Reduced size for subtlety
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      color: color,
      transparent: true,
      opacity: 0.5, // Reduced opacity for subtlety
      size: 0.08,
      sizeAttenuation: true,
      depthWrite: false // Disable depth writing for better performance
    });
    
    const particles = new THREE.Points(geometry, material);
    
    // Store original positions for animation
    particles.userData.originalVertices = vertices.slice();
    
    this.scene.add(particles);
    this.mesh = particles;
  }
  
  createDefaultVisualization() {
    // Create a simple sphere as fallback with reduced complexity
    this.geometry = new THREE.SphereGeometry(1, 16, 16); // Reduced segment count
    this.material = new THREE.MeshBasicMaterial({
      color: 0x607775, // Desaturated teal
      transparent: true,
      opacity: 0.5, // Reduced opacity for subtlety
      wireframe: true,
      depthWrite: false // Disable depth writing for better performance
    });
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
  
  onContainerMouseMove(event) {
    if (!this.container) return;
    
    const rect = this.container.getBoundingClientRect();
    // Reduced sensitivity for subtlety
    this.mouseX = ((event.clientX - rect.left) / this.container.clientWidth) * 1.5 - 0.75;
    this.mouseY = -((event.clientY - rect.top) / this.container.clientHeight) * 1.5 + 0.75;
  }
  
  onContainerResize() {
    if (!this.container) return;
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  animate() {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }
    
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Implement frame rate limiting for better performance
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;
    
    if (elapsed > this.frameInterval) {
      this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
      this.render();
    }
  }
  
  render() {
    const time = Date.now() * 0.001;
    
    // Subtle camera movement based on mouse position with reduced sensitivity
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.03;
    this.camera.position.y += (this.mouseY - this.camera.position.y) * 0.03;
    this.camera.lookAt(this.scene.position);
    
    // Type-specific animations with reduced speed
    if (this.mesh) {
      switch (this.type) {
        case 'sound':
          // Animate cubes with reduced movement
          this.mesh.children.forEach(cube => {
            const originalPos = cube.userData.originalPosition;
            const offset = cube.userData.animationOffset;
            const speed = cube.userData.animationSpeed;
            
            cube.position.x = originalPos.x + Math.sin(time + offset) * 0.2;
            cube.position.y = originalPos.y + Math.cos(time + offset) * 0.2;
            
            cube.rotation.x += speed;
            cube.rotation.y += speed * 0.8;
          });
          break;
          
        case 'music':
          // Animate waves with reduced movement
          this.mesh.children.forEach(wave => {
            const originalPoints = wave.userData.originalPoints;
            const offset = wave.userData.animationOffset;
            const positions = wave.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length / 3; i++) {
              const originalY = originalPoints[i].y;
              positions[i * 3 + 1] = originalY + Math.sin(time * 1.5 + i * 0.2 + offset) * 0.15;
            }
            
            wave.geometry.attributes.position.needsUpdate = true;
          });
          break;
          
        case 'technical':
          // Animate particles with reduced movement
          const positions = this.mesh.geometry.attributes.position.array;
          const originalVertices = this.mesh.userData.originalVertices;
          
          for (let i = 0; i < positions.length; i += 3) {
            const originalX = originalVertices[i];
            const originalY = originalVertices[i + 1];
            const originalZ = originalVertices[i + 2];
            
            positions[i] = originalX + Math.sin(time + i) * 0.07;
            positions[i + 1] = originalY + Math.cos(time + i) * 0.07;
            positions[i + 2] = originalZ + Math.sin(time * 0.5 + i) * 0.07;
          }
          
          this.mesh.geometry.attributes.position.needsUpdate = true;
          break;
          
        default:
          // Default animation with reduced speed
          if (this.mesh.rotation) {
            this.mesh.rotation.x += 0.003;
            this.mesh.rotation.y += 0.005;
          }
      }
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  cleanup() {
    // Proper cleanup to prevent memory leaks
    if (!this.container) return;
    
    this.container.removeEventListener('mousemove', this.onContainerMouseMove);
    window.removeEventListener('resize', this.onContainerResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('scroll', this.checkVisibility);
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Remove renderer from DOM
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    
    // Dispose of geometries and materials
    if (this.mesh) {
      if (this.mesh.traverse) {
        this.mesh.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      } else {
        if (this.mesh.geometry) this.mesh.geometry.dispose();
        if (this.mesh.material) {
          if (Array.isArray(this.mesh.material)) {
            this.mesh.material.forEach(material => material.dispose());
          } else {
            this.mesh.material.dispose();
          }
        }
      }
    }
    
    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }
}

// Initialize visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize background
  const background = new ThreeBackground();
  background.init();
  
  // Initialize category visualizations
  const soundViz = document.getElementById('sound-design-visualization');
  const musicViz = document.getElementById('music-composition-visualization');
  const technicalViz = document.getElementById('technical-audio-visualization');
  
  if (soundViz) {
    const soundVisualization = new CategoryVisualization('sound-design-visualization', 'sound');
    soundVisualization.init();
  }
  
  if (musicViz) {
    const musicVisualization = new CategoryVisualization('music-composition-visualization', 'music');
    musicVisualization.init();
  }
  
  if (technicalViz) {
    const technicalVisualization = new CategoryVisualization('technical-audio-visualization', 'technical');
    technicalVisualization.init();
  }
  
  // Clean up on page unload to prevent memory leaks
  window.addEventListener('beforeunload', function() {
    if (background) background.cleanup();
    
    // Clean up any remaining WebGL contexts
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    });
  });
});
