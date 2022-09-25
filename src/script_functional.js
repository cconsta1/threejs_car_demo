import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import { Vec3 } from 'cannon-es'

let debugPosition = {
    amountX: -1.8,
    amountY: -1.8,
    amountZ: -1.8,
    scale: 0.03,
    x: 2,
    y: 0.75,
    z: 5,
    wheelpositionx: 0,
    wheelpositiony: 0,
    wheelpositionz: 0
}

// let goal, follow

// let temp = new THREE.Vector3();
// let dir = new THREE.Vector3();
// let a = new THREE.Vector3();
// let b = new THREE.Vector3();
// let coronaSafetyDistance = 16.0;

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
world.broadphase = new CANNON.SAPBroadphase(world)
//world.allowSleep = true
world.gravity.set(0, -29.81, 0)

// Ground

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(60, 60, 0.1))
})

groundBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
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

// Debugger

const cannonDebugger = new CannonDebugger(scene, world)

// Car gui

// let size = {
//     x: 1.3,
//     y: 0.7,
//     z: 2.1
// }



// const carBody = new CANNON.Body({
//     mass: 10,
//     position: new CANNON.Vec3(0, 6, 0),
//     shape: shapeDebug.shape
// })

// gui.add(size, "x", 0, 10, 0.1).onChange(
//     () => {
//         shapeDebug.shape.halfExtents.x = size.x
//     }
// )

// gui.add(size, "y", 0, 10, 0.1).onChange(
//     () => {
//         shapeDebug.shape.halfExtents.y = size.y
//     }
// )

// gui.add(size, "z", 0, 10, 0.1).onChange(
//     () => {
//         shapeDebug.shape.halfExtents.z = size.z
//     }
// )




/**
 * GLTF Model
 */

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//let mixer = null

let chassisMesh = new THREE.Object3D();
let testMesh = new THREE.Object3D();
let rearWheelMesh1;
let frontWheelMesh1;

let rearWheelMesh2;
let frontWheelMesh2;

let rearWheelsize = new THREE.Vector3()
let frontWheelsize = new THREE.Vector3()
let chassiSize = new THREE.Vector3()


// const axesHelper = new THREE.AxesHelper(8);
// scene.add(axesHelper);
// axesHelper.setColors(new THREE.Color('red'), new THREE.Color('green'), new THREE.Color('blue'))

gltfLoader.load(
    '/models/vintage_racing_car/vintage_racing_car.glb',
    (gltf) => {
        chassisMesh = gltf.scene
        testMesh = gltf.scene
        chassisMesh.castShadow = true
        
        scene.add(testMesh)
        scene.add(chassisMesh)
        //console.log(chassisMesh)
        


        chassisMesh.traverse(function (node) {

            if (node.isMesh) {
                //scene.add(node)
                // node.castShadow = true;
                // node.receiveShadow = true;
                //node.material.wireframe = true;
                console.log(node.name)

                if (node.name === "rear_right_wheel_rear_wheel_0") {
                    rearWheelMesh1 = node;
                    scene.add(rearWheelMesh1)

                    
                    //return
                }

                if (node.name === "rear_left_wheel_rear_wheel_0") {
                    rearWheelMesh2 = node;
                    scene.add(rearWheelMesh2)
                    //return
                }

                if (node.name === "front_right_wheel_front_wheel_0") {
                    frontWheelMesh1 = node;
                    scene.add(frontWheelMesh1)
                    //return
                }

                if (node.name === "front_left_wheel_front_wheel_0") {
                    frontWheelMesh2 = node;
                    scene.add(frontWheelMesh2)
                    // return
                }

                // if (node.name === "Body_blue_0") {
                //     //chassisMesh = node;
                //     alert("HI")
                //     // scene.add(chassisMesh)
                //     // return
                // }

            }
        });

        // const rearWheel1box = new THREE.Box3()
        // rearWheel1box.setFromObject(rearWheelMesh1)

        // const rearWheel2box = new THREE.Box3()
        // rearWheel2box.setFromObject(rearWheelMesh2)

        // console.log(rearWheel1box.getSize(new THREE.Vector3()))
        // console.log(rearWheel2box.getSize(new THREE.Vector3()))

        // const frontWheel1box = new THREE.Box3()
        // frontWheel1box.setFromObject(frontWheelMesh1)

        // const frontWheel2box = new THREE.Box3()
        // frontWheel2box.setFromObject(frontWheelMesh2)

        // console.log(frontWheel1box.getSize(new THREE.Vector3()))
        // console.log(frontWheel2box.getSize(new THREE.Vector3()))

        // const chassisBox = new THREE.Box3()
        // chassisBox.setFromObject(chassisMesh)

        // console.log(chassisBox.getSize(new THREE.Vector3()))

        //scene.add(chassisMesh)
        //chassisMesh.scale.set(debugPosition.scale, debugPosition.scale, debugPosition.scale)

        tick()

        // Animation
        //mixer = new THREE.AnimationMixer(gltf.scene)
        //const action = mixer.clipAction(gltf.animations[2])
        // action.play()
    }
)

