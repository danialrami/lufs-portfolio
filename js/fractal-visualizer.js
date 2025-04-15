// Three.js visualization with slower, more cohesive organic fractals for LUFS Audio Portfolio
// Based on client's feedback for slower-moving, less distracting visualizations

class FractalVisualizer {
  constructor(containerId) {
    // Scene setup
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Colors from LUFS brand palette
    this.colors = {
      teal: new THREE.Color('#78BEBA'),
      red: new THREE.Color('#D35233'),
      yellow: new THREE.Color('#E7B225'),
      blue: new THREE.Color('#2069af'),
      black: new THREE.Color('#111111'),
      white: new THREE.Color('#fbf9e2')
    };
    
    // Animation properties - SLOWED DOWN based on client feedback
    this.clock = new THREE.Clock();
    this.animationFrame = null;
    this.isAnimating = false;
    this.mousePosition = new THREE.Vector2(0, 0);
    this.targetRotation = new THREE.Vector2(0, 0);
    this.currentRotation = new THREE.Vector2(0, 0);
    
    // Animation speed - reduced significantly
    this.rotationSpeed = 0.05; // Slower rotation
    this.morphSpeed = 0.2;    // Slower morphing
    
    // Visualization type (can be 'fractal', 'organic', or 'particles')
    this.visualizationType = 'organic';
    
    // Bind methods
    this.init = this.init.bind(this);
    this.createFractalGeometry = this.createFractalGeometry.bind(this);
    this.createOrganicGeometry = this.createOrganicGeometry.bind(this);
    this.createParticleSystem = this.createParticleSystem.bind(this);
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.dispose = this.dispose.bind(this);
  }
  
  init(type = 'organic') {
    // Set visualization type
    this.visualizationType = type;
    
    // Configure renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
    
    // Configure camera
    this.camera.position.z = 5;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Create geometry based on type
    switch (this.visualizationType) {
      case 'fractal':
        this.createFractalGeometry();
        break;
      case 'organic':
        this.createOrganicGeometry();
        break;
      case 'particles':
        this.createParticleSystem();
        break;
      default:
        this.createOrganicGeometry();
    }
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize);
    this.container.addEventListener('mousemove', this.handleMouseMove);
    
