import * as THREE from 'three'
import Experience from '../Experience.js'

export default class SimpleCarModel {
    constructor() {
        this.experience = new Experience()
        
        // Simplified primary color palette that appeals to kids
        this.nintendoColors = [
            0xFF0000, // Bright red
            0x00FF00, // Bright green
            0x0000FF, // Bright blue
            0xFFFF00, // Yellow
            0xFF00FF, // Magenta
            0x00FFFF  // Cyan
        ];
        
        this.setModel()
    }

    setModel() {
        // Create chassis with bright red as default
        const initialColor = this.nintendoColors[0]; 
        
        // Main body - NO ROOF
        this.chassisMesh = new THREE.Group();
        this.chassisMesh.position.set(5, 5, 0);
        
        // Create main body with slightly rounded corners for cartoon effect
        const bodyGeometry = new THREE.BoxGeometry(2, 0.9, 4);
        const bodyMaterial = new THREE.MeshToonMaterial({ 
            color: initialColor,
            emissive: new THREE.Color(initialColor).multiplyScalar(0.1)
        });
        
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.chassisMesh.add(bodyMesh);
        
        // Add cartoon-style windows (black)
        this.windowMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.4, 1.6),
            new THREE.MeshToonMaterial({ 
                color: 0x111111
            })
        );
        this.windowMesh.position.set(0, 0.3, 0.5);
        this.chassisMesh.add(this.windowMesh);
        
        // Add cartoon headlights (yellow)
        this.headlightLeft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16),
            new THREE.MeshToonMaterial({ 
                color: 0xFFFF00,
                emissive: 0xFFFF00,
                emissiveIntensity: 0.5
            })
        );
        this.headlightLeft.position.set(0.7, 0, 1.9);
        this.headlightLeft.rotation.z = Math.PI / 2;
        this.chassisMesh.add(this.headlightLeft);
        
        this.headlightRight = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16),
            new THREE.MeshToonMaterial({ 
                color: 0xFFFF00,
                emissive: 0xFFFF00,
                emissiveIntensity: 0.5
            })
        );
        this.headlightRight.position.set(-0.7, 0, 1.9);
        this.headlightRight.rotation.z = Math.PI / 2;
        this.chassisMesh.add(this.headlightRight);
        
        // Add taillights (red)
        this.taillightLeft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16),
            new THREE.MeshToonMaterial({ 
                color: 0xFF0000,
                emissive: 0xFF0000,
                emissiveIntensity: 0.5
            })
        );
        this.taillightLeft.position.set(0.7, 0, -1.9);
        this.taillightLeft.rotation.z = Math.PI / 2;
        this.chassisMesh.add(this.taillightLeft);
        
        this.taillightRight = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16),
            new THREE.MeshToonMaterial({ 
                color: 0xFF0000,
                emissive: 0xFF0000,
                emissiveIntensity: 0.5
            })
        );
        this.taillightRight.position.set(-0.7, 0, -1.9);
        this.taillightRight.rotation.z = Math.PI / 2;
        this.chassisMesh.add(this.taillightRight);

        // Create wheels with simplified cartoonish look
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
        
        // Basic black wheel material
        const wheelMaterial = new THREE.MeshToonMaterial({ 
            color: 0x333333
        });
        
        // Simple white rim material
        const wheelRimMaterial = new THREE.MeshToonMaterial({ 
            color: 0xFFFFFF
        });

        // Create wheel meshes
        this.frontWheelMesh1 = this.createCartoonWheel(wheelGeometry, wheelMaterial, wheelRimMaterial);
        this.frontWheelMesh1.position.set(6, 4.5, 2);
        
        this.frontWheelMesh2 = this.createCartoonWheel(wheelGeometry, wheelMaterial, wheelRimMaterial);
        this.frontWheelMesh2.position.set(4, 4.5, 2);
        
        this.rearWheelMesh1 = this.createCartoonWheel(wheelGeometry, wheelMaterial, wheelRimMaterial);
        this.rearWheelMesh1.position.set(6, 4.5, -2);
        
        this.rearWheelMesh2 = this.createCartoonWheel(wheelGeometry, wheelMaterial, wheelRimMaterial);
        this.rearWheelMesh2.position.set(4, 4.5, -2);
    }
    
    createCartoonWheel(wheelGeometry, wheelMaterial, rimMaterial) {
        // Create the main wheel group
        const wheelGroup = new THREE.Group();
        
        // Create the main tire part
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelGroup.add(wheel);
        
        // Create a simple rim
        const rimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.51, 16);
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        wheelGroup.add(rim);
        
        // Add just 4 spokes for a simpler look
        for (let i = 0; i < 4; i++) {
            const spokeGeometry = new THREE.BoxGeometry(0.1, 0.51, 0.4);
            const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
            spoke.rotation.z = (i / 4) * Math.PI * 2;
            wheelGroup.add(spoke);
        }
        
        // Set the rotation for proper orientation
        wheelGroup.rotation.z = Math.PI / 2;
        
        return wheelGroup;
    }

    updateMeshPosition(mesh, body) {
        // Update position from physics body
        mesh.position.copy(body.position);
        
        // For wheels, we need special handling for rotation
        if (mesh === this.frontWheelMesh1 || 
            mesh === this.frontWheelMesh2 || 
            mesh === this.rearWheelMesh1 || 
            mesh === this.rearWheelMesh2) {
            
            // First preserve the wheel's base orientation (cylinder along X axis)
            mesh.rotation.set(0, 0, Math.PI / 2);
            
            // Create a quaternion from the physics body's orientation
            const bodyQuat = new THREE.Quaternion(
                body.quaternion.x,
                body.quaternion.y,
                body.quaternion.z,
                body.quaternion.w
            );
            
            // Apply the physics rotation to the wheel's base orientation
            mesh.quaternion.premultiply(bodyQuat);
        } else {
            // For non-wheel objects (chassis), just copy the quaternion
            mesh.quaternion.copy(body.quaternion);
        }
    }
    
    // Method to get Nintendo colors array for use in the controller
    getNintendoColors() {
        return this.nintendoColors;
    }
}