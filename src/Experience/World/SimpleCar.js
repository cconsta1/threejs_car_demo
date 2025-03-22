import * as THREE from 'three'
import Experience from '../Experience.js'
import SimpleCarModel from './SimpleCarModel.js'
import SimpleCarPhysics from './SimpleCarPhysics.js'

let instance = null

export default class SimpleCar {
    constructor() {
        // Singleton
        if (instance) {
            return instance
        }

        instance = this

        this.experience = new Experience()
        this.scene = this.experience.scene

        this.simpleCarModel = new SimpleCarModel()
        this.simpleCarPhysics = new SimpleCarPhysics()

        this.vehicle = this.simpleCarPhysics.vehicle

        this.time = this.experience.time

        this.frontWheelMesh1 = this.simpleCarModel.frontWheelMesh1
        this.frontWheelMesh2 = this.simpleCarModel.frontWheelMesh2
        this.rearWheelMesh1 = this.simpleCarModel.rearWheelMesh1
        this.rearWheelMesh2 = this.simpleCarModel.rearWheelMesh2
        this.chassisMesh = this.simpleCarModel.chassisMesh

        this.initChaseCamera()
    }

    initChaseCamera() {
        this.chaseCamera = new THREE.Object3D()
        this.chaseCameraPivot = new THREE.Object3D()
        this.view = new THREE.Vector3()

        this.chaseCamera.position.set(0, 5, -10) // Adjusted position for better view
        this.chaseCameraPivot.position.set(0, 0, 0)
        this.chaseCamera.add(this.chaseCameraPivot)
        this.scene.add(this.chaseCamera)

        if (this.chassisMesh) {
            this.chassisMesh.add(this.chaseCamera)
        }
    }

    updateChaseCamera() {
        this.chaseCameraPivot.getWorldPosition(this.view)

        if (this.view.y < 1) {
            this.view.y = 1
        }

        this.experience.camera.instance.position.lerp(this.view, 0.3)
        this.experience.camera.instance.lookAt(this.chassisMesh.position)
    }

    update() {
        if (this.chassisMesh) {
            this.simpleCarModel.updateMeshPosition(this.chassisMesh, this.vehicle.chassisBody)
        }

        if (this.frontWheelMesh1) {
            this.simpleCarModel.updateMeshPosition(this.frontWheelMesh1, this.vehicle.wheelBodies[2])
        }

        if (this.frontWheelMesh2) {
            this.simpleCarModel.updateMeshPosition(this.frontWheelMesh2, this.vehicle.wheelBodies[3])
        }

        if (this.rearWheelMesh1) {
            this.simpleCarModel.updateMeshPosition(this.rearWheelMesh1, this.vehicle.wheelBodies[0])
        }

        if (this.rearWheelMesh2) {
            this.simpleCarModel.updateMeshPosition(this.rearWheelMesh2, this.vehicle.wheelBodies[1])
        }

        this.updateChaseCamera()

        // Update the physics
        //this.simpleCarPhysics.update()
    }
}