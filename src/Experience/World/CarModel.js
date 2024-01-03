import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'

export default class CarModel {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.resource = this.resources.items.carModel
        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene
        this.chassisMesh = this.model.getObjectByName("Body_blue_0")
        this.engine = this.addPartToChassis("engine_engine001_0")
        this.engine_part1 = this.addPartToChassis("engine_part_engine001_0")
        this.engine_part2 = this.addPartToChassis("engine_part002_engine001_0")
        this.engine_part3 = this.addPartToChassis("engine_part001_engine001_0")

        this.frontWheelMesh1 = this.model.getObjectByName("front_right_wheel_front_wheel_0")
        this.frontWheelMesh2 = this.model.getObjectByName("front_left_wheel_front_wheel_0")
        this.rearWheelMesh1 = this.model.getObjectByName("rear_right_wheel_rear_wheel_0")
        this.rearWheelMesh2 = this.model.getObjectByName("rear_left_wheel_rear_wheel_0")

        /*

        // Debugging: Visualizing World Positions of Car Parts
        // This section is used for debugging purposes. It helps in visualizing the exact world positions
        // of different parts of the car model. For each part, a small red sphere is created and placed
        // at its world position. This visual aid is particularly useful for understanding the spatial
        // arrangement and alignment of the car's components in the 3D space.

        const partsForSpheres = [
            this.chassisMesh,
            this.frontWheelMesh1,
            this.frontWheelMesh2,
            this.rearWheelMesh1,
            this.rearWheelMesh2
        ]

        partsForSpheres.forEach(part => {
            const worldPosition = new THREE.Vector3()
            part.getWorldPosition(worldPosition)
            console.log(`World position of part:`, worldPosition)

            // Add a small red sphere at the world position
            const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
            sphere.position.copy(worldPosition)
            this.experience.scene.add(sphere)
        })

        // Do not add the model to the scene here, or any of the meshes
        // we created above. Doing so will mess up the positioning of the meshes

        */

    }

    addPartToChassis(partName) {
        const part = this.model.getObjectByName(partName)
        let worldPosition = new THREE.Vector3()
        part.getWorldPosition(worldPosition)
        part.position.copy(this.chassisMesh.worldToLocal(worldPosition))
        this.chassisMesh.add(part)
        return part
    }

    createShapeFromMesh(mesh) {
        let boundingBox = new THREE.Box3().setFromObject(mesh)
        let size = new THREE.Vector3()
        boundingBox.getSize(size)
        return new CANNON.Cylinder(size.y * 0.5, size.z * 0.5, size.x, 32)
    }

    updateMeshPosition(mesh, body) {
        mesh.position.copy(body.position)
        mesh.quaternion.copy(body.quaternion)
    }
}