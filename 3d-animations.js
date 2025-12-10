/**
 * 3D Animation System untuk Website Pemeliharaan Fasilitas
 * Menggunakan Three.js untuk membuat visual 3D yang memukau
 */

// Initialize Three.js Scene
class AnimatedScene {
    constructor(containerId, sceneConfig = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.config = {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
            backgroundColor: 0xffffff,
            ...sceneConfig
        };

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.config.width / this.config.height,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.setup();
        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setup() {
        this.renderer.setSize(this.config.width, this.config.height);
        this.renderer.setClearColor(this.config.backgroundColor, 0.1);
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        this.camera.position.z = 5;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    addMesh(mesh) {
        this.scene.add(mesh);
        return mesh;
    }
}

// 3D Models
class ThreeDModels {
    // Create rotating cube
    static createRotatingCube(color = 0x10b981) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);

        cube.rotationSpeed = { x: 0.005, y: 0.008, z: 0.003 };

        cube.customUpdate = function () {
            this.rotation.x += this.rotationSpeed.x;
            this.rotation.y += this.rotationSpeed.y;
            this.rotation.z += this.rotationSpeed.z;
        };

        return cube;
    }

    // Create animated sphere
    static createAnimatedSphere(color = 0x667eea, radius = 1) {
        const geometry = new THREE.IcosahedronGeometry(radius, 4);
        const material = new THREE.MeshPhongMaterial({ 
            color,
            wireframe: false,
            emissive: color,
            emissiveIntensity: 0.2
        });
        const sphere = new THREE.Mesh(geometry, material);

        sphere.pulseSpeed = 0.02;
        sphere.pulseScale = 1;
        sphere.targetScale = 1;

        sphere.customUpdate = function () {
            this.targetScale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
            this.pulseScale += (this.targetScale - this.pulseScale) * 0.1;
            this.scale.set(this.pulseScale, this.pulseScale, this.pulseScale);
            this.rotation.x += 0.003;
            this.rotation.y += 0.005;
        };

        return sphere;
    }

    // Create pyramid
    static createPyramid(color = 0xf59e0b) {
        const geometry = new THREE.TetrahedronGeometry(1, 0);
        const material = new THREE.MeshPhongMaterial({ 
            color,
            emissive: color,
            emissiveIntensity: 0.1
        });
        const pyramid = new THREE.Mesh(geometry, material);

        pyramid.customUpdate = function () {
            this.rotation.y += 0.005;
            this.position.y = Math.sin(Date.now() * 0.0005) * 0.5;
        };

        return pyramid;
    }

    // Create torus
    static createTorus(color = 0x06b6d4, radius = 1) {
        const geometry = new THREE.TorusGeometry(radius, radius * 0.4, 16, 16);
        const material = new THREE.MeshPhongMaterial({ 
            color,
            emissive: color,
            emissiveIntensity: 0.15
        });
        const torus = new THREE.Mesh(geometry, material);

        torus.customUpdate = function () {
            this.rotation.x += 0.004;
            this.rotation.y += 0.006;
        };

        return torus;
    }

    // Create octahedron
    static createOctahedron(color = 0x8b5cf6) {
        const geometry = new THREE.OctahedronGeometry(1, 0);
        const material = new THREE.MeshPhongMaterial({ 
            color,
            emissive: color,
            emissiveIntensity: 0.2
        });
        const octahedron = new THREE.Mesh(geometry, material);

        octahedron.customUpdate = function () {
            this.rotation.x += 0.006;
            this.rotation.z += 0.004;
            this.position.y = Math.cos(Date.now() * 0.0008) * 0.3;
        };

        return octahedron;
    }

    // Create particle system
    static createParticleSystem(count = 100, color = 0x10b981) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            velocities[i] = (Math.random() - 0.5) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i + 2] = (Math.random() - 0.5) * 0.02;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ 
            color, 
            size: 0.1,
            sizeAttenuation: true
        });
        const particles = new THREE.Points(geometry, material);

        particles.velocities = velocities;
        particles.customUpdate = function () {
            const positions = this.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // Bounce back
                if (Math.abs(positions[i]) > 5) velocities[i] *= -1;
                if (Math.abs(positions[i + 1]) > 5) velocities[i + 1] *= -1;
                if (Math.abs(positions[i + 2]) > 5) velocities[i + 2] *= -1;
            }
            this.geometry.attributes.position.needsUpdate = true;
        };

        return particles;
    }

    // Create wireframe sphere
    static createWireframeSphere(color = 0x059669, radius = 1.5) {
        const geometry = new THREE.IcosahedronGeometry(radius, 4);
        const material = new THREE.MeshPhongMaterial({ 
            color,
            wireframe: true,
            emissive: color,
            emissiveIntensity: 0.3
        });
        const wireframe = new THREE.Mesh(geometry, material);

        wireframe.customUpdate = function () {
            this.rotation.x += 0.002;
            this.rotation.y += 0.003;
            this.rotation.z += 0.001;
        };

        return wireframe;
    }
}

