// Three.js category visualizations with full-width support
// This file handles the visualizations for each category section

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
    this.frameRateLimit = window.matchMedia('(max-width: 768px)').matches ? 30 : 60;
    this.frameInterval = 1000 / this.frameRateLimit;
    
    // Check if we're on a category page or home page
    this.isCategoryPage = document.querySelector('.category-header') !== null;
    
    // Original vibrant colors
    this.colors = {
      sound: 0x78BEBA,    // teal
      music: 0xE7B225,    // yellow
      technical: 0xD35233 // red
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
    
    // Create camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // Use wider field of view for category pages
    const fov = this.isCategoryPage ? 90 : 75;
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    
    // Position camera further back for category pages
    this.camera.position.z = this.isCategoryPage ? 8 : 5;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true
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
        // For category pages, use the full width version
        if (this.isCategoryPage) {
          this.createFullWidthSoundVisualization();
        } else {
          // For homepage, use the current version
          this.createSoundVisualization();
        }
        break;
        
      case 'music':
        // For category pages, use the full width version
        if (this.isCategoryPage) {
          this.createFullWidthMusicVisualization();
        } else {
          // For homepage, use the current version
          this.createMusicVisualization();
        }
        break;
        
      // Technical Audio already appears to be using full width
      case 'technical':
        if (this.isCategoryPage) {
          this.createFullWidthTechnicalVisualization();
        } else {
          this.createTechnicalVisualization();
        }
        break;
        
      default:
        this.createDefaultVisualization();
    }
  }
  
  // Standard visualizations for homepage

  createSoundVisualization() {
    // Create a group of cubes for sound design
    const group = new THREE.Group();
    const cubeCount = 20;
    const color = this.colors.sound;
    
    for (let i = 0; i < cubeCount; i++) {
      const size = Math.random() * 0.3 + 0.1;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.25
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (Math.random() - 0.5) * 5;
      cube.position.y = (Math.random() - 0.5) * 5;
      cube.position.z = (Math.random() - 0.5) * 5;
      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;
      
      // Store original position for animation
      cube.userData.originalPosition = cube.position.clone();
      cube.userData.animationOffset = Math.random() * Math.PI * 2;
      cube.userData.animationSpeed = Math.random() * 0.01 + 0.005;
      
      group.add(cube);
    }
    
    this.scene.add(group);
    this.mesh = group;
  }
  
  createMusicVisualization() {
    // Create a wave pattern for music composition
    const waveCount = 5;
    const group = new THREE.Group();
    const color = this.colors.music;
    
    for (let w = 0; w < waveCount; w++) {
      const points = [];
      const segments = 50;
      const amplitude = 0.5 - (w * 0.1);
      const yOffset = (w - waveCount/2) * 0.5;
      
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * 10 - 5;
        const y = Math.sin(i * 0.2) * amplitude + yOffset;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7 - (w * 0.1)
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
    // Create a particle system for technical audio
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    const color = this.colors.technical;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      vertices.push(x, y, z);
      
      sizes.push(Math.random() * 0.1 + 0.05);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      color: color,
      transparent: true,
      opacity: 0.7,
      size: 0.1,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    
    // Store original positions for animation
    particles.userData.originalVertices = vertices.slice();
    
    this.scene.add(particles);
    this.mesh = particles;
  }
  
  // Full-width visualizations for category pages
  
  createFullWidthSoundVisualization() {
    // Create a group of cubes for sound design - optimized for full width
    const group = new THREE.Group();
    const cubeCount = 35; // More cubes for better distribution
    const color = this.colors.sound;
    
    for (let i = 0; i < cubeCount; i++) {
      const size = Math.random() * 0.4 + 0.1;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.25
      });
      
      const cube = new THREE.Mesh(geometry, material);
      
      // Distribute across full width - use a wider range
      cube.position.x = (Math.random() - 0.5) * 20; // Wider x-distribution
      cube.position.y = (Math.random() - 0.5) * 10; // Wider y-distribution
      cube.position.z = (Math.random() - 0.5) * 8;
      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;
      
      // Store original position for animation
      cube.userData.originalPosition = cube.position.clone();
      cube.userData.animationOffset = Math.random() * Math.PI * 2;
      cube.userData.animationSpeed = Math.random() * 0.01 + 0.005;
      
      group.add(cube);
    }
    
    this.scene.add(group);
    this.mesh = group;
  }
  
  createFullWidthMusicVisualization() {
    // Create a wave pattern for music composition - optimized for full width
    const waveCount = 8; // More waves for wider distribution
    const group = new THREE.Group();
    const color = this.colors.music;
    
    for (let w = 0; w < waveCount; w++) {
      const points = [];
      const segments = 70; // More segments for smoother waves
      const amplitude = 0.6 - (w * 0.06);
      const yOffset = (w - waveCount/2) * 0.8;
      
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * 25 - 12.5; // Wider range
        const y = Math.sin(i * 0.2) * amplitude + yOffset;
        const z = (Math.random() - 0.5) * 3; // Add some depth
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8 - (w * 0.08)
      });
      
      const wave = new THREE.Line(geometry, material);
      wave.userData.originalPoints = points.map(p => p.clone());
      wave.userData.animationOffset = w * Math.PI / waveCount;
      
      group.add(wave);
    }
    
    this.scene.add(group);
    this.mesh = group;
  }
  
  createFullWidthTechnicalVisualization() {
    // Create a more spread out particle system for technical audio
    const particleCount = 150; // More particles for full width
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    const color = this.colors.technical;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 25; // Wider x-distribution
      const y = (Math.random() - 0.5) * 15; // Wider y-distribution
      const z = (Math.random() - 0.5) * 15;
      vertices.push(x, y, z);
      
      sizes.push(Math.random() * 0.15 + 0.05);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      color: color,
      transparent: true,
      opacity: 0.7,
      size: 0.15,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    
    // Store original positions for animation
    particles.userData.originalVertices = vertices.slice();
    
    this.scene.add(particles);
    this.mesh = particles;
  }
  
  createDefaultVisualization() {
    // Create a simple sphere as fallback
    this.geometry = new THREE.SphereGeometry(1, 32, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x78BEBA,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
  
  onContainerMouseMove(event) {
    if (!this.container) return;
    
    const rect = this.container.getBoundingClientRect();
    this.mouseX = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouseY = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
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
    
    // Subtle camera movement based on mouse position
    this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouseY * 2 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);
    
    // Type-specific animations
    if (this.mesh) {
      switch (this.type) {
        case 'sound':
          // Animate cubes
          this.mesh.children.forEach(cube => {
            const originalPos = cube.userData.originalPosition;
            const offset = cube.userData.animationOffset;
            const speed = cube.userData.animationSpeed;
            
            cube.position.x = originalPos.x + Math.sin(time + offset) * 0.3;
            cube.position.y = originalPos.y + Math.cos(time + offset) * 0.3;
            
            cube.rotation.x += speed;
            cube.rotation.y += speed * 0.8;
          });
          break;
          
        case 'music':
          // Animate waves
          this.mesh.children.forEach(wave => {
            const originalPoints = wave.userData.originalPoints;
            const offset = wave.userData.animationOffset;
            const positions = wave.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length / 3; i++) {
              const originalY = originalPoints[i].y;
              positions[i * 3 + 1] = originalY + Math.sin(time * 2 + i * 0.2 + offset) * 0.2;
            }
            
            wave.geometry.attributes.position.needsUpdate = true;
          });
          break;
          
        case 'technical':
          // Animate particles
          const positions = this.mesh.geometry.attributes.position.array;
          const originalVertices = this.mesh.userData.originalVertices;
          
          for (let i = 0; i < positions.length; i += 3) {
            const originalX = originalVertices[i];
            const originalY = originalVertices[i + 1];
            const originalZ = originalVertices[i + 2];
            
            positions[i] = originalX + Math.sin(time + i) * 0.1;
            positions[i + 1] = originalY + Math.cos(time + i) * 0.1;
            positions[i + 2] = originalZ + Math.sin(time * 0.5 + i) * 0.1;
          }
          
          this.mesh.geometry.attributes.position.needsUpdate = true;
          break;
          
        default:
          // Default animation
          if (this.mesh.rotation) {
            this.mesh.rotation.x += 0.005;
            this.mesh.rotation.y += 0.01;
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

// Initialize category visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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