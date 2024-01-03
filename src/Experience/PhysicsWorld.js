import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

export default class PhysicsWorld {
    constructor(debug, scene) {
        this.setWorldPhysics(debug, scene)
    }

    setWorldPhysics(debug, scene) {
        this.instance = new CANNON.World()
        this.instance.gravity.set(0, -9.82, 0)
        this.instance.broadphase = new CANNON.SAPBroadphase(this.instance)
        this.instance.allowSleep = true
        this.instance.solver.iterations = 10

        // Default material
        const defaultMaterial = new CANNON.Material('default')
        const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
            friction: 0.4,
            restitution: 0.0
        })
        this.instance.addContactMaterial(defaultContactMaterial)
        this.instance.defaultContactMaterial = defaultContactMaterial

        if (debug.active) {
            this.cannonDebugger = new CannonDebugger(scene, this.instance)
        }
    }

    update() {
        this.instance.fixedStep()
        if (this.cannonDebugger) {
            this.cannonDebugger.update()
        }
    }
}