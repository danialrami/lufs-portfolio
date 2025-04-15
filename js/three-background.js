// Original Three.js background visualization from first iteration
// Reintegrated based on client feedback for more subtle animations

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
    
    this.colors = {
      sound: 0x78BEBA,    // teal
      music: 0xE7B225,    // yellow
      technical: 0xD35233 // red
    };
    
    this.init = this.init.bind(this);
    this.createVisualization = this.createVisualization.bind(this);
    this.onContainerMouseMove = this.onContainerMouseMove.bind(this);
    this.onContainerResize = this.onContainerResize.bind(this);
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
  }
  
  init() {
    if (!this.container) return;
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Create visualization based on type
    this.createVisualization();
    
    // Add event listeners
    this.container.addEventListener('mousemove', this.onContainerMouseMove);
    window.addEventListener('resize', this.onContainerResize);
    
    // Start animation
    this.animate();
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
    requestAnimationFrame(this.animate);
    this.render();
  }
  
  render() {
    const time = Date.now() * 0.001;
    
    // Subtle camera movement based on mouse position
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouseY - this.camera.position.y) * 0.05;
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
  
  // Initialize category header visualization if on category page
  const categoryViz = document.getElementById('category-visualization');
  if (categoryViz) {
    let type = 'default';
    
    // Determine which category page we're on
    if (document.title.includes('Sound Design')) {
      type = 'sound';
    } else if (document.title.includes('Music Composition')) {
      type = 'music';
    } else if (document.title.includes('Technical Audio')) {
      type = 'technical';
    }
    
    const categoryVisualization = new CategoryVisualization('category-visualization', type);
    categoryVisualization.init();
  }
});
