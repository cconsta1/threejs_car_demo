import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'
import CarModel from './CarModel.js'
import CarController from './CarController.js'
import CarPhysics from './CarPhysics.js'

let instance = null

export default class Car {
    constructor() {
        // Singleton

        if (instance) {
            return instance
        }

        instance = this

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        //console.log(this.camera)
        this.carModel = new CarModel()
        this.carControllers = new CarController()
        this.carPhysics = new CarPhysics()

        this.vehicle = this.carPhysics.vehicle

        this.time = this.experience.time
        this.debug = this.experience.debug

        this.frontWheelMesh1 = this.carModel.frontWheelMesh1
        this.frontWheelMesh2 = this.carModel.frontWheelMesh2
        this.rearWheelMesh1 = this.carModel.rearWheelMesh1
        this.rearWheelMesh2 = this.carModel.rearWheelMesh2
        this.chassisMesh = this.carModel.chassisMesh

        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('car')
        }

        this.initChaseCamera()
    }

    initChaseCamera() {
        this.chaseCamera = new THREE.Object3D()
        this.chaseCameraPivot = new THREE.Object3D()
        this.view = new THREE.Vector3()

        this.chaseCamera.position.set(0, 0, 0)
        this.chaseCameraPivot.position.set(0, -10, 1)
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
}