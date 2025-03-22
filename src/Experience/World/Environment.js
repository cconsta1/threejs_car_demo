import * as THREE from "three"
import Experience from "../Experience.js"

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        //this.debug = this.experience.debug
        
        // Nintendo-style colors
        this.nintendoColors = {
            skyTop: 0x4DB7FF,       // Bright Nintendo blue sky
            skyBottom: 0xB5EDFF,     // Lighter blue near horizon
            sunColor: 0xFFDD00,      // Vibrant Nintendo yellow
            grassColor: 0x00DD6D,    // Bright Nintendo green
            cloudColor: 0xFFFFFF     // Pure white for cartoon clouds
        }

        // if (this.debug.active) {
        //     this.debugFolder = this.debug.gui.addFolder('environment')
        // }

        this.setSunLight()
        this.setNintendoSky()
        this.addCartoonSun()
        this.addDecorations()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight(0xffffff, 3)
        this.sunLight.castShadow = true
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.camera.left = -7
        this.sunLight.shadow.camera.top = 7
        this.sunLight.shadow.camera.right = 7
        this.sunLight.shadow.camera.bottom = -7

        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(5, 10, 8)
        this.scene.add(this.sunLight)

        // Add a brighter ambient light for Nintendo-style flat lighting
        const ambientLight = new THREE.AmbientLight(0xCCEEFF, 0.7)
        this.scene.add(ambientLight)

        // Add a subtle hemispherical light for better ground colors
        const hemiLight = new THREE.HemisphereLight(
            this.nintendoColors.skyTop,    // Sky color
            this.nintendoColors.grassColor, // Ground color
            0.3
        )
        this.scene.add(hemiLight)

        // Debug
        // if (this.debug.active) {
        //     this.debugFolder
        //         .add(this.sunLight, 'intensity')
        //         .name('sunLightIntensity')
        //         .min(0)
        //         .max(10)
        //         .step(0.001)

        //     this.debugFolder
        //         .add(this.sunLight.position, 'x')
        //         .name('sunLightX')
        //         .min(- 5)
        //         .max(5)
        //         .step(0.001)

        //     this.debugFolder
        //         .add(this.sunLight.position, 'y')
        //         .name('sunLightY')
        //         .min(- 5)
        //         .max(5)
        //         .step(0.001)

        //     this.debugFolder
        //         .add(this.sunLight.position, 'z')
        //         .name('sunLightZ')
        //         .min(- 5)
        //         .max(5)
        //         .step(0.001)
        // }
    }

    setNintendoSky() {
        // Create a simple gradient sky dome using a large sphere
        const skyGeometry = new THREE.SphereGeometry(500, 32, 16)
        
        // Create gradient material with shaders for Nintendo cartoon look
        const skyMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vWorldPosition;
                
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vWorldPosition;
                
                // Nintendo-style colors
                vec3 topColor = vec3(0.3, 0.72, 1.0);    // Bright Nintendo sky blue
                vec3 bottomColor = vec3(0.71, 0.93, 1.0); // Very light blue/white for horizon
                
                void main() {
                    // Normalized direction from center to position
                    vec3 viewDirection = normalize(vWorldPosition);
                    
                    // Calculate gradient based on height (y-coordinate)
                    float h = normalize(viewDirection).y;
                    
                    // More pronounced gradient transition for cartoon effect
                    // Sharp transition is more Nintendo-like
                    vec3 skyColor = mix(bottomColor, topColor, smoothstep(-0.1, 0.55, h));
                    
                    gl_FragColor = vec4(skyColor, 1.0);
                }
            `,
            side: THREE.BackSide // Render inside of sphere
        });
        
        this.sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(this.sky);

        // if (this.debug.active) {
        //     this.debugFolder
        //         .add(this.sky.position, 'y')
        //         .name('skyPositionY')
        //         .min(-100)
        //         .max(100)
        //         .step(1)
        // }
    }
    
    addCartoonSun() {
        // Create a more Nintendo-style sun using a circle with rays
        const sunGroup = new THREE.Group();
        
        // Main sun disc
        const sunGeometry = new THREE.CircleGeometry(15, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: this.nintendoColors.sunColor,
            side: THREE.DoubleSide
        });
        
        const sunDisc = new THREE.Mesh(sunGeometry, sunMaterial);
        sunGroup.add(sunDisc);
        
        // Add sun rays (triangles arranged in a star pattern)
        const rayCount = 12;
        const innerRadius = 15;
        const outerRadius = 22;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const angleNext = ((i + 0.5) / rayCount) * Math.PI * 2;
            
            const rayGeometry = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                0, 0, 0,                                          // Center
                innerRadius * Math.cos(angle), innerRadius * Math.sin(angle), 0,     // Inner point
                outerRadius * Math.cos(angleNext), outerRadius * Math.sin(angleNext), 0  // Outer point
            ]);
            
            rayGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            const rayMaterial = new THREE.MeshBasicMaterial({
                color: this.nintendoColors.sunColor,
                side: THREE.DoubleSide
            });
            
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            sunGroup.add(ray);
        }
        
        // Position the sun in the same direction as the light
        const sunPosition = this.sunLight.position.clone().normalize();
        sunGroup.position.copy(sunPosition.multiplyScalar(490)); // Just inside the sky sphere
        sunGroup.lookAt(0, 0, 0); // Make it face the center
        
        this.scene.add(sunGroup);
        this.sunMesh = sunGroup;
    }
    
    addDecorations() {
        // Add some Nintendo-style cartoon clouds
        this.addCartoonClouds();
        
        // Add some distant hills in Nintendo style (optional)
        this.addNintendoHills();
    }
    
    addCartoonClouds() {
        // Create a group for all clouds
        this.cloudGroup = new THREE.Group();
        this.scene.add(this.cloudGroup);
        
        // Create several cartoon clouds
        const cloudPositions = [
            { x: 150, y: 100, z: -200, scale: 1.5 },
            { x: -250, y: 80, z: -150, scale: 2 },
            { x: 100, y: 120, z: 200, scale: 1.8 },
            { x: -180, y: 90, z: 220, scale: 1.2 }
        ];
        
        cloudPositions.forEach(pos => {
            const cloud = this.createNintendoCloud();
            cloud.position.set(pos.x, pos.y, pos.z);
            cloud.scale.set(pos.scale, pos.scale, pos.scale);
            this.cloudGroup.add(cloud);
        });
    }
    
    createNintendoCloud() {
        // Create a Nintendo-style puffy cloud using spheres
        const cloudGroup = new THREE.Group();
        
        // Cloud material - pure white for cartoon look
        const cloudMaterial = new THREE.MeshToonMaterial({
            color: this.nintendoColors.cloudColor,
            emissive: 0x333333,
            emissiveIntensity: 0.1
        });
        
        // Main cloud puffs
        const puffPositions = [
            { x: 0, y: 0, z: 0, scale: 1 },
            { x: -10, y: -2, z: 0, scale: 0.8 },
            { x: 10, y: -3, z: 0, scale: 0.7 },
            { x: 5, y: 5, z: 0, scale: 0.6 },
            { x: -7, y: 6, z: 0, scale: 0.7 }
        ];
        
        puffPositions.forEach(puff => {
            const puffGeometry = new THREE.SphereGeometry(10, 16, 16);
            const puffMesh = new THREE.Mesh(puffGeometry, cloudMaterial);
            puffMesh.position.set(puff.x, puff.y, puff.z);
            puffMesh.scale.set(puff.scale, puff.scale, 0.6 * puff.scale); // Flatten a bit
            cloudGroup.add(puffMesh);
        });
        
        return cloudGroup;
    }
    
    addNintendoHills() {
        // Create some distant cartoon hills
        const hillsGroup = new THREE.Group();
        
        // Hill material in bright Nintendo green
        const hillMaterial = new THREE.MeshToonMaterial({
            color: this.nintendoColors.grassColor
        });
        
        // Create a few hills at different positions
        const hillPositions = [
            { x: 0, z: -350, width: 400, height: 60 },
            { x: -300, z: -300, width: 250, height: 40 },
            { x: 280, z: -320, width: 300, height: 50 }
        ];
        
        hillPositions.forEach(hill => {
            // Simple curved hill shape
            const hillShape = new THREE.Shape();
            hillShape.moveTo(-hill.width/2, 0);
            hillShape.quadraticCurveTo(0, hill.height, hill.width/2, 0);
            
            const hillGeometry = new THREE.ExtrudeGeometry(hillShape, {
                steps: 1,
                depth: 20,
                bevelEnabled: false
            });
            
            const hillMesh = new THREE.Mesh(hillGeometry, hillMaterial);
            hillMesh.position.set(hill.x, -5, hill.z);
            hillMesh.rotation.x = -Math.PI / 2;
            
            hillsGroup.add(hillMesh);
        });
        
        this.scene.add(hillsGroup);
    }
}