let shapeDebug = {
    shape: new CANNON.Box(new CANNON.Vec3(1.38, 1.35, 3.38))
}

// Build the car chassis

//const chassisShape = new CANNON.Box(new CANNON.Vec3(debugPosition.x, debugPosition.y, debugPosition.z))
const chassisBody = new CANNON.Body({
    mass: 6,
    shape: shapeDebug.shape,
    position: new CANNON.Vec3(0, 18, 0)
})
//const centerOfMassAdjust = new CANNON.Vec3(0, -1, 0)
//chassisBody.addShape(chassisShape)

//console.log(chassisBody)

// Create the vehicle
const vehicle = new CANNON.RigidVehicle({
    chassisBody
})



// Wheels

const mass = 1
const axisWidth = 0.8*4
//const wheelShape = new CANNON.Sphere(1.5)

const rearRadiusTop = 0.44*4
const rearRadiusBottom = 0.44*4
const rearHeight = 0.26*4
const rearNumSegments = 32
const rearWheelShape = new CANNON.Cylinder(rearRadiusTop, rearRadiusBottom, rearHeight, rearNumSegments)
const quaternion = new CANNON.Quaternion().setFromEuler(0, 0, -Math.PI / 2)

const frontRadiusTop = 0.395*4
const frontRadiusBottom = 0.395*4
const frontHeight = 0.14*4
const frontNumSegments = 32
const frontWheelShape = new CANNON.Cylinder(frontRadiusTop, frontRadiusBottom, frontHeight, frontNumSegments)

const wheelMaterial = new CANNON.Material('wheel')
const down = new CANNON.Vec3(0, -1, 0)

const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody1.addShape(rearWheelShape, new CANNON.Vec3(), quaternion)
//wheelBody1.addShape(wheelShape)
vehicle.addWheel({
    body: wheelBody1,
    position: new CANNON.Vec3(axisWidth * 0.8, 0, -5),
    axis: new CANNON.Vec3(1, 0, 0),
    direction: down
})

//console.log(vehicle)

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody2.addShape(rearWheelShape, new CANNON.Vec3(), quaternion)
//wheelBody2.addShape(wheelShape)
vehicle.addWheel({
    body: wheelBody2,
    position: new CANNON.Vec3(-axisWidth * 0.8, 0, -5),
    axis: new CANNON.Vec3(-1, 0, 0),
    direction: down
})

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody3.addShape(frontWheelShape, new CANNON.Vec3(), quaternion)
//wheelBody3.addShape(wheelShape)
vehicle.addWheel({
    body: wheelBody3,
    position: new CANNON.Vec3(axisWidth * 0.9, 0, 5),
    axis: new CANNON.Vec3(1, 0, 0),
    direction: down
})

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial })
wheelBody4.addShape(frontWheelShape, new CANNON.Vec3(), quaternion)
//wheelBody4.addShape(wheelShape)
vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(-axisWidth * 0.9, 0, 5),
    axis: new CANNON.Vec3(-1, 0, 0),
    direction: down
})

vehicle.wheelBodies.forEach((wheelBody) => {
    // Some damping to not spin wheels too fast
    wheelBody.angularDamping = .4

})

chassisBody.position.set(0, 4, 0)

