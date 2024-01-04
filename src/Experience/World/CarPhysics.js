// CarPhysics.js
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Car from './Car.js'
import Experience from '../Experience.js'


export default class CarPhysics {
    constructor() {
        this.car = new Car() // Get the singleton instance of Car
        this.experience = new Experience() // Get the singleton instance of Experience

        this.scene = this.experience.scene

        this.setPhysics()
    }

    setPhysics() {
        // Constants and materials
        const wheelMaterial = new CANNON.Material('wheel')
        const down = new CANNON.Vec3(0, -1, 0)
        const mass = 1
        const quaternion = new CANNON.Quaternion().setFromEuler(0, 0, -Math.PI / 2)

        // Chassis setup from bounding box of chassis mesh
        const boundingBox = new THREE.Box3().setFromObject(this.car.carModel.chassisMesh)
        const size = new THREE.Vector3()
        boundingBox.getSize(size)

        const chassisWorldPosition = this.car.carModel.chassisMesh.getWorldPosition(new THREE.Vector3())
        const cannonChassisWorldPosition = this.toCannonVec3(chassisWorldPosition)
        const carBody = new CANNON.Body({
            mass: 6,
            shape: new CANNON.Box(new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)),
            position: cannonChassisWorldPosition
        })

        carBody.position.y += 5
        this.vehicle = new CANNON.RigidVehicle({ chassisBody: carBody })

        // Wheel setup from bounding box of wheel meshes
        const wheelMeshes = [
            this.car.carModel.rearWheelMesh1,
            this.car.carModel.rearWheelMesh2,
            this.car.carModel.frontWheelMesh1,
            this.car.carModel.frontWheelMesh2
        ]

        const wheelShapes = wheelMeshes.map(mesh => this.car.carModel.createShapeFromMesh(mesh))

        wheelMeshes.forEach((wheelMesh, index) => {
            const worldPosition = wheelMesh.getWorldPosition(new THREE.Vector3())
            const cannonWorldPosition = this.toCannonVec3(worldPosition)
            const relativePosition = cannonWorldPosition.vsub(cannonChassisWorldPosition)
            const wheelBody = new CANNON.Body({ mass, material: wheelMaterial })
            wheelBody.addShape(wheelShapes[index], new CANNON.Vec3(), quaternion)
            const axis = (index % 2 === 0) ? new CANNON.Vec3(-1, 0, 0) : new CANNON.Vec3(1, 0, 0)
            this.vehicle.addWheel({
                body: wheelBody,
                position: relativePosition,
                axis: axis,
                direction: down
            })
            wheelBody.angularDamping = .4
        })

        /*
         * Add to world and scene.
         * 
         * Note: Follow these steps to ensure proper setup and simulation:
         * 1. Do not add the meshes to the scenes before setting up the physics car.
         * 2. Extract the meshes from the model first.
         * 3. Set up the physics car.
         * 4. Add the meshes to the scene. This is necessary for the Cannon simulation to work.
         * 5. Ensure that the meshes are updated in the update() function.
         */

        this.vehicle.addToWorld(this.experience.worldPhysics.instance)
        this.scene.add(this.car.carModel.chassisMesh)
        this.scene.add(this.car.carModel.frontWheelMesh1)
        this.scene.add(this.car.carModel.frontWheelMesh2)
        this.scene.add(this.car.carModel.rearWheelMesh1)
        this.scene.add(this.car.carModel.rearWheelMesh2)
    }

    toCannonVec3(threeVec3) {
        return new CANNON.Vec3(threeVec3.x, threeVec3.y, threeVec3.z)
    }
}