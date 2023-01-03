import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

// console.log(threeToCannon)

// Chase camera is not implemented yet

let chaseCamera, chaseCameraPivot
let view = new THREE.Vector3()



const reset = document.getElementById("reset")
reset.addEventListener('click', function(){
    resetSpeeder()
})



/**
 * Base
 */

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Physics
 */

// World

const world = new CANNON.World()
//world.broadphase = new CANNON.SAPBroadphase(world)
world.gravity.set(0, -9.82, 0)

// Cannon ground

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    //shape: new CANNON.Plane()
    shape: new CANNON.Box(new CANNON.Vec3(36, 0.01, 36))
})

//groundBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
groundBody.position.y += 0.05

world.addBody(groundBody)

// Default material

const defaultMaterial = new CANNON.Material('ground')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    {
        friction: 0.4,
        restitution: 0.0
    }
)
world.defaultContactMaterial = defaultContactMaterial

// Cannon debugger

const cannonDebugger = new CannonDebugger(scene, world)


let debugObject = {
    boxX: 1.38 / 2,
    boxY: 1.35 / 2,
    boxZ: 3.38 / 2,
    chassisPositionX: 0.,
    chassisPositionY: -0.9,
    chassisPositionZ: -0.76,
    wheel1X: 0.75
}

// let shapeDebug = {
//     shape: new CANNON.Box(new CANNON.Vec3(1.38/2, 1.35/2, 3.38/2)),
//     position1: new CANNON.Vec3(0.7548, 1.35/2 - 0.4346,1.8577)
// }

// gui.add(debugObject, "boxX", 0.5, 4, 0.1).name("boxX").onChange(
//     () => {
//         shapeDebug.shape.halfExtents.x = debugObject.boxX
//     }
// )

// gui.add(debugObject, "boxY", 0.5, 4, 0.1).name("boxY").onChange(
//     () => {
//         shapeDebug.shape.halfExtents.y = debugObject.boxY
//     }
// )

// gui.add(debugObject, "boxZ", 0.5, 4, 0.1).name("boxZ").onChange(
//     () => {
//         shapeDebug.shape.halfExtents.z = debugObject.boxZ
//     }
// )

// gui.add(debugObject, "chassisPositionX", -20, 20, 0.001).name("chassisPositionX")
// gui.add(debugObject, "chassisPositionY", -20, 20, 0.001).name("chassisPositionY")
// gui.add(debugObject, "chassisPositionZ", -20, 20, 0.001).name("chassisPositionZ")

// gui.add(debugObject, "wheel1X", 0.5, 4, 0.1).name("position1X").onChange(
//     () => {
//         vehicle.wheelBodies[0].initPosition.x = debugObject.wheel1X
//     }
// )

// Cannon Car

const carBody = new CANNON.Body({
    mass: 4,
    shape: new CANNON.Box(new CANNON.Vec3(1.38 * 0.5, 1.348 * 0.5, 3.376 * 0.5)),
    position: new CANNON.Vec3(0, 6, 0)
})

//carBody.quaternion.setFromEuler(0, -Math.PI , 0 )

// Create the vehicle
const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody
})

//vehicle.addToWorld(world)

// // Wheels

const mass = 1
// const axisWidthFront = 1.326
// const axisWidthRear = 1.333

const rearRadiusTop = 0.44
const rearRadiusBottom = 0.44
const rearHeight = 0.26
const rearNumSegments = 32
const rearWheelShape = new CANNON.Cylinder(rearRadiusTop, rearRadiusBottom, rearHeight, rearNumSegments)
const quaternion = new CANNON.Quaternion().setFromEuler(0, 0, -Math.PI / 2)

const frontRadiusTop = 0.395
const frontRadiusBottom = 0.395
const frontHeight = 0.14
const frontNumSegments = 32
const frontWheelShape = new CANNON.Cylinder(frontRadiusTop, frontRadiusBottom, frontHeight, frontNumSegments)

//const wheelShape = new CANNON.Sphere(0.5)

const wheelMaterial = new CANNON.Material('wheel')
const down = new CANNON.Vec3(0, -1, 0)

