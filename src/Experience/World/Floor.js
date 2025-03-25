import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.worldPhysics = this.experience.worldPhysics.instance
        
        // Simplified Nintendo racing colors
        this.nintendoColors = {
            roadColor: 0x2C2C2C,        // Darker gray road for a more Nintendo-like appearance
            roadStripeColor: 0xF8F8F8,  // Nintendo-like white stripes
            cylinderColor: 0xFF0000,    // Classic Nintendo red
            cylinderTopColor: 0xF8F8F8  // Nintendo-like white
        }

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()
        //this.addRoadMarkings()
        this.createBoundaryMarkers()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(100, 100)
    }

    setMaterial() {
        // Create a dark gray cartoonish road surface
        this.material = new THREE.MeshToonMaterial({
            color: this.nintendoColors.roadColor
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

    addRoadMarkings() {
        // Add simple white dashed lines to the road
        const lineWidth = 2
        const lineLength = 5
        const numLines = 12
        
        const lineMaterial = new THREE.MeshBasicMaterial({
            color: this.nintendoColors.roadStripeColor
        })
        
        for (let i = 0; i < numLines; i++) {
            const lineGeometry = new THREE.PlaneGeometry(lineWidth, lineLength)
            const line = new THREE.Mesh(lineGeometry, lineMaterial)
            
            // Position in a circle around the center
            const angle = (i / numLines) * Math.PI * 2
            const radius = 25 // Middle of the road
            
            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius
            
            line.position.set(x, 0.02, z) // Slightly above road
            line.rotation.set(-Math.PI / 2, 0, angle + Math.PI/2)
            
            this.scene.add(line)
        }
        
        // Add a center line circle
        const centerLineGeometry = new THREE.RingGeometry(15, 16, 32)
        const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial)
        centerLine.rotation.x = -Math.PI / 2
        centerLine.position.y = 0.02 // Slightly above road
        this.scene.add(centerLine)
    }

    createBoundaryMarkers() {
        // Create red cylinders with white tops as boundary markers
        const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.3, 8)
        const cylinderTopGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8)
        
        const cylinderMaterial = new THREE.MeshToonMaterial({ 
            color: this.nintendoColors.cylinderColor
        })
        
        const cylinderTopMaterial = new THREE.MeshToonMaterial({
            color: this.nintendoColors.cylinderTopColor
        })
        
        // Place cylinders around in a pattern
        const radius = 40
        const numCylinders = 16
        
        for (let i = 0; i < numCylinders; i++) {
            const angle = (i / numCylinders) * Math.PI * 2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            
            // Create cylinder group
            const cylinderGroup = new THREE.Group()
            cylinderGroup.position.set(x, 0.75, z)
            
            // Main red part
            const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
            cylinder.position.y = -0.1 // Offset to place top correctly
            cylinderGroup.add(cylinder)
            
            // White top
            const cylinderTop = new THREE.Mesh(cylinderTopGeometry, cylinderTopMaterial)
            cylinderTop.position.y = 0.65 // Position on top of the red part
            cylinderGroup.add(cylinderTop)
            
            cylinderGroup.castShadow = true
            this.scene.add(cylinderGroup)
            
            // Add physics for the cylinder with bounce properties
            const cylinderBody = new CANNON.Body({
                mass: 0, // Static body
                shape: new CANNON.Cylinder(0.5, 0.5, 1.5, 8), // Matching cylinder dimensions
                position: new CANNON.Vec3(x, 0.75, z)
            });
            
            // Add bouncy material for bumpers
            const bumperMaterial = new CANNON.Material('bumperMaterial')
            bumperMaterial.friction = 0.2
            bumperMaterial.restitution = 0.7 // Higher bounce for more cartoon feel
            cylinderBody.material = bumperMaterial
            
            this.worldPhysics.addBody(cylinderBody);
            
            // Set up contact material between car and bumpers
            const carBumperContactMaterial = new CANNON.ContactMaterial(
                bumperMaterial,
                this.worldPhysics.defaultMaterial,
                { friction: 0.1, restitution: 0.7 }
            )
            this.worldPhysics.addContactMaterial(carBumperContactMaterial)
        }
    }

    setPhysics() {
        // Create a physics body for the floor
        this.body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(50, 0.01, 50))
        })
        
        this.body.position.y = 0
        
        const material = new CANNON.Material('floorMaterial')
        material.friction = 0.3
        material.restitution = 0.1
        this.body.material = material
        
        this.worldPhysics.addBody(this.body)
    }
}