import * as THREE from "three"
import Experience from "../Experience.js"

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('environment')
        }

        this.setSunLight()
    }

    setSunLight() {

        this.sunLight = new THREE.DirectionalLight(0xffffff, 3)
        this.sunLight.castShadow = true
        // this.sunLight.shadow.mapSize.set(1024, 1024)
        // this.sunLight.shadow.camera.far = 15
        // this.sunLight.shadow.camera.left = -7
        // this.sunLight.shadow.camera.top = 7
        // this.sunLight.shadow.camera.right = 7
        // this.sunLight.shadow.camera.bottom = -7

        // this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(5, 10, 8)
        this.scene.add(this.sunLight)

        this.sunLightHelper = new THREE.CameraHelper(this.sunLight.shadow.camera)
        this.scene.add(this.sunLightHelper)

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }
}