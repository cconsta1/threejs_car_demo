import * as THREE from "three"
import { Sky } from 'three/examples/jsm/objects/Sky.js'
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
        this.setSky()

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

        // this.sunLightHelper = new THREE.CameraHelper(this.sunLight.shadow.camera)
        // this.scene.add(this.sunLightHelper)

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

    setSky() {
        this.sky = new Sky()
        this.sky.scale.setScalar(450000 * 0.1000)
        this.scene.add(this.sky)

        this.sun = new THREE.Vector3()

        this.effectController = {
            turbidity: 6.7,
            rayleigh: 0.165,
            mieCoefficient: 0.,
            mieDirectionalG: 0.865,
            elevation: 10.,
            azimuth: 166,
            exposure: this.experience.renderer.instance.toneMappingExposure
        }

        this.updateSky()

        if (this.debug.active) {

            console.log("debug active")

            this.debugFolder
                .add(this.effectController, 'turbidity', 0.0, 20.0, 0.1)
                .name('turbidity')
                .onChange(() => this.updateSky())

            this.debugFolder
                .add(this.effectController, 'rayleigh', 0.0, 4, 0.001)
                .name('rayleigh')
                .onChange(() => this.updateSky())

            this.debugFolder
                .add(this.effectController, 'mieCoefficient', 0.0, 0.1, 0.001)
                .name('mieCoefficient')
                .onChange(() => this.updateSky())

            this.debugFolder
                .add(this.effectController, 'mieDirectionalG', 0.0, 1, 0.001)
                .name('mieDirectionalG')
                .onChange(() => this.updateSky())

            this.debugFolder
                .add(this.effectController, 'elevation', 0, 90, 0.1)
                .name('elevation')
                .onChange(() => this.updateSky())

            this.debugFolder
                .add(this.effectController, 'azimuth', -180, 180, 0.1)
                .name('azimuth')
                .onChange(() => this.updateSky())


            console.log(this.experience.renderer.instance.toneMappingExposure)

            this.debugFolder
                .add(this.effectController, 'exposure', 0, 1, 0.0001)
                .name('exposure')
                .onChange(() => this.updateSky())
        }
    }

    updateSky() {
        const uniforms = this.sky.material.uniforms
        uniforms['turbidity'].value = this.effectController.turbidity
        uniforms['rayleigh'].value = this.effectController.rayleigh
        uniforms['mieCoefficient'].value = this.effectController.mieCoefficient
        uniforms['mieDirectionalG'].value = this.effectController.mieDirectionalG

        const phi = THREE.MathUtils.degToRad(90 - this.effectController.elevation)
        const theta = THREE.MathUtils.degToRad(this.effectController.azimuth)

        this.sun.setFromSphericalCoords(1, phi, theta)

        uniforms['sunPosition'].value.copy(this.sun)

        this.experience.renderer.instance.toneMappingExposure = this.effectController.exposure

        this.experience.renderer.instance.render(this.scene, this.experience.camera.instance)
    }
}