import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'
import SimpleCar from './SimpleCar.js'
import * as THREE from 'three'

export default class SimpleCarPhysics {
    constructor() {
        this.simpleCar = new SimpleCar() // Get the singleton instance of SimpleCar
        this.experience = new Experience() // Get the singleton instance of Experience

        this.scene = this.experience.scene

        this.setPhysics()
    }

    setPhysics() {
        const wheelMaterial = new CANNON.Material('wheel')
        const down = new CANNON.Vec3(0, -1, 0)
        const mass = 1
        const quaternion = new CANNON.Quaternion().setFromEuler(0, 0, -Math.PI / 2)

        // Chassis setup
        const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2))
        const chassisBody = new CANNON.Body({ mass: 6, shape: chassisShape })
        chassisBody.position.set(5, 5, 0) // Adjusted position to be above the floor and away from the origin
        this.vehicle = new CANNON.RigidVehicle({ chassisBody })

        // Wheel setup
        const wheelMeshes = [
            this.simpleCar.simpleCarModel.rearWheelMesh1,
            this.simpleCar.simpleCarModel.rearWheelMesh2,
            this.simpleCar.simpleCarModel.frontWheelMesh1,
            this.simpleCar.simpleCarModel.frontWheelMesh2
        ]

        wheelMeshes.forEach((wheelMesh, index) => {
            const wheelShape = new CANNON.Cylinder(0.5, 0.5, 0.5, 32)
            const wheelBody = new CANNON.Body({ mass, material: wheelMaterial })
            wheelBody.addShape(wheelShape, new CANNON.Vec3(), quaternion)
            const axis = (index % 2 === 0) ? new CANNON.Vec3(-1, 0, 0) : new CANNON.Vec3(1, 0, 0)
            const position = new CANNON.Vec3(
                wheelMesh.position.x - chassisBody.position.x,
                wheelMesh.position.y - chassisBody.position.y,
                wheelMesh.position.z - chassisBody.position.z
            )
            this.vehicle.addWheel({
                body: wheelBody,
                position,
                axis,
                direction: down
            })
            wheelBody.angularDamping = 0.4
        })

        this.vehicle.addToWorld(this.experience.worldPhysics.instance)

        // Add visual markers for the front wheel physics body
        const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.frontWheelMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.scene.add(this.frontWheelMarker);

        // Add meshes to the scene
        this.scene.add(this.simpleCar.simpleCarModel.chassisMesh)
        this.scene.add(this.simpleCar.simpleCarModel.frontWheelMesh1)
        this.scene.add(this.simpleCar.simpleCarModel.frontWheelMesh2)
        this.scene.add(this.simpleCar.simpleCarModel.rearWheelMesh1)
        this.scene.add(this.simpleCar.simpleCarModel.rearWheelMesh2)
    }

    update() {
        // No need for debugger update here, it's in PhysicsWorld class
    }
}