vehicle.addToWorld(world)

//console.log(vehicle)

/**
 * Experimental three.js car
 */

// const carGeometry = new THREE.BoxGeometry(4, 1.5, 10);
// const carMaterial = new THREE.MeshBasicMaterial({ color: "white" });
// carMaterial.wireframe = true
// const chassisMesh = new THREE.Mesh(carGeometry, carMaterial);
// scene.add(chassisMesh);

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
 * Floor Texture
 */

const textureLoader = new THREE.TextureLoader()

const occlusionTexture = textureLoader.load("/textures/Stylized_Sand_001_SD/Stylized_Sand_001_ambientOcclusion.jpg")
const baseTexture = textureLoader.load("/textures/Stylized_Sand_001_SD/Stylized_Sand_001_basecolor.jpg")
const heightTexture = textureLoader.load("/textures/Stylized_Sand_001_SD/Stylized_Sand_001_height.png")
const normalTexture = textureLoader.load("/textures/Stylized_Sand_001_SD/Stylized_Sand_001_normal.jpg")
const roughnessTexture = textureLoader.load("/textures/Stylized_Sand_001_SD/Stylized_Sand_001_roughness.jpg")

/**
 * Floor
 */

let plane = new THREE.PlaneGeometry(120, 120, 32, 32)


const floor = new THREE.Mesh(
    plane,
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.8,
        // map : baseTexture,
        // aoMap : occlusionTexture,
        // aoMapIntensity : 0.9,
        // side : THREE.DoubleSide,
        // normalMap : normalTexture,
        // displacementMap : heightTexture,
        // displacementScale : 0.1,
        // roughnessMap : roughnessTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

let debugCamera = {
    x: 2,
    y: 2,
    z: 2,
    groundY: -0.2
}

floor.position.set(0, debugCamera.groundY, 0)

floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2))


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
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
camera.position.set(0, 4, 0)
camera.lookAt(scene.position);
//goal = new THREE.Object3D();
//follow = new THREE.Object3D();
//follow.position.z = -coronaSafetyDistance;
//chassisMesh.add(follow);

//goal.add(camera);
//scene.add(camera)

// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

// gui.add(debugCamera, "groundY",-2,2,0.1).onChange(
//     () => {
//         floor.position.set(0, debugCamera.groundY, 0)
//     }
// )

// gui.add(debugCamera, "x",-2,2,0.1).onChange(
//     () => {
//         camera.position.x = debugCamera.x
//     }
// )

// gui.add(debugCamera, "x",-20,20,0.1).onChange(
//     () => {
//         camera.position.x = debugCamera.x
//     }
// )

// gui.add(debugCamera, "y",-20,20,0.1).onChange(
//     () => {
//         camera.position.y = debugCamera.y
//     }
// )

// gui.add(debugCamera, "z",-20,20,0.1).onChange(
//     () => {
//         camera.position.z = debugCamera.z
//     }
// )

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

