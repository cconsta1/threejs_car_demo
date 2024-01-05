import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        
        this.worldPhysics = this.experience.worldPhysics.instance
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(64, 64, 32, 32)
    }

    setTextures() {
        this.textures = {}

        this.textures.occlusion = this.resources.items.occlusionTexture
        this.textures.occlusion.repeat.set(2, 2)
        this.textures.occlusion.wrapS = THREE.RepeatWrapping
        this.textures.occlusion.wrapT = THREE.RepeatWrapping

        this.textures.base = this.resources.items.baseTexture
        this.textures.base.repeat.set(2, 2)
        this.textures.base.wrapS = THREE.RepeatWrapping
        this.textures.base.wrapT = THREE.RepeatWrapping

        this.textures.height = this.resources.items.heightTexture
        this.textures.height.repeat.set(2, 2)
        this.textures.height.wrapS = THREE.RepeatWrapping
        this.textures.height.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.normalTexture
        this.textures.normal.repeat.set(2, 2)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping

        this.textures.roughness = this.resources.items.roughnessTexture
        this.textures.roughness.repeat.set(2, 2)
        this.textures.roughness.wrapS = THREE.RepeatWrapping
        this.textures.roughness.wrapT = THREE.RepeatWrapping
    }



    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.base,
            aoMap: this.textures.occlusion,
            aoMapIntensity: 1,
            displacementMap: this.textures.height,
            displacementScale: 0.5,
            normalMap: this.textures.normal,
            roughnessMap: this.textures.roughness,
            roughness: 0.5
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

    setPhysics() {
        this.body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(36, 0.01, 36))
        })

        //console.log('floor')
        // this.body.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
        this.body.position.y += 0.5
        

        this.worldPhysics.addBody(this.body)
    }
}