const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody1.addShape(rearWheelShape, new CANNON.Vec3(), quaternion)

// let offsetZ = -0.12
// let offsetFront = -0.1

// Note the position of the wheels was found by opening the 3D model (see below)
// Inside the https://threejs.org/editor/ editor

vehicle.addWheel({
    body: wheelBody1,
    //position: new CANNON.Vec3(-0.675, -0.5 , 1.2 + offsetZ),
    position: new CANNON.Vec3(0.605, -0.517, 1.030),
    axis: new CANNON.Vec3(-1, 0, 0),
    direction: down
})

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody2.addShape(rearWheelShape, new CANNON.Vec3(), quaternion)
vehicle.addWheel({
    body: wheelBody2,
    position: new CANNON.Vec3(-0.628, -0.517, 1.027),
    //position: new CANNON.Vec3(0.675, -0.5, 1.2 + offsetZ),
    axis: new CANNON.Vec3(1, 0, 0),
    direction: down
})

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody3.addShape(frontWheelShape, new CANNON.Vec3(), quaternion)
vehicle.addWheel({
    body: wheelBody3,
    //position: new CANNON.Vec3(-0.675, -0.5, -1.2 + offsetFront),
    position: new CANNON.Vec3(-0.741, -0.56, -1.36),
    axis: new CANNON.Vec3(-1, 0, 0),
    direction: down
})

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody4.addShape(frontWheelShape, new CANNON.Vec3(), quaternion)
vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(0.708, -0.56, -1.36),
    axis: new CANNON.Vec3(1, 0, 0),
    direction: down
})

vehicle.wheelBodies.forEach((wheelBody) => {
    wheelBody.angularDamping = .4
})

vehicle.addToWorld(world)

/**
 * GLTF Model
 */

// Draco loader

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

// Loading manager for the loading screen

const loadingManager = new THREE.LoadingManager(() => {
    const loadingScreen = document.getElementById('loading-screen')
    loadingScreen.classList.add('fade-out')
    loadingScreen.addEventListener('transitionend', onTransitionEnd)
})

const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

let model

let chassisMesh

let rearWheelMesh1
let frontWheelMesh1

let rearWheelMesh2
let frontWheelMesh2

let engine
let engine_part1
let engine_part2
let engine_part3

// const axesHelper = new THREE.AxesHelper(8)
// axesHelper.setColors(new THREE.Color('red'), new THREE.Color('green'), new THREE.Color('blue'))
// scene.add(axesHelper)

gltfLoader.load(
    //'/models/vintage_racing_car/vintage_racing_car_light.glb',
    '/models/vintage_racing_car/vintage_car_light_fixed.glb',
    (gltf) => {
        model = gltf.scene


        model.traverse(function (node) {

            // console.log(node.name)

            // console.log(node.getWorldPosition(new THREE.Vector3()))

            if (node.isMesh) {

                // console.log(node.name)

                // console.log(node.parent)

                


                
                node.material.side = THREE.DoubleSide
                // node.material.opacity = 1
                
                node.material.transparent = false

                //console.log(node.material)

            }
        })

        chassisMesh = model.getObjectByName("Body_blue_0", true)

        chassisMesh.position.copy(carBody.position)
        chassisMesh.quaternion.copy(carBody.quaternion)

        rearWheelMesh1 = model.getObjectByName("rear_right_wheel_rear_wheel_0")
        rearWheelMesh2 = model.getObjectByName("rear_left_wheel_rear_wheel_0")
        frontWheelMesh1 = model.getObjectByName("front_right_wheel_front_wheel_0")
        frontWheelMesh2 = model.getObjectByName("front_left_wheel_front_wheel_0")

        engine = model.getObjectByName("engine_engine001_0", true)

        // Note: The positions of the parts was found using the 
        // threejs.org editor (https://threejs.org/editor/)

        engine.position.set(0.014, 0.952, -0.215)

        chassisMesh.add(engine)

        //chassisMesh.updateMatrixWorld()

        engine_part1 = model.getObjectByName("engine_part_engine001_0", true)

        engine_part1.position.set(0.014 - 0.166, 0.952 + 0.360, -0.215 + 0.048)

        chassisMesh.add(engine_part1)

        engine_part2 = model.getObjectByName("engine_part002_engine001_0", true)

        engine_part2.position.set(0.014 + 0.009, 0.952 + 0.435, -0.215 + 0.131)

        chassisMesh.add(engine_part2)

        engine_part3 = model.getObjectByName("engine_part001_engine001_0", true)

        engine_part3.position.set(0.014 + 0.009, 0.952 + 0.353, -0.215 - 0.093)

        chassisMesh.add(engine_part3)

        chassisMesh.add(chaseCamera)

        model.traverse(function (node) {
            if(node.isMesh)
            {
                console.log(node.name)
            }
        })

        scene.add(frontWheelMesh1)
        scene.add(frontWheelMesh2)
        scene.add(rearWheelMesh1)
        scene.add(rearWheelMesh2)

        //console.log(chassisMesh)

        scene.add(chassisMesh)

        // const bbox = new THREE.Box3().setFromObject(chassisMesh)
        // console.log(bbox.getSize(new THREE.Vector3()))

        //tick()
    }
)

