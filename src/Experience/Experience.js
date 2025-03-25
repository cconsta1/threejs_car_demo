import * as THREE from 'three'
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from './Renderer.js'
import World from './World/World.js'
import Debug from './Utils/Debug.js'
import PhysicsWorld from './PhysicsWorld.js'

let instance = null

export default class Experience {
    constructor(canvas) {
        // Singleton
        if (instance) {
            return instance
        }

        instance = this

        // Options
        this.canvas = canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.worldPhysics = new PhysicsWorld()
        this.camera = new Camera()
        this.renderer = new Renderer()

        // Handle loading screen manually
        const loadingScreen = document.getElementById('loading-screen')
        setTimeout(() => {
            loadingScreen.classList.add('fade-out')
            loadingScreen.addEventListener('transitionend', (event) => {
                event.target.remove()
            })
        }, 500)

        this.world = new World()

        // Access simpleCar directly from world
        if (this.world.simpleCar) {
            this.simpleCar = this.world.simpleCar
        }

        // Sizes resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    // Only modify the update method

    update() {
        this.camera.update() // Add this line to update the orbit controls
        this.renderer.update()
        this.worldPhysics.update()

        if (this.simpleCar) {
            this.simpleCar.update()
        }
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active) {
            this.debug.gui.destroy()
        }
    }
}