// Enhanced Three.js Interactive Elements for Homepage
document.addEventListener('DOMContentLoaded', function() {
    // Only run this script on the homepage
    if (!document.getElementById('portfolio-categories')) return;
    
    // Initialize Three.js scene for each category
    const categories = document.querySelectorAll('.category');
    
    categories.forEach((category, index) => {
        // Create canvas for this category
        const canvas = document.createElement('canvas');
        canvas.classList.add('category-canvas');
        category.appendChild(canvas);
        
        // Initialize Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, category.offsetWidth / category.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true
        });
        
        renderer.setSize(category.offsetWidth, category.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Camera position
        camera.position.z = 30;
        
        // Colors based on category
        let primaryColor;
        let categoryType;
        
        if (category.id === 'sound-design-category') {
            primaryColor = new THREE.Color('#78BEBA'); // Teal
            categoryType = 'sound-design';
        } else if (category.id === 'music-composition-category') {
            primaryColor = new THREE.Color('#E7B225'); // Yellow
            categoryType = 'music-composition';
        } else if (category.id === 'technical-audio-category') {
            primaryColor = new THREE.Color('#D35233'); // Red
            categoryType = 'technical-audio';
        }
        
        // Create visualization based on category type
        if (categoryType === 'sound-design') {
            // Waveform visualization for sound design
            createWaveformVisualization(scene, primaryColor);
        } else if (categoryType === 'music-composition') {
            // Particle system for music composition
            createParticleVisualization(scene, primaryColor);
        } else if (categoryType === 'technical-audio') {
            // Network/circuit visualization for technical audio
            createNetworkVisualization(scene, primaryColor);
        }
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Update animations based on category type
            if (categoryType === 'sound-design') {
                updateWaveformVisualization(scene);
            } else if (categoryType === 'music-composition') {
                updateParticleVisualization(scene);
            } else if (categoryType === 'technical-audio') {
                updateNetworkVisualization(scene);
            }
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            renderer.setSize(category.offsetWidth, category.offsetHeight);
            camera.aspect = category.offsetWidth / category.offsetHeight;
            camera.updateProjectionMatrix();
        });
        
        // Start animation
        animate();
        
        // Add interactivity - mouse movement affects visualization
        category.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Update visualizations based on mouse position
            if (categoryType === 'sound-design') {
                updateWaveformWithMouse(scene, x, y);
            } else if (categoryType === 'music-composition') {
                updateParticlesWithMouse(scene, x, y);
            } else if (categoryType === 'technical-audio') {
                updateNetworkWithMouse(scene, x, y);
            }
        });
    });
    
    // Sound Design: Waveform Visualization
    function createWaveformVisualization(scene, color) {
        const waveformGroup = new THREE.Group();
        scene.add(waveformGroup);
        
        // Create waveform lines
        const lineCount = 40;
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < lineCount; i++) {
            const points = [];
            const segments = 50;
            const amplitude = Math.random() * 2 + 1;
            const frequency = Math.random() * 0.05 + 0.01;
            const phase = Math.random() * Math.PI * 2;
            
            for (let j = 0; j < segments; j++) {
                const x = (j / (segments - 1)) * 40 - 20;
                const y = Math.sin(x * frequency + phase) * amplitude;
                points.push(new THREE.Vector3(x, y, 0));
            }
            
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial.clone());
            line.position.y = (i - lineCount / 2) * 0.5;
            line.userData = { amplitude, frequency, phase };
            waveformGroup.add(line);
        }
        
        // Store reference for animation
        scene.userData.waveformGroup = waveformGroup;
    }
    
    function updateWaveformVisualization(scene) {
        const waveformGroup = scene.userData.waveformGroup;
        if (!waveformGroup) return;
        
        const time = Date.now() * 0.001;
        
        waveformGroup.children.forEach((line, index) => {
            const { amplitude, frequency, phase } = line.userData;
            const points = [];
            const segments = 50;
            
            for (let j = 0; j < segments; j++) {
                const x = (j / (segments - 1)) * 40 - 20;
                const y = Math.sin(x * frequency + phase + time) * amplitude;
                points.push(new THREE.Vector3(x, y, 0));
            }
            
            line.geometry.setFromPoints(points);
        });
    }
    
    function updateWaveformWithMouse(scene, x, y) {
        const waveformGroup = scene.userData.waveformGroup;
        if (!waveformGroup) return;
        
        // Adjust waveform based on mouse position
        waveformGroup.rotation.z = x * 0.2;
        waveformGroup.scale.set(1 + y * 0.2, 1 + y * 0.2, 1);
    }
    
    // Music Composition: Particle Visualization
    function createParticleVisualization(scene, color) {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        
        const posArray = new Float32Array(particlesCount * 3);
        const scaleArray = new Float32Array(particlesCount);
        
        // Assign positions and scales
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            // Create a circular pattern
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 15 + 5;
            
            posArray[i3] = Math.cos(angle) * radius;
            posArray[i3 + 1] = Math.sin(angle) * radius;
            posArray[i3 + 2] = (Math.random() - 0.5) * 10;
            
            scaleArray[i] = Math.random() * 0.5 + 0.5;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
        
        // Material for particles
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.3,
            color: color,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        // Create particle system
        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);
        
        // Store reference for animation
        scene.userData.particleSystem = particleSystem;
        scene.userData.initialPositions = posArray.slice();
    }
    
    function updateParticleVisualization(scene) {
        const particleSystem = scene.userData.particleSystem;
        if (!particleSystem) return;
        
        const time = Date.now() * 0.001;
        const positions = particleSystem.geometry.attributes.position.array;
        const initialPositions = scene.userData.initialPositions;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Create flowing movement
            positions[i] = initialPositions[i] + Math.sin(time + i * 0.01) * 0.3;
            positions[i + 1] = initialPositions[i + 1] + Math.cos(time + i * 0.01) * 0.3;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.rotation.z += 0.001;
    }
    
    function updateParticlesWithMouse(scene, x, y) {
        const particleSystem = scene.userData.particleSystem;
        if (!particleSystem) return;
        
        // Adjust particles based on mouse position
        particleSystem.rotation.x = y * 0.5;
        particleSystem.rotation.y = x * 0.5;
    }
    
    // Technical Audio: Network Visualization
    function createNetworkVisualization(scene, color) {
        const networkGroup = new THREE.Group();
        scene.add(networkGroup);
        
        // Create nodes
        const nodeCount = 20;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const nodeMaterial = new THREE.MeshBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Position nodes in a grid-like pattern
            const x = (Math.random() - 0.5) * 30;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 10;
            
            node.position.set(x, y, z);
            networkGroup.add(node);
            nodes.push(node);
        }
        
        // Create connections between nodes
        const connections = [];
        const maxDistance = 10;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                
                if (distance < maxDistance) {
                    const points = [
                        nodes[i].position.clone(),
                        nodes[j].position.clone()
                    ];
                    
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const lineMaterial = new THREE.LineBasicMaterial({ 
                        color: color,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    networkGroup.add(line);
                    connections.push({
                        line: line,
                        nodeA: nodes[i],
                        nodeB: nodes[j]
                    });
                }
            }
        }
        
        // Store references for animation
        scene.userData.networkGroup = networkGroup;
        scene.userData.nodes = nodes;
        scene.userData.connections = connections;
    }
    
    function updateNetworkVisualization(scene) {
        const networkGroup = scene.userData.networkGroup;
        if (!networkGroup) return;
        
        const time = Date.now() * 0.001;
        const nodes = scene.userData.nodes;
        const connections = scene.userData.connections;
        
        // Animate nodes
        nodes.forEach((node, index) => {
            node.position.x += Math.sin(time * 0.5 + index) * 0.01;
            node.position.y += Math.cos(time * 0.5 + index) * 0.01;
        });
        
        // Update connections
        connections.forEach(connection => {
            const points = [
                connection.nodeA.position.clone(),
                connection.nodeB.position.clone()
            ];
            
            connection.line.geometry.setFromPoints(points);
            connection.line.geometry.verticesNeedUpdate = true;
        });
        
        networkGroup.rotation.y += 0.001;
    }
    
    function updateNetworkWithMouse(scene, x, y) {
        const networkGroup = scene.userData.networkGroup;
        if (!networkGroup) return;
        
        // Adjust network based on mouse position
        networkGroup.rotation.x = y * 0.5;
        networkGroup.rotation.z = x * 0.5;
    }
});