/**
 * Experimental three.js car. This is a simple box car
 * used in the initial implementation. Note that positions 
 * of wheels and dimension of box must match the Cannon car
 */

// const carGeometry = new THREE.BoxGeometry(4, 1.5, 10)
// const carMaterial = new THREE.MeshBasicMaterial({ color: "white" })
// carMaterial.wireframe = true
// const chassisMesh = new THREE.Mesh(carGeometry, carMaterial)
// scene.add(chassisMesh)

// //const rearWheelGeometry1 = new THREE.SphereGeometry(1.5) 
// const rearWheelGeometry1 = new THREE.CylinderGeometry(rearRadiusTop, rearRadiusBottom, rearHeight, rearNumSegments, rearNumSegments)
// const rearWheelMesh1 = new THREE.Mesh(rearWheelGeometry1, carMaterial)
// scene.add(rearWheelMesh1)

// //const rearWheelGeometry2 = new THREE.SphereGeometry(1.5)
// const rearWheelGeometry2 = new THREE.CylinderGeometry(rearRadiusTop, rearRadiusBottom, rearHeight, rearNumSegments, rearNumSegments)
// const rearWheelMesh2 = new THREE.Mesh(rearWheelGeometry2, carMaterial)
// scene.add(rearWheelMesh2)

// //const frontWheelGeometry1 = new THREE.SphereGeometry(1.5)
// const frontWheelGeometry1 = new THREE.CylinderGeometry(frontRadiusTop, frontRadiusBottom, frontHeight, frontNumSegments, frontNumSegments)
// const frontWheelMesh1 = new THREE.Mesh(frontWheelGeometry1, carMaterial)
// scene.add(frontWheelMesh1)

// //const frontWheelGeometry2 = new THREE.SphereGeometry(1.5)
// const frontWheelGeometry2 = new THREE.CylinderGeometry(frontRadiusTop, frontRadiusBottom, frontHeight, frontNumSegments, frontNumSegments)
// const frontWheelMesh2 = new THREE.Mesh(frontWheelGeometry2, carMaterial)
// scene.add(frontWheelMesh2)

/**
 * Floor texture (https://3dtextures.me/) 
 */

const textureLoader = new THREE.TextureLoader()


const occlusionTexture = textureLoader.load("/textures/Stone_Floor_006_SD/Stone_Floor_006_ambientOcclusion.jpg")
const baseTexture = textureLoader.load("/textures/Stone_Floor_006_SD/Stone_Floor_006_basecolor.jpg")
const heightTexture = textureLoader.load("/textures/Stone_Floor_006_SD/Stone_Floor_006_height.png")
const normalTexture = textureLoader.load("/textures/Stone_Floor_006_SD/Stone_Floor_006_normal.jpg")
const roughnessTexture = textureLoader.load("/textures/Stone_Floor_006_SD/Stone_Floor_006_roughness.jpg")

