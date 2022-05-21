import './style.css'
// import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from 'gsap'

// Clear Scroll Memory
window.history.scrollRestoration = 'manual'

// -----------------------------------------------------------------
/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0x00040d)

/**
 * Loaders
 */
// Loading Manager
const loadingBar = document.getElementById('loadingBar')
const loadingPage = document.getElementById('loadingPage')

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
       
    },
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {

    }
)

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

// Font Loader
const fontLoader = new FontLoader()

const robotHead = new THREE.Group
const leftEar = new THREE.Group
const rightEar = new THREE.Group

gltfLoader.load(
    'LDRRobotHead.glb',
    (obj) => {
       
        scene.add(obj.scene)
        obj.scene.scale.set(0.1,0.1,0.1)

        // 
        robotHead.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[2].castShadow = true
        obj.scene.children[2].receiveShadow = true
        obj.scene.children[3].castShadow = true
        obj.scene.children[3].receiveShadow = true
    }
)

gltfLoader.load(
    'LeftEar.glb',
    (obj) => {
       
        scene.add(obj.scene)
        obj.scene.scale.set(0.1,0.1,0.1)

        // 
        leftEar.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'RightEar.glb',
    (obj) => {
       
        scene.add(obj.scene)
        obj.scene.scale.set(0.1,0.1,0.1)

        // 
        rightEar.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
    }
)

leftEar.position.y = 2
leftEar.position.x = 2.8
rightEar.position.y = 2
rightEar.position.x = -2.8
robotHead.add(leftEar)
robotHead.add(rightEar)
robotHead.position.y = -2
scene.add(robotHead)

// Lighting

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
scene.add(pointLight)

// Position Checker
// const box = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3), new THREE.MeshNormalMaterial)
// box.position.set(-1.25,0,-1.75)
// scene.add(box)

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,10)
camera.add(pointLight)
pointLight.position.x += 5
pointLight.position.y += 10
pointLight.position.z += 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enabled = false
controls.enablePan = false
controls.enableZoom = false

controls.enableDamping = true
controls.maxPolarAngle = Math.PI/2
// controls.minAzimuthAngle = Math.PI*0/180
// controls.maxAzimuthAngle = Math.PI*90/180
controls.minDistance = 12  
controls.maxDistance = 80

// Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.CineonToneMapping

// Raycaster
const raycaster = new THREE.Raycaster()

// Parallax Camera Group
const cameraGroup = new THREE.Group
cameraGroup.add(camera)
scene.add(cameraGroup)

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    if (controls.enabled == true) {
        controls.update()
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// gsap.to(leftEar.rotation, {x: - Math.PI*35.5/180})
// gsap.to(rightEar.rotation, {x: - Math.PI*35.5/180})
let NorP = -1

const moveEars = () => {
    if (NorP == -1) {
        NorP = 1
    }
    else {
        NorP = -1
    }

    const time = Math.random() + 0.5
    const rotXL = (Math.random() - 0.5)*Math.PI*(35.5/180*2) * NorP
    const rotXR = rotXL + (Math.random() - 0.5)*2*Math.PI*5/180
    gsap.to(leftEar.rotation, {duration: time, x: rotXL})
    gsap.to(rightEar.rotation, {duration: time, x: rotXR})

    setTimeout(() => {
        moveEars()
    }, time*1000)
}
moveEars()