    // Start animation
    this.isAnimating = true;
    this.animate();
  }
  
  createFractalGeometry() {
    // Create a group to hold all fractal elements
    this.fractalGroup = new THREE.Group();
    this.scene.add(this.fractalGroup);
    
    // Create a recursive fractal tree with slower animation
    const createBranch = (depth, length, thickness, position, direction, parent, color) => {
      if (depth === 0) return null;
      
      // Create material with specified color
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.3,
        transparent: true,
        opacity: 0.8
      });
      
      // Create branch geometry
      const geometry = new THREE.CylinderGeometry(thickness, thickness * 0.8, length, 8);
      geometry.translate(0, length/2, 0);
      
      // Create mesh
      const branch = new THREE.Mesh(geometry, material);
      branch.position.copy(position);
      branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      
      // Add to parent or group
      if (parent) {
        parent.add(branch);
      } else {
        this.fractalGroup.add(branch);
      }
      
      // Calculate end point for child branches
      const endPoint = new THREE.Vector3(0, length, 0).applyQuaternion(branch.quaternion).add(position);
      
      // Create child branches with subtle randomization
      const childLength = length * 0.7;
      const childThickness = thickness * 0.7;
      
      // Branch 1 - rotated left
      const dir1 = direction.clone().applyAxisAngle(
        new THREE.Vector3(0, 0, 1), 
        Math.PI/4 + (Math.random() * 0.1 - 0.05) // Less randomness
      );
      
      // Alternate colors for visual interest
      const childColor1 = (depth % 2 === 0) ? this.colors.teal : this.colors.blue;
      createBranch(depth-1, childLength, childThickness, endPoint, dir1, branch, childColor1);
      
      // Branch 2 - rotated right
      const dir2 = direction.clone().applyAxisAngle(
        new THREE.Vector3(0, 0, 1), 
        -Math.PI/4 + (Math.random() * 0.1 - 0.05) // Less randomness
      );
      
      // Alternate colors for visual interest
      const childColor2 = (depth % 2 === 0) ? this.colors.yellow : this.colors.red;
      createBranch(depth-1, childLength, childThickness, endPoint, dir2, branch, childColor2);
      
      return branch;
    };
    
    // Create initial branch with teal color
    createBranch(
      4, // depth
      1, // length
      0.1, // thickness
      new THREE.Vector3(0, -2, 0), // position
      new THREE.Vector3(0, 1, 0), // direction
      null, // parent
      this.colors.teal // color
    );
  }
  
  createOrganicGeometry() {
    // Create a group to hold all organic shapes
    this.organicGroup = new THREE.Group();
    this.scene.add(this.organicGroup);
    
    // Create a set of organic curves with LUFS colors
    const createOrganicCurve = (radius, height, segments, color, offset) => {
      // Create a set of control points for a spline curve
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        // Add subtle noise to the radius for organic feel
        const radiusNoise = 0.8 + 0.2 * Math.sin(i * 3 + offset);
        const x = Math.cos(angle) * radius * radiusNoise;
        const y = (i / segments) * height - height/2;
        const z = Math.sin(angle) * radius * radiusNoise;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      // Create a closed spline curve
      const curve = new THREE.CatmullRomCurve3(points);
      curve.closed = true;
      
      // Create a tube geometry from the curve
      const tubeGeometry = new THREE.TubeGeometry(
        curve,
        64,        // tubular segments
        radius/10, // radius
        8,         // radial segments
        true       // closed
      );
      
      // Create a material with the specified color
      const tubeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color.clone().multiplyScalar(0.2),
        emissiveIntensity: 0.3,
        shininess: 80,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      // Create the mesh and return it
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      return tube;
    };
    
    // Create several organic curves with LUFS brand colors
    const tealCurve = createOrganicCurve(1.0, 0.5, 20, this.colors.teal, 0);
    const redCurve = createOrganicCurve(0.8, 0.3, 15, this.colors.red, 2);
    const yellowCurve = createOrganicCurve(1.2, 0.4, 18, this.colors.yellow, 4);
    const blueCurve = createOrganicCurve(0.9, 0.6, 22, this.colors.blue, 6);
    
    // Add curves to the group
    this.organicGroup.add(tealCurve);
    this.organicGroup.add(redCurve);
    this.organicGroup.add(yellowCurve);
    this.organicGroup.add(blueCurve);
    
    // Add some subtle particles for additional visual interest
    const particleCount = 100; // Reduced count for less distraction
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random position within a sphere
      const radius = 2 + Math.random() * 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random color from brand palette
      const colorIndex = Math.floor(Math.random() * 4);
      let color;
      switch (colorIndex) {
        case 0: color = this.colors.teal; break;
        case 1: color = this.colors.red; break;
        case 2: color = this.colors.yellow; break;
        case 3: color = this.colors.blue; break;
      }
      
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.organicGroup.add(this.particles);
  }
  
  createParticleSystem() {
    // Create a particle system with LUFS brand colors
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Create particles in a grid pattern for more structure
    const gridSize = Math.ceil(Math.pow(particleCount, 1/3));
    const spacing = 4 / gridSize;
    
    let index = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          if (index >= particleCount) break;
          
          // Position with slight randomness
          positions[index * 3] = (x - gridSize/2) * spacing + (Math.random() * 0.3 - 0.15);
          positions[index * 3 + 1] = (y - gridSize/2) * spacing + (Math.random() * 0.3 - 0.15);
          positions[index * 3 + 2] = (z - gridSize/2) * spacing + (Math.random() * 0.3 - 0.15);
          
          // Color based on position
          const colorChoice = Math.floor(Math.random() * 4);
          let color;
          switch (colorChoice) {
            case 0: color = this.colors.teal; break;
            case 1: color = this.colors.red; break;
            case 2: color = this.colors.yellow; break;
            case 3: color = this.colors.blue; break;
          }
          
          colors[index * 3] = color.r;
          colors[index * 3 + 1] = color.g;
          colors[index * 3 + 2] = color.b;
          
          // Size variation
          sizes[index] = Math.random() * 0.05 + 0.02;
          
          index++;
        }
      }
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Custom shader material for better-looking particles
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Subtle movement
          vec3 pos = position;
          float angle = time * 0.05; // Very slow rotation
          
          // Apply a very slow rotation around Y axis
          float x = pos.x * cos(angle) - pos.z * sin(angle);
          float z = pos.x * sin(angle) + pos.z * cos(angle);
          pos.x = x;
          pos.z = z;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a circular particle
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          float alpha = smoothstep(0.5, 0.4, dist);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    this.particleSystem = new THREE.Points(particles, particleMaterial);
    this.scene.add(this.particleSystem);
  }
  
  animate() {
    if (!this.isAnimating) return;
    
    this.animationFrame = requestAnimationFrame(this.animate);
    
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    // Smooth rotation towards target - SLOWED DOWN
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.02; // Slower follow
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.02; // Slower follow
    
    // Update based on visualization type
    switch (this.visualizationType) {
      case 'fractal':
        if (this.fractalGroup) {
          // Very slow rotation
          this.fractalGroup.rotation.y = elapsedTime * this.rotationSpeed * 0.2 + this.currentRotation.x * 0.3;
          this.fractalGroup.rotation.x = Math.sin(elapsedTime * this.rotationSpeed * 0.1) * 0.1 + this.currentRotation.y * 0.3;
        }
        break;
        
      case 'organic':
        if (this.organicGroup) {
          // Very slow rotation
          this.organicGroup.rotation.y = elapsedTime * this.rotationSpeed * 0.1 + this.currentRotation.x * 0.3;
          this.organicGroup.rotation.x = Math.sin(elapsedTime * this.rotationSpeed * 0.05) * 0.1 + this.currentRotation.y * 0.3;
          
          // Animate individual curves very slowly
          if (this.organicGroup.children.length > 0) {
            this.organicGroup.children.forEach((child, index) => {
              if (child.type === 'Mesh') {
                child.rotation.z = elapsedTime * this.rotationSpeed * 0.05 * (index % 2 === 0 ? 1 : -1);
                
                // Very subtle scale pulsing
                const scale = 1 + 0.03 * Math.sin(elapsedTime * this.morphSpeed * 0.2 + index);
                child.scale.set(scale, scale, scale);
              }
            });
          }
          
          // Animate particles very subtly
          if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
              // Extremely subtle movement
              positions[i] += Math.sin(elapsedTime * 0.1 + i) * 0.0005;
              positions[i+1] += Math.cos(elapsedTime * 0.1 + i) * 0.0005;
              positions[i+2] += Math.sin(elapsedTime * 0.05 + i) * 0.0005;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
          }
        }
        break;
        
      case 'particles':
        if (this.particleSystem) {
          // Update time uniform for shader animation
          this.particleSystem.material.uniforms.time.value = elapsedTime;
          
          // Very slow rotation
          this.particleSystem.rotation.y = elapsedTime * this.rotationSpeed * 0.05 + this.currentRotation.x * 0.2;
          this.particleSystem.rotation.x = Math.sin(elapsedTime * this.rotationSpeed * 0.03) * 0.05 + this.currentRotation.y * 0.2;
        }
        break;
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  handleResize() {
    // Update camera aspect ratio
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    
    // Update particle pixel ratio if using particles
    if (this.particleSystem && this.particleSystem.material.uniforms) {
      this.particleSystem.material.uniforms.pixelRatio.value = window.devicePixelRatio;
    }
  }
  
  handleMouseMove(event) {
    // Calculate normalized mouse position (-1 to 1)
    const rect = this.container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    // Update mouse position
    this.mousePosition.set(x, y);
    
    // Set target rotation based on mouse position - reduced influence
    this.targetRotation.set(x * 0.3, y * 0.3); // Less rotation from mouse movement
  }
  
  dispose() {
    // Stop animation
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    
    // Dispose of Three.js objects
    this.scene.traverse(object => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Remove renderer from DOM
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
    
    // Dispose of renderer
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Export visualizer
window.FractalVisualizer = FractalVisualizer;