occlusionTexture.wrapS = THREE.RepeatWrapping
occlusionTexture.wrapT = THREE.RepeatWrapping
occlusionTexture.repeat.set( 2, 2 )
baseTexture.wrapS = THREE.RepeatWrapping
baseTexture.wrapT = THREE.RepeatWrapping
baseTexture.repeat.set( 2, 2 )
heightTexture.wrapS = THREE.RepeatWrapping
heightTexture.wrapT = THREE.RepeatWrapping
heightTexture.repeat.set( 2, 2 )
normalTexture.wrapS = THREE.RepeatWrapping
normalTexture.wrapT = THREE.RepeatWrapping
normalTexture.repeat.set( 2, 2 )
roughnessTexture.wrapS = THREE.RepeatWrapping
roughnessTexture.wrapT = THREE.RepeatWrapping
roughnessTexture.repeat.sebase

/**
 * Floor geometry
 */

let plane = new THREE.PlaneGeometry(64, 64, 32, 32)

const floor = new THREE.Mesh(
    plane,
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.8,
        map: baseTexture,
        aoMap: occlusionTexture,
        aoMapIntensity: 0.9,
        side: THREE.DoubleSide,
        normalMap: normalTexture,
        displacementMap: heightTexture,
        displacementScale: 0.1,
        roughnessMap: roughnessTexture
    })
)
//floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
//floor.position.set(0,0,-2.9)
scene.add(floor)

floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2))

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
directionalLight.position.set(5., 10., 7.5)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
//camera.position.set(0, 4, 0)
// camera.lookAt(scene.position)
// goal = new THREE.Object3D()
// follow = new THREE.Object3D()
// follow.position.z = -coronaSafetyDistance
// if(chassisMesh){
// chassisMesh.add(follow)
// }

// goal.add(camera)
scene.add(camera)
initChaseCamera()

// const helper = new THREE.CameraHelper( camera )
// scene.add( helper )

// Orbit controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.75, 0)
// controls.enableDamping = true
// controls.minDistance = 2
// controls.maxDistance = 60


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Simple animation

    // rearWheelMesh1.rotation.x = deltaTime * 100
    // rearWheelMesh2.rotation.x = deltaTime * 100

    //frontWheelMesh1.rotation.x = -deltaTime * 40
    //frontWheelMesh2.rotation.x = -deltaTime * 40

    if (chassisMesh) {

        chassisMesh.position.copy(carBody.position)
        chassisMesh.quaternion.copy(carBody.quaternion)

        chassisMesh.rotateX(-Math.PI / 2)

        camera.lookAt(chassisMesh.position)

    }

    if (frontWheelMesh1) {
        frontWheelMesh1.position.copy(wheelBody3.position)
        frontWheelMesh1.quaternion.copy(wheelBody3.quaternion)
    }

    if (frontWheelMesh2) {
        frontWheelMesh2.position.copy(wheelBody4.position)
        frontWheelMesh2.quaternion.copy(wheelBody4.quaternion)
    }

    if (rearWheelMesh1) {
        rearWheelMesh1.position.copy(wheelBody1.position)
        rearWheelMesh1.quaternion.copy(wheelBody1.quaternion)
    }

    if (rearWheelMesh2) {
        rearWheelMesh2.position.copy(wheelBody2.position)
        rearWheelMesh2.quaternion.copy(wheelBody2.quaternion)
    }

//     dir.copy(a).sub(b).normalize()
//     const dis = a.distanceTo(b) - coronaSafetyDistance
//     goal.position.addScaledVector(dir, dis)
//     goal.position.lerp(temp, 0.02)
//     temp.setFromMatrixPosition(follow.matrixWorld)

//     if(chassisMesh){
//     camera.lookAt(chassisMesh.position)
// }

    // Update controls
    //controls.update()

    updateChaseCamera()

    // Render
    renderer.render(scene, camera)

    // Physics

    world.fixedStep()
    //cannonDebugger.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

// Call tick when testing the experimental car
tick()

/**
 * Steering
 */