gui.add(debugPosition, "amountX", -20, 20, 0.01).name("X")
gui.add(debugPosition, "amountY", -20, 20, 0.01).name("Y")
gui.add(debugPosition, "amountZ", -20, 20, 0.01).name("Z")
// gui.add(debugPosition, "scale", 0.001, 0.1, 0.001).onChange(
//     () => {
//         model.scale.set(debugPosition.scale, debugPosition.scale, debugPosition.scale)
//     }
// )
// gui.add(debugPosition, "x", 0, 6.3, 0.1).onChange(
//     () => {
//         shapeDebug.shape.halfExtents.x = debugPosition.x
//     }
// )
// gui.add(debugPosition, "y", 0, 6.3, 0.1).onChange(
//     () => {
//         shapeDebug.shape.halfExtents.y = debugPosition.y
//     }
// )
// gui.add(debugPosition, "z", 0, 6.3, 0.1).onChange(
//     () => {
//         shapeDebug.shape.halfExtents.z = debugPosition.z
//     }
// )
// gui.add(debugPosition, "wheelpositionx", -10, 10, 0.1).onChange(
//     () => {
//         vehicle.wheelBodies[0].position.x = debugPosition.wheelpositionx
//     }
// )

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

   

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Physics

    world.fixedStep()
    cannonDebugger.update()

    // GLTF car

    // model.position.copy(chassisBody.position)
    // model.quaternion.copy(chassisBody.quaternion)
    // model.position.y = model.position.y + debugPosition.amount

    // wheel1.position.copy(wheelBody1.position)
    // wheel1.quaternion.copy(wheelBody1.quaternion)
    // wheel1.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2)

    // wheel4.position.copy(wheelBody2.position)
    // wheel4.quaternion.copy(wheelBody2.quaternion)
    // wheel4.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2)

    // wheel2.position.copy(wheelBody3.position)
    // wheel2.quaternion.copy(wheelBody3.quaternion)
    // wheel2.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2)

    //disc1.position.copy(wheelBody3.position)
    //disc1.quaternion.copy(wheelBody3.quaternion)
    //disc1.quaternion.x = wheelBody3.quaternion.x
    //disc1.quaternion.y = wheelBody3.quaternion.y
    //  disc1.quaternion.z = wheelBody3.quaternion.z
    //  disc1.quaternion.w = wheelBody3.quaternion.w
    //disc1.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2)

    // wheel5.position.copy(wheelBody4.position)
    // wheel5.quaternion.copy(wheelBody4.quaternion)
    // wheel5.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2)

    // disc2.position.copy(wheelBody4.position)
    // disc2.quaternion.copy(wheelBody4.quaternion)
    // disc2.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2)

    rearWheelMesh1.scale.set(4, 4, 4)
    rearWheelMesh2.scale.set(4, 4, 4)

    frontWheelMesh1.scale.set(4, 4, 4)
    frontWheelMesh2.scale.set(4, 4, 4)

    chassisMesh.scale.set(4,4,4)

    // const box = new THREE.Box3()
    // box.setFromObject(rearWheelMesh1)

    //console.log(box.getSize(new THREE.Vector3()))

    // Experimental three.js car

    chassisMesh.position.copy(chassisBody.position)
    chassisMesh.quaternion.copy(chassisBody.quaternion)
    // chassisMesh.rotateX(-Math.PI/2)
    chassisMesh.rotateY(-Math.PI)
    chassisMesh.position.x += debugPosition.amountX
    chassisMesh.position.y += debugPosition.amountY
    chassisMesh.position.z += debugPosition.amountZ

    frontWheelMesh2.position.copy(wheelBody4.position)
    frontWheelMesh2.quaternion.copy(wheelBody4.quaternion)

    //frontWheelMesh2.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2)

    frontWheelMesh1.position.copy(wheelBody3.position)
    frontWheelMesh1.quaternion.copy(wheelBody3.quaternion)

    //frontWheelMesh1.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2)

    rearWheelMesh1.position.copy(wheelBody1.position)
    rearWheelMesh1.quaternion.copy(wheelBody1.quaternion)

    //rearWheelMesh1.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2)
    // rearWheelMesh1.rotation.y = Math.PI/2

    rearWheelMesh2.position.copy(wheelBody2.position)
    rearWheelMesh2.quaternion.copy(wheelBody2.quaternion)


    //rearWheelMesh2.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2)
    // rearWheelMesh2.rotation.y = Math.PI/2

    // a.lerp(chassisMesh.position, 0.4);
    // b.copy(goal.position);

    // dir.copy(a).sub(b).normalize();
    // const dis = a.distanceTo(b) - coronaSafetyDistance;
    // goal.position.addScaledVector(dir, dis);
    // goal.position.lerp(temp, 0.02);
    // temp.setFromMatrixPosition(follow.matrixWorld);

    // camera.lookAt(chassisMesh.position);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

// Call tick when testing the experimental car
//tick()

/**
 * Steering
 */

document.addEventListener("keydown", (event) => {
    const maxSteerVal = Math.PI / 8
    const maxSpeed = 10
    const maxForce = 100

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

        case ' ':
            chassisBody.applyLocalForce(new CANNON.Vec3(0, 10000, 0), new CANNON.Vec3(0, 0, 0))
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

        case ' ':
            chassisBody.applyLocalForce(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, 0, 0))
    }
})
