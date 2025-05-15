// Three.js background visualization with unified approach for LUFS Audio Portfolio
// This file handles both background and category visualizations

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
    this.colors = {
      teal: 0x78BEBA,
      red: 0xD35233,
      yellow: 0xE7B225,
      blue: 0x2069af
    };
    
    // Store instance for potential external reference
    ThreeBackground.instance = this;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.createParticles = this.createParticles.bind(this);
    this.createLines = this.createLines.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('background-canvas'),
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particles and lines
    this.createParticles();
    this.createLines();
    
    // Add event listeners
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    
    // Start animation
    this.animate();
  }
  
  createParticles() {
    const particleCount = 100;
    const particles = new THREE.Group();
    
    // Create particles for each section with different colors
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
    
    // Create material with specified color
    const material = new THREE.PointsMaterial({
      size: 4,
      color: color,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    group.add(particles);
  }
  
  createLines() {
    // Create lines for each section with different colors
    this.createSectionLines(this.colors.teal, -window.innerWidth/3, 0);
    this.createSectionLines(this.colors.yellow, 0, 0);
    this.createSectionLines(this.colors.red, window.innerWidth/3, 0);
  }
  
  createSectionLines(color, offsetX, offsetY) {
    const lineCount = 15;
    const lineGroup = new THREE.Group();
    
    for (let i = 0; i < lineCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      
      // Create a curved line with random parameters
      const segments = 10;
      const amplitude = Math.random() * 100 + 50;
      const length = Math.random() * 400 + 200;
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const x = (t - 0.5) * length + offsetX;
        const y = Math.sin(t * Math.PI * 2) * amplitude + offsetY;
        const z = (Math.random() - 0.5) * 200;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      geometry.setFromPoints(points);
      
      // Create material with specified color
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        linewidth: 1
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
    this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
    this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
  }
  
  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }
  
  render() {
    // Subtle camera movement based on mouse position
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.01;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.01;
    this.camera.lookAt(this.scene.position);
    
    // Subtle rotation of particles
    if (this.particles) {
      this.particles.rotation.y += 0.0005;
    }
    
    // Subtle movement of lines
    if (this.lines) {
      this.lines.forEach((lineGroup, index) => {
        lineGroup.rotation.y += 0.0003 * (index % 2 === 0 ? 1 : -1);
        lineGroup.rotation.z += 0.0001 * (index % 2 === 0 ? 1 : -1);
      });
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Category-specific visualizations
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
    
    // Check if we're on a category page or home page
    this.isCategoryPage = document.querySelector('.category-header') !== null;
    
    this.colors = {
      sound: 0x78BEBA,    // teal
      music: 0xE7B225,    // yellow
      technical: 0xD35233 // red
    };
    
    // Store instance for external reference
    if (!CategoryVisualization.instances) {
      CategoryVisualization.instances = [];
    }
    CategoryVisualization.instances.push(this);
    
    // Bind methods
    this.init = this.init.bind(this);
    this.createVisualization = this.createVisualization.bind(this);
    this.onContainerMouseMove = this.onContainerMouseMove.bind(this);
    this.onContainerResize = this.onContainerResize.bind(this);
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.cleanup = this.cleanup.bind(this);
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
    
    // Add event listeners
    this.container.addEventListener('mousemove', this.onContainerMouseMove, { passive: true });
    window.addEventListener('resize', this.onContainerResize, { passive: true });
    
    // Start animation
    this.animate();
    
    // Add category class to help with styling
    if (this.container) {
      this.container.classList.add(`${this.type}-visualization`);
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
    // Create more cubes for category pages
    const cubeCount = this.isCategoryPage ? 35 : 20;
    const spreadFactor = this.isCategoryPage ? 15 : 5;
    
    const group = new THREE.Group();
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
      cube.position.x = (Math.random() - 0.5) * spreadFactor;
      cube.position.y = (Math.random() - 0.5) * spreadFactor;
      cube.position.z = (Math.random() - 0.5) * spreadFactor;
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
    // Create flowing wave visualization for music composition
    // This is the UNIFIED implementation for both homepage and category page
    const group = new THREE.Group();
    const color = this.colors.music;
    
    // Use more waves and wider spread for category pages
    const waveCount = this.isCategoryPage ? 10 : 5; // 5 lines (like a musical staff) on the homepage, 20 on the category page
    const xRange = this.isCategoryPage ? 30 : 15;
    const baseAmplitude = this.isCategoryPage ? 0.4 : 0.3;
    
    for (let w = 0; w < waveCount; w++) {
      const points = [];
      // More segments for category page for smoother curves
      const segments = this.isCategoryPage ? 100 : 70;
      
      // Calculate wave properties
      const ySpace = this.isCategoryPage ? 0.5 : 0.4;
      const yOffset = (w - waveCount/2) * ySpace;
      
      // Amplitude variation creates natural look
      const amplitude = baseAmplitude - (Math.abs(w - waveCount/2) * 0.03);
      const frequency = 0.1 + (w * 0.02);
      const phase = w * Math.PI / 4;
      
      for (let i = 0; i <= segments; i++) {
        // Create points for this wave
        const x = (i / segments) * xRange - (xRange/2);
        
        // Complex wave shape with multiple frequencies
        const primaryWave = Math.sin(x * frequency + phase) * amplitude;
        const detailWave = Math.sin(x * frequency * 3 + phase * 2) * amplitude * 0.2;
        const y = primaryWave + detailWave + yOffset;
        
        points.push(new THREE.Vector3(x, y, 0));
      }
      
      // Create line for this wave
      const waveGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const waveMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8 - (Math.abs(w - waveCount/2) * 0.07)
      });
      
      const wave = new THREE.Line(waveGeometry, waveMaterial);
      
      // Store data for animation
      wave.userData = {
        originalPoints: points.map(p => p.clone()),
        frequency: frequency,
        amplitude: amplitude,
        phase: phase,
        yOffset: yOffset
      };
      
      group.add(wave);
    }
    
    // Add particles for visual interest
    const particleCount = this.isCategoryPage ? 150 : 80;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    // Particle distribution
    const radiusX = this.isCategoryPage ? 15 : 8;
    const radiusY = this.isCategoryPage ? 5 : 2;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Create flattened oval particle distribution
      const angle = Math.random() * Math.PI * 2;
      // Add some randomness to radius for less uniform look
      const rx = (Math.random() * radiusX) + (radiusX * 0.3);
      const ry = (Math.random() * radiusY) + (radiusY * 0.3);
      
      particlePositions[i3] = Math.cos(angle) * rx;
      particlePositions[i3 + 1] = Math.sin(angle) * ry;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 3;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: this.isCategoryPage ? 0.15 : 0.1,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Store particles reference for animation
    group.userData.particles = particles;
    group.userData.originalParticlePositions = particlePositions.slice();
    
    this.scene.add(group);
    this.mesh = group;
  }
  
  createTechnicalVisualization() {
    // Create more particles for category pages
    const particleCount = this.isCategoryPage ? 150 : 100;
    const spreadFactor = this.isCategoryPage ? 15 : 10;
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    const color = this.colors.technical;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * spreadFactor;
      const y = (Math.random() - 0.5) * spreadFactor;
      const z = (Math.random() - 0.5) * spreadFactor;
      vertices.push(x, y, z);
      
      // Larger particles for category page
      sizes.push(Math.random() * (this.isCategoryPage ? 0.15 : 0.1) + 0.05);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      color: color,
      transparent: true,
      opacity: 0.7,
      size: this.isCategoryPage ? 0.15 : 0.1,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    
    // Store original positions for animation
    particles.userData.originalVertices = vertices.slice();
    
    this.scene.add(particles);
    this.mesh = particles;
  }
  
  createDefaultVisualization() {
    // Simple sphere fallback
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
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.render();
  }
  
  render() {
    const time = Date.now() * 0.001;
    
    // Camera movement based on mouse
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
          // Animate waves and particles
          if (this.mesh.children) {
            this.mesh.children.forEach((child, index) => {
              if (child.type === 'Line' && child.userData.originalPoints) {
                // Animate wave points
                const originalPoints = child.userData.originalPoints;
                const frequency = child.userData.frequency;
                const amplitude = child.userData.amplitude;
                const phase = child.userData.phase;
                const yOffset = child.userData.yOffset;
                const positions = child.geometry.attributes.position.array;
                
                // Animation time factor - slower for more graceful movement
                const timeFactor = time * 0.7;
                
                for (let i = 0; i < positions.length / 3; i++) {
                  const x = originalPoints[i].x;
                  
                  // Complex animation combining multiple waves
                  const primaryWave = Math.sin(x * frequency + phase + timeFactor) * amplitude;
                  const detailWave = Math.sin(x * frequency * 2.5 + phase * 1.5 + timeFactor * 1.2) * amplitude * 0.15;
                  // Add mouse influence for interactivity
                  const mouseInfluence = Math.sin(x * 0.3 + timeFactor * 0.5) * this.mouseY * 0.05;
                  
                  positions[i * 3 + 1] = primaryWave + detailWave + mouseInfluence + yOffset;
                }
                
                child.geometry.attributes.position.needsUpdate = true;
              } else if (child.type === 'Points') {
                // Animate particles
                const positions = child.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                  // Gentle particle movement
                  positions[i] += Math.sin(time * 0.7 + i * 0.01) * 0.01;
                  positions[i + 1] += Math.cos(time * 0.7 + i * 0.01) * 0.005;
                }
                
                child.geometry.attributes.position.needsUpdate = true;
                
                // Very slow rotation
                child.rotation.z = time * 0.03;
              }
            });
            
            // Subtle overall movement
            this.mesh.rotation.z = Math.sin(time * 0.1) * 0.02;
          }
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
          
          // Add rotation for category page
          if (this.isCategoryPage) {
            this.mesh.rotation.y = time * 0.05;
          }
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
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove event listeners
    if (this.container) {
      this.container.removeEventListener('mousemove', this.onContainerMouseMove);
    }
    window.removeEventListener('resize', this.onContainerResize);
    
    // Dispose of Three.js objects
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
    
    // Remove renderer from DOM
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
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
  // Determine what page we're on
  const currentPath = window.location.pathname;
  const isHomepage = currentPath === '/' || currentPath.includes('index.html');
  const isMusic = currentPath.includes('music-composition.html');
  const isSound = currentPath.includes('sound-design.html');
  const isTechnical = currentPath.includes('technical-audio.html');
  
  // Initialize the background on all pages
  const background = new ThreeBackground();
  background.init();
  
  // Initialize homepage category sections if on homepage
  if (isHomepage) {
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
  } 
  // Initialize category visualizations on category pages
  else {
    const categoryViz = document.getElementById('category-visualization');
    if (categoryViz) {
      let type = 'default';
      
      if (isSound) {
        type = 'sound';
      } else if (isMusic) {
        type = 'music';
      } else if (isTechnical) {
        type = 'technical';
      }
      
      const categoryVisualization = new CategoryVisualization('category-visualization', type);
      categoryVisualization.init();
    }
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    // Dispose WebGL contexts
    if (CategoryVisualization.instances) {
      CategoryVisualization.instances.forEach(instance => {
        if (typeof instance.cleanup === 'function') {
          instance.cleanup();
        }
      });
    }
    
    // Clear WebGL contexts from canvases
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    });
  });
});