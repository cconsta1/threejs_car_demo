import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import Experience  from './Experience.js'

export default class PhysicsWorld {
    constructor() {
        // this.debug = debug
        // this.scene = scene

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.setWorldPhysics()
    }

    setWorldPhysics() {
        this.instance = new CANNON.World()
        this.instance.gravity.set(0, -9.82, 0)
        this.instance.broadphase = new CANNON.SAPBroadphase(this.instance)
        //this.instance.allowSleep = true
        this.instance.solver.iterations = 10

        // Default material
        const defaultMaterial = new CANNON.Material('default')
        const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
            friction: 0.4,
            restitution: 0.0
        })
        this.instance.addContactMaterial(defaultContactMaterial)
        this.instance.defaultContactMaterial = defaultContactMaterial

        // DEBUGGER ENABLED - Comment out the block below to disable physics visualization
        this.cannonDebugger = new CannonDebugger(this.scene, this.instance, {
            // Optional debugger settings
            color: 0x00ff00, // Default color
            scale: 1,        // Scale of the debug shapes
        })
        
        /* 
        TO DISABLE DEBUGGER: 
        Set this.cannonDebugger = null
        
        TO ENABLE DEBUGGER:
        Uncomment the block above
        */
    }

    update() {
        this.instance.fixedStep()
        
        // DEBUGGER UPDATE - Comment out this line to disable physics visualization
        if (this.cannonDebugger) {
            this.cannonDebugger.update()
        }
    }
}