// Initialize 3D scenes on page
function initialize3DAnimations() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded. Skipping 3D animations.');
        return;
    }

    // Hero Section 3D
    initializeHero3D();

    // Category Cards 3D
    initializeCategory3D();

    // Footer 3D
    initializeFooter3D();
}

// Hero Section 3D Animation
function initializeHero3D() {
    const heroContainer = document.getElementById('hero-3d-container');
    if (!heroContainer) {
        console.log('Hero 3D container not found - using background image instead');
        return;
    }

    const scene = new AnimatedScene('hero-3d-container', {
        backgroundColor: 0xf0fdf4
    });

    // Create multiple floating objects
    const cube = ThreeDModels.createRotatingCube(0x10b981);
    cube.position.x = -2;
    scene.addMesh(cube);

    const sphere = ThreeDModels.createAnimatedSphere(0x667eea, 0.8);
    sphere.position.x = 2;
    scene.addMesh(sphere);

    const pyramid = ThreeDModels.createPyramid(0xf59e0b);
    pyramid.position.x = 0;
    pyramid.position.z = -1;
    scene.addMesh(pyramid);

    const particles = ThreeDModels.createParticleSystem(50, 0x06b6d4);
    particles.position.z = -2;
    scene.addMesh(particles);

    // Store for animation loop
    scene.customMeshes = [cube, sphere, pyramid, particles];

    // Update animation loop
    const originalAnimate = scene.animate.bind(scene);
    scene.animate = function () {
        scene.customMeshes.forEach(mesh => {
            if (mesh.customUpdate) mesh.customUpdate();
        });
        originalAnimate();
    };
}

// Category Cards 3D Animation
function initializeCategory3D() {
    const categoryCards = document.querySelectorAll('.card');

    categoryCards.forEach((card, index) => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.opacity = '0.2';
        canvas.style.borderRadius = '20px';
        canvas.style.pointerEvents = 'none';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.prepend(canvas);

        // Three.js scene for this card
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(300, 300);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 3;

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(5, 5, 5);
        scene.add(light);

        // Create different 3D object for each card
        let mesh;
        const colors = [0x10b981, 0x667eea, 0xf59e0b, 0x06b6d4, 0x8b5cf6];
        const color = colors[index % colors.length];

        const modelType = index % 5;
        switch (modelType) {
            case 0:
                mesh = ThreeDModels.createRotatingCube(color);
                break;
            case 1:
                mesh = ThreeDModels.createAnimatedSphere(color, 1);
                break;
            case 2:
                mesh = ThreeDModels.createPyramid(color);
                break;
            case 3:
                mesh = ThreeDModels.createTorus(color);
                break;
            case 4:
                mesh = ThreeDModels.createOctahedron(color);
                break;
        }

        scene.add(mesh);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (mesh.customUpdate) mesh.customUpdate();
            renderer.render(scene, camera);
        };
        animate();

        // Add hover effect
        card.addEventListener('mouseenter', () => {
            canvas.style.opacity = '0.4';
            if (mesh.rotationSpeed) {
                mesh.rotationSpeed.x *= 2;
                mesh.rotationSpeed.y *= 2;
                mesh.rotationSpeed.z *= 2;
            }
        });

        card.addEventListener('mouseleave', () => {
            canvas.style.opacity = '0.2';
            if (mesh.rotationSpeed) {
                mesh.rotationSpeed.x /= 2;
                mesh.rotationSpeed.y /= 2;
                mesh.rotationSpeed.z /= 2;
            }
        });
    });
}

// Footer 3D Animation
function initializeFooter3D() {
    const footerContainer = document.getElementById('footer-3d-container');
    if (!footerContainer) return;

    const canvas = document.createElement('canvas');
    footerContainer.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(footerContainer.clientWidth, 200);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        footerContainer.clientWidth / 200,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x10b981, 0.5);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Create multiple wireframe spheres
    const spheres = [];
    for (let i = 0; i < 5; i++) {
        const sphere = ThreeDModels.createWireframeSphere(0x10b981, 0.6);
        sphere.position.x = (i - 2) * 1.5;
        sphere.position.y = Math.sin(i) * 0.5;
        scene.add(sphere);
        spheres.push(sphere);
    }

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        spheres.forEach(sphere => {
            if (sphere.customUpdate) sphere.customUpdate();
        });
        renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        const width = footerContainer.clientWidth;
        renderer.setSize(width, 200);
        camera.aspect = width / 200;
        camera.updateProjectionMatrix();
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Defer 3D initialization to avoid blocking page render
    setTimeout(() => {
        initialize3DAnimations();
    }, 500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Dispose of Three.js resources
    document.querySelectorAll('canvas').forEach(canvas => {
        const renderer = canvas.renderer;
        if (renderer) renderer.dispose();
    });
});
