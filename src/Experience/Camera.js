import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from "./Experience.js"

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        // Add testing mode flag
        this.testingMode = false // Set to true for orbit controls, false for chase camera

        this.setInstance()

        // Enable orbit controls during testing
        if (this.testingMode) {
            this.setOrbitControls()
        }
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            1000
        )

        this.instance.position.set(5, 10, 15) // Better initial position for viewing the car
        this.instance.lookAt(new THREE.Vector3(5, 0, 0)) // Look at approximate car position
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(
            this.instance,
            this.canvas
        )

        this.controls.enableDamping = true
        this.controls.target.set(5, 5, 0) // Target the car's initial position
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        // Only update controls if they exist
        if (this.testingMode && this.controls) {
            this.controls.update()
        }
    }
}