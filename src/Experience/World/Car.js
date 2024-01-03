import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'
import CarModel from './CarModel.js'


export default class Car {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        console.log(this.camera)
        this.carModel = new CarModel()

        this.time = this.experience.time
        this.debug = this.experience.debug

        this.frontWheelMesh1 = this.carModel.frontWheelMesh1
        this.frontWheelMesh2 = this.carModel.frontWheelMesh2
        this.rearWheelMesh1 = this.carModel.rearWheelMesh1
        this.rearWheelMesh2 = this.carModel.rearWheelMesh2
        this.chassisMesh = this.carModel.chassisMesh

        this.maxSteerVal = Math.PI / 8
        this.maxForce = 5

        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('car')
        }

        this.setPhysics()
        this.setSteering()
        this.initChaseCamera()
    }

    setPhysics() {
        // Constants and materials
        const wheelMaterial = new CANNON.Material('wheel')
        const down = new CANNON.Vec3(0, -1, 0)
        const mass = 1
        const quaternion = new CANNON.Quaternion().setFromEuler(0, 0, -Math.PI / 2)

        // Chassis setup from bounding box of chassis mesh
        const boundingBox = new THREE.Box3().setFromObject(this.chassisMesh)
        const size = new THREE.Vector3()
        boundingBox.getSize(size)

        const chassisWorldPosition = this.chassisMesh.getWorldPosition(new THREE.Vector3())
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
            this.rearWheelMesh1,
            this.rearWheelMesh2,
            this.frontWheelMesh1,
            this.frontWheelMesh2
        ]

        const wheelShapes = wheelMeshes.map(mesh => this.carModel.createShapeFromMesh(mesh))

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
        this.scene.add(this.chassisMesh)
        this.scene.add(this.frontWheelMesh1)
        this.scene.add(this.frontWheelMesh2)
        this.scene.add(this.rearWheelMesh1)
        this.scene.add(this.rearWheelMesh2)
    }

    toCannonVec3(threeVec3) {
        return new CANNON.Vec3(threeVec3.x, threeVec3.y, threeVec3.z)
    }

    initChaseCamera() {
        this.chaseCamera = new THREE.Object3D()
        this.chaseCameraPivot = new THREE.Object3D()
        this.view = new THREE.Vector3()

        this.chaseCamera.position.set(0, 0, 0)
        this.chaseCameraPivot.position.set(0, -6, 2)
        this.chaseCamera.add(this.chaseCameraPivot)
        this.scene.add(this.chaseCamera)

        if (this.chassisMesh) {
            this.chassisMesh.add(this.chaseCamera)
            //this.camera.co
        }
    }

   
    updateChaseCamera() {
        this.chaseCameraPivot.getWorldPosition(this.view)
    
        if (this.view.y < 1) {
            this.view.y = 1
        }
    
        this.camera.position.lerp(this.view, 0.3)
        this.camera.lookAt(this.chassisMesh.position)

    }

    update() {
        /*
         * Note: The rotation of the chassisMesh is necessary. 
         * For some reason, the mesh comes pre-rotated by 90 degrees on the x-axis.
         */

        if (this.chassisMesh) {
            this.carModel.updateMeshPosition(this.chassisMesh, this.vehicle.chassisBody)
            this.chassisMesh.rotateX(-Math.PI / 2)
        }

        if (this.frontWheelMesh1) {
            this.carModel.updateMeshPosition(this.frontWheelMesh1, this.vehicle.wheelBodies[2])
        }

        if (this.frontWheelMesh2) {
            this.carModel.updateMeshPosition(this.frontWheelMesh2, this.vehicle.wheelBodies[3])
        }

        if (this.rearWheelMesh1) {
            this.carModel.updateMeshPosition(this.rearWheelMesh1, this.vehicle.wheelBodies[0])
        }

        if (this.rearWheelMesh2) {
            this.carModel.updateMeshPosition(this.rearWheelMesh2, this.vehicle.wheelBodies[1])
        }

        this.updateChaseCamera()


    }

    setSteering() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                case "ArrowUp":
                    this.vehicle.setWheelForce(this.maxForce, 0)
                    this.vehicle.setWheelForce(-this.maxForce, 1)
                    break

                case 's':
                case 'ArrowDown':
                    this.vehicle.setWheelForce(-this.maxForce * 0.5, 0)
                    this.vehicle.setWheelForce(this.maxForce * 0.5, 1)
                    break

                case 'a':
                case 'ArrowLeft':
                    this.vehicle.setSteeringValue(this.maxSteerVal, 2)
                    this.vehicle.setSteeringValue(this.maxSteerVal, 3)
                    break

                case 'd':
                case 'ArrowRight':
                    this.vehicle.setSteeringValue(-this.maxSteerVal, 2)
                    this.vehicle.setSteeringValue(-this.maxSteerVal, 3)
                    break
            }
        })

        // Reset force on keyup
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.vehicle.setWheelForce(0, 0)
                    this.vehicle.setWheelForce(0, 1)
                    break

                case 's':
                case 'ArrowDown':
                    this.vehicle.setWheelForce(0, 0)
                    this.vehicle.setWheelForce(0, 1)
                    break

                case 'a':
                case 'ArrowLeft':
                    this.vehicle.setSteeringValue(0, 2)
                    this.vehicle.setSteeringValue(0, 3)
                    break

                case 'd':
                case 'ArrowRight':
                    this.vehicle.setSteeringValue(0, 2)
                    this.vehicle.setSteeringValue(0, 3)
                    break
            }
        })
    }


}