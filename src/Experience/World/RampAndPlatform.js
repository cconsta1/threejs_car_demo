import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'

export default class RampAndPlatform {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.worldPhysics = this.experience.worldPhysics.instance

        this.colors = {
            rampColor: 0x2C2C2C,
            platformColor: 0x2C2C2C
        }

        this.createRamp()
        this.createPlatform()
        this.createDecorations()
        //this.createRampApproach() // Add approach obstacle
    }

    createRamp() {
        // Create a jump ramp - raised above ground and steeper
        const rampShape = new CANNON.Box(new CANNON.Vec3(5, 1, 10))
        this.rampBody = new CANNON.Body({
            mass: 0, // Static body
            position: new CANNON.Vec3(0, 2, -30), // Raised to y=2 so it's visible above ground
            shape: rampShape
        })

        // Make the ramp steeper for more challenge
        const angle = Math.PI * 0.18 // Increased from 0.12 to 0.18 (approx 32 degrees)
        this.rampBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), angle)

        this.worldPhysics.addBody(this.rampBody)

        // Create visual mesh
        const rampGeometry = new THREE.BoxGeometry(10, 2, 20)
        const rampMaterial = new THREE.MeshToonMaterial({ color: this.colors.rampColor })
        this.rampMesh = new THREE.Mesh(rampGeometry, rampMaterial)

        this.rampMesh.position.copy(this.rampBody.position)
        this.rampMesh.quaternion.copy(this.rampBody.quaternion)

        this.rampMesh.castShadow = true
        this.rampMesh.receiveShadow = true

        this.scene.add(this.rampMesh)

        this.addRampStripes()
    }

    // Add a challenging approach to the ramp
    createRampApproach() {
        // Create a small hill before the ramp
        const hillShape = new CANNON.Box(new CANNON.Vec3(5, 0.5, 4))
        const hillBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, 0.5, -15), // Positioned in front of the ramp
            shape: hillShape
        })

        // Slight incline
        hillBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0.05)
        this.worldPhysics.addBody(hillBody)

        // Visual mesh
        const hillGeometry = new THREE.BoxGeometry(10, 1, 8)
        const hillMaterial = new THREE.MeshToonMaterial({ color: 0x3C3C3C })
        const hillMesh = new THREE.Mesh(hillGeometry, hillMaterial)

        hillMesh.position.copy(hillBody.position)
        hillMesh.quaternion.copy(hillBody.quaternion)
        hillMesh.castShadow = true
        hillMesh.receiveShadow = true

        this.scene.add(hillMesh)

        // Add small bumps to make it challenging
        this.addBumps()
    }

    addBumps() {
        // Add a few small bumps on the approach to the ramp
        const bumpPositions = [
            new CANNON.Vec3(-2, 0.2, -20),
            new CANNON.Vec3(2, 0.2, -22),
            new CANNON.Vec3(0, 0.2, -18)
        ]

        bumpPositions.forEach(position => {
            // Physics body
            const bumpShape = new CANNON.Sphere(0.4)
            const bumpBody = new CANNON.Body({
                mass: 0,
                position: position,
                shape: bumpShape
            })

            this.worldPhysics.addBody(bumpBody)

            // Visual mesh
            const bumpGeometry = new THREE.SphereGeometry(0.4, 16, 16)
            const bumpMaterial = new THREE.MeshToonMaterial({ color: 0x3C3C3C })
            const bumpMesh = new THREE.Mesh(bumpGeometry, bumpMaterial)

            bumpMesh.position.copy(bumpBody.position)
            bumpMesh.castShadow = true

            this.scene.add(bumpMesh)
        })
    }

    createPlatform() {
        // Create an elevated platform to land on
        const platformHeight = 10
        const platformSize = 40 // Increased size

        // Physics body
        const platformShape = new CANNON.Box(new CANNON.Vec3(platformSize / 2, 0.5, platformSize / 2))
        this.platformBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, platformHeight, -65),
            shape: platformShape
        })

        this.worldPhysics.addBody(this.platformBody)

        // Visual mesh - larger platform
        const platformGeometry = new THREE.BoxGeometry(platformSize, 1, platformSize)
        const platformMaterial = new THREE.MeshToonMaterial({ color: this.colors.platformColor })
        this.platformMesh = new THREE.Mesh(platformGeometry, platformMaterial)

        this.platformMesh.position.copy(this.platformBody.position)
        this.platformMesh.castShadow = true
        this.platformMesh.receiveShadow = true

        this.scene.add(this.platformMesh)
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

    createDecorations() {
        this.addCheckeredPattern()
        this.addJumpArrow()
    }

    addCheckeredPattern() {
        // Updated for larger platform
        const gridSize = 8
        const squareSize = 5

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if ((i + j) % 2 === 0) continue

                const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize)
                const squareMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: 0.4
                })

                const square = new THREE.Mesh(squareGeometry, squareMaterial)

                square.position.set(
                    (i - gridSize / 2 + 0.5) * squareSize + this.platformBody.position.x,
                    this.platformBody.position.y + 0.51,
                    (j - gridSize / 2 + 0.5) * squareSize + this.platformBody.position.z
                )

                square.rotation.x = -Math.PI / 2

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
        arrow.rotation.x = -Math.PI / 2
        arrow.rotation.z = Math.PI
        arrow.scale.set(0.4, 0.4, 0.4)

        this.scene.add(arrow)
    }
}