document.addEventListener("keydown", (event) => {
    const maxSteerVal = Math.PI / 8
    const maxSpeed = 10
    const maxForce = 10

    switch (event.key) {
        case "w":
        case "ArrowUp":
            //console.log(vehicle)
            vehicle.setWheelForce(maxForce, 0)
            vehicle.setWheelForce(-maxForce, 1)
            break

        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(-maxForce * 0.5, 0)
            vehicle.setWheelForce(maxForce * 0.5, 1)
            break

        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 2)
            vehicle.setSteeringValue(maxSteerVal, 3)
            break

        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 2)
            vehicle.setSteeringValue(-maxSteerVal, 3)
            break

        // case ' ':
        //     chassisBody.applyLocalForce(new CANNON.Vec3(0, 10000, 0), new CANNON.Vec3(0, 0, 0))
    }
})

// Reset force on keyup
document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(0, 0)
            vehicle.setWheelForce(0, 1)
            break

        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(0, 0)
            vehicle.setWheelForce(0, 1)
            break

        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(0, 2)
            vehicle.setSteeringValue(0, 3)
            break

        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(0, 2)
            vehicle.setSteeringValue(0, 3)
            break

        // case ' ':
        //     chassisBody.applyLocalForce(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, 0, 0))
    }
})


/**
 * Sky and Sun
 */

let sky = new Sky()
sky.scale.setScalar(450000 * 0.1000)
scene.add(sky)

let sun = new THREE.Vector3()

const effectController = {
    turbidity: 6.7,
    rayleigh: 0.165,
    mieCoefficient: 0.,
    mieDirectionalG: 0.865,
    elevation: 13.7,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
}

function guiChanged() {

    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = effectController.turbidity
    uniforms['rayleigh'].value = effectController.rayleigh
    uniforms['mieCoefficient'].value = effectController.mieCoefficient
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
    const theta = THREE.MathUtils.degToRad(effectController.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    uniforms['sunPosition'].value.copy(sun)

    renderer.toneMappingExposure = effectController.exposure
    renderer.render(scene, camera)

}

// gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged)
// gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged)
// gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged)
// gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged)
// gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged)
// gui.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiChanged)
// gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged)

guiChanged()

function onTransitionEnd(event) {

    event.target.remove()

}

function initChaseCamera() {
    chaseCamera = new THREE.Object3D()
    chaseCamera.position.set(0, 0, 0)

    chaseCameraPivot = new THREE.Object3D()
    chaseCameraPivot.position.set(0, -6, 2)

    chaseCamera.add(chaseCameraPivot)

    scene.add(chaseCamera)
}

function updateChaseCamera() {

    chaseCameraPivot.getWorldPosition(view)

    if (view.y < 1) {
        view.y = 1
    }

    camera.position.lerpVectors(camera.position, view, 0.3)
}


function resetSpeeder(){
    // vehicle.setWheelForce(0, 0)
    // vehicle.setWheelForce(0, 1)
    // vehicle.setSteeringValue(0, 2)
    // vehicle.setSteeringValue(0, 3)
    
     
    


    // if (chassisMesh) {

    //     carBody.velocity = new CANNON.Vec3(0,0,0)
    // carBody.angularVelocity = new CANNON.Vec3(0,0,0)

    // carBody.quaternion.set(0,0,0,1)
    // chassisMesh.quaternion.copy(carBody.quaternion)

    // carBody.position.set(0,6,0)
    // chassisMesh.position.copy(carBody.position)

    // }

    // if (frontWheelMesh1) {
    //     frontWheelMesh1.position.copy(wheelBody3.position)
    //     frontWheelMesh1.quaternion.copy(wheelBody3.quaternion)
    // }

    // if (frontWheelMesh2) {
    //     frontWheelMesh2.position.copy(wheelBody4.position)
    //     frontWheelMesh2.quaternion.copy(wheelBody4.quaternion)
    // }

    // if (rearWheelMesh1) {
    //     rearWheelMesh1.position.copy(wheelBody1.position)
    //     rearWheelMesh1.quaternion.copy(wheelBody1.quaternion)
    // }

    // if (rearWheelMesh2) {
    //     rearWheelMesh2.position.copy(wheelBody2.position)
    //     rearWheelMesh2.quaternion.copy(wheelBody2.quaternion)
    // }

    console.log("Needs update")






    
}