import * as THREE from 'three'
import Experience from '../Experience.js'

export default class SimpleCarModel {
    constructor() {
        this.experience = new Experience()

        this.setModel()
    }

    setModel() {
        // Create chassis
        this.chassisMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 1, 4),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        )
        this.chassisMesh.position.set(5, 5, 0)

        // Create wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32)
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })

        this.frontWheelMesh1 = new THREE.Mesh(wheelGeometry, wheelMaterial)
        this.frontWheelMesh1.position.set(6, 4.5, 2)
        //this.frontWheelMesh1.rotation.z = Math.PI / 2

        this.frontWheelMesh2 = new THREE.Mesh(wheelGeometry, wheelMaterial)
        this.frontWheelMesh2.position.set(4, 4.5, 2)
        //this.frontWheelMesh2.rotation.z = Math.PI / 2

        this.rearWheelMesh1 = new THREE.Mesh(wheelGeometry, wheelMaterial)
        this.rearWheelMesh1.position.set(6, 4.5, -2)
        //this.rearWheelMesh1.rotation.z = Math.PI / 2

        this.rearWheelMesh2 = new THREE.Mesh(wheelGeometry, wheelMaterial)
        this.rearWheelMesh2.position.set(4, 4.5, -2)
        //this.rearWheelMesh2.rotation.z = Math.PI / 2
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
            
            // Log the transformation for debugging
            // console.log(`Wheel transformed quaternion:`, mesh.quaternion);
        } else {
            // For non-wheel objects (chassis), just copy the quaternion
            mesh.quaternion.copy(body.quaternion);
        }
    }
}