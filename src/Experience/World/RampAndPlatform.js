import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'

export default class RampAndPlatform {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.worldPhysics = this.experience.worldPhysics.instance
        
        // Nintendo-style colors
        this.colors = {
            rampColor: 0xDD7700,         // Orange ramp
            platformColor: 0x10DB73,      // Nintendo-green platform
            borderColor: 0x2244CC,        // Blue border
            poleColor: 0xFF2222           // Red poles
        }

        this.createRamp()
        this.createPlatform()
        this.createDecorations()
    }

    createRamp() {
        // Create a jump ramp
        // Physics shape
        const rampShape = new CANNON.Box(new CANNON.Vec3(5, 1, 10))
        this.rampBody = new CANNON.Body({
            mass: 0, // Static body
            position: new CANNON.Vec3(0, 1, -30),
            shape: rampShape
        })
        
        // Rotate the ramp - one end higher than the other
        const angle = Math.PI * 0.12 // Around 20 degrees
        this.rampBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), angle)
        
        // Add to physics world
        this.worldPhysics.addBody(this.rampBody)
        
        // Create visual mesh
        const rampGeometry = new THREE.BoxGeometry(10, 2, 20)
        const rampMaterial = new THREE.MeshToonMaterial({ color: this.colors.rampColor })
        this.rampMesh = new THREE.Mesh(rampGeometry, rampMaterial)
        
        // Match position and rotation of physics body
        this.rampMesh.position.copy(this.rampBody.position)
        this.rampMesh.quaternion.copy(this.rampBody.quaternion)
        
        this.rampMesh.castShadow = true
        this.rampMesh.receiveShadow = true
        
        this.scene.add(this.rampMesh)
        
        // Add decorative stripes to the ramp
        this.addRampStripes()
    }
    
    addRampStripes() {
        // Add directional stripes to the ramp
        const stripeGeometry = new THREE.PlaneGeometry(1.5, 18)
        const stripeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        })
        
        // Create three stripes
        for (let i = -1; i <= 1; i++) {
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
            
            // Position on ramp surface with slight offset
            stripe.position.set(i * 3, 1.02, 0)
            
            // Match ramp rotation
            stripe.rotation.x = Math.PI * 0.5
            
            // Parent to ramp for automatic positioning
            this.rampMesh.add(stripe)
        }
    }

    createPlatform() {
        // Create an elevated platform to land on
        const platformHeight = 10
        const platformSize = 25
        
        // Physics body
        const platformShape = new CANNON.Box(new CANNON.Vec3(platformSize/2, 0.5, platformSize/2))
        this.platformBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, platformHeight, -65),
            shape: platformShape
        })
        
        this.worldPhysics.addBody(this.platformBody)
        
        // Visual mesh - slightly larger on X and Z for the visual border
        const platformGeometry = new THREE.BoxGeometry(platformSize, 1, platformSize)
        const platformMaterial = new THREE.MeshToonMaterial({ color: this.colors.platformColor })
        this.platformMesh = new THREE.Mesh(platformGeometry, platformMaterial)
        
        this.platformMesh.position.copy(this.platformBody.position)
        this.platformMesh.castShadow = true
        this.platformMesh.receiveShadow = true
        
        this.scene.add(this.platformMesh)
        
        // Add a border around the platform
        this.addPlatformBorder(platformSize, platformHeight)
        
        // Add support columns
        this.addSupportColumns(platformSize, platformHeight)
    }
    
    addPlatformBorder(platformSize, platformHeight) {
        // Create a decorative border
        const borderHeight = 0.8
        const borderThickness = 1
        
        // Create the border segments (four sides)
        const positions = [
            // [x, z, rotationY]
            [0, platformSize/2, 0],  // Front
            [0, -platformSize/2, 0], // Back
            [platformSize/2, 0, Math.PI/2], // Right
            [-platformSize/2, 0, Math.PI/2] // Left
        ]
        
        positions.forEach(([x, z, rotY]) => {
            const borderGeometry = new THREE.BoxGeometry(platformSize, borderHeight, borderThickness)
            const borderMaterial = new THREE.MeshToonMaterial({ color: this.colors.borderColor })
            const border = new THREE.Mesh(borderGeometry, borderMaterial)
            
            border.position.set(
                x + this.platformBody.position.x,
                platformHeight + 0.5 + borderHeight/2,
                z + this.platformBody.position.z
            )
            
            border.rotation.y = rotY
            border.castShadow = true
            
            this.scene.add(border)
        })
    }
    
    addSupportColumns(platformSize, platformHeight) {
        // Add support columns
        const columnRadius = 1.5
        const columnGeometry = new THREE.CylinderGeometry(columnRadius, columnRadius, platformHeight, 8)
        const columnMaterial = new THREE.MeshToonMaterial({ color: this.colors.poleColor })
        
        // Column positions (four corners)
        const positions = [
            [-platformSize/2 + 3, -platformSize/2 + 3],
            [-platformSize/2 + 3, platformSize/2 - 3],
            [platformSize/2 - 3, -platformSize/2 + 3],
            [platformSize/2 - 3, platformSize/2 - 3]
        ]
        
        positions.forEach(([x, z]) => {
            const column = new THREE.Mesh(columnGeometry, columnMaterial)
            
            column.position.set(
                x + this.platformBody.position.x,
                platformHeight/2,
                z + this.platformBody.position.z
            )
            
            column.castShadow = true
            
            this.scene.add(column)
            
            // Add physics for column
            const columnShape = new CANNON.Cylinder(columnRadius, columnRadius, platformHeight, 8)
            const columnBody = new CANNON.Body({
                mass: 0,
                position: new CANNON.Vec3(
                    x + this.platformBody.position.x,
                    platformHeight/2,
                    z + this.platformBody.position.z
                ),
                shape: columnShape
            })
            
            this.worldPhysics.addBody(columnBody)
        })
    }
    
    createDecorations() {
        // Add some Nintendo-style decorations to the platform
        this.addCheckeredPattern()
        this.addJumpArrow()
    }
    
    addCheckeredPattern() {
        // Add a checkered pattern to platform top for visual interest
        const gridSize = 5
        const squareSize = 5
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                // Skip some squares for checkerboard pattern
                if ((i + j) % 2 === 0) continue
                
                const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize)
                const squareMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: 0.4
                })
                
                const square = new THREE.Mesh(squareGeometry, squareMaterial)
                
                // Position on platform surface
                square.position.set(
                    (i - gridSize/2 + 0.5) * squareSize + this.platformBody.position.x,
                    this.platformBody.position.y + 0.51,
                    (j - gridSize/2 + 0.5) * squareSize + this.platformBody.position.z
                )
                
                square.rotation.x = -Math.PI/2
                
                this.scene.add(square)
            }
        }
    }
    
    addJumpArrow() {
        // Add an arrow pointing to the ramp
        const arrowShape = new THREE.Shape()
        
        // Create arrow shape
        arrowShape.moveTo(0, 0)
        arrowShape.lineTo(5, 0)
        arrowShape.lineTo(5, 10)
        arrowShape.lineTo(10, 10)
        arrowShape.lineTo(0, 20)
        arrowShape.lineTo(-10, 10)
        arrowShape.lineTo(-5, 10)
        arrowShape.lineTo(-5, 0)
        
        const extrudeSettings = {
            steps: 1,
            depth: 0.2,
            bevelEnabled: false
        }
        
        const arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings)
        const arrowMaterial = new THREE.MeshToonMaterial({ color: 0xFFDD00 })
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial)
        
        // Position in front of the ramp
        arrow.position.set(0, 0.1, -15)
        arrow.rotation.x = -Math.PI/2
        arrow.rotation.z = Math.PI
        arrow.scale.set(0.4, 0.4, 0.4)
        
        this.scene.add(arrow)
    }
}