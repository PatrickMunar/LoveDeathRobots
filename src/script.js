import './style.css'
// import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import testVertexShader from './shaders/vertex.glsl'
import testFragmentShader from './shaders/fragment.glsl'
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
const textures = []
textures[0] = textureLoader.load('./images/Happy.png')

const doubleBlinkFrames = []
doubleBlinkFrames[0] = textureLoader.load('./images/Idle1.png')
doubleBlinkFrames[1] = textureLoader.load('./images/Idle2.png')
doubleBlinkFrames[2] = textureLoader.load('./images/Idle3.png')
doubleBlinkFrames[3] = textureLoader.load('./images/Idle4.png')
doubleBlinkFrames[4] = textureLoader.load('./images/Idle3.png')
doubleBlinkFrames[5] = textureLoader.load('./images/Idle2.png')
doubleBlinkFrames[6] = textureLoader.load('./images/Idle3.png')
doubleBlinkFrames[7] = textureLoader.load('./images/Idle4.png')
doubleBlinkFrames[8] = textureLoader.load('./images/Idle3.png')
doubleBlinkFrames[9] = textureLoader.load('./images/Idle2.png')
doubleBlinkFrames[10] = textureLoader.load('./images/Idle1.png')

const blinkFrames = []
blinkFrames[0] = textureLoader.load('./images/Idle1.png')
blinkFrames[1] = textureLoader.load('./images/Idle2.png')
blinkFrames[2] = textureLoader.load('./images/Idle3.png')
blinkFrames[3] = textureLoader.load('./images/Idle4.png')
blinkFrames[4] = textureLoader.load('./images/Idle3.png')
blinkFrames[5] = textureLoader.load('./images/Idle2.png')
blinkFrames[6] = textureLoader.load('./images/Idle1.png')

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
        obj.scene.children[2].material.emissive = new THREE.Color('#ffffff')
        obj.scene.children[2].material.emissiveIntensity = 100
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

// Picture Parameters
const parameters = {
    widthFactor: 16,
    heightFactor: 9,
    amplitudeFactor: 1,
    speedFactor: 0.75,
    wideWidthFactor: 4,
    wideHeightFactor: 3,
    mapWidthFactor: 4,
    mapHeightFactor: 3
}

const waveClickParameters = {
    waveFrequency: 1,
    waveAmplitude: 0
}

const planeSize = {
    width: 32*parameters.widthFactor,
    height: 32*parameters.heightFactor,
    wideWidth: 32*parameters.wideWidthFactor,
    wideHeight: 32*parameters.wideHeightFactor,
    mapWidth: 50,
    mapHeight: 100,
}

// Picture Parameters
const pm2geometry = new THREE.PlaneGeometry(parameters.wideWidthFactor * 0.85, parameters.wideHeightFactor * 0.85, planeSize.wideWidth, planeSize.wideHeight)
const count = pm2geometry.attributes.position.count

// Material
const pm2material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 5},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: textures[1] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uRotationX: {value: 0},
        uRotationZ: {value: 1},
    },
    transparent: true,
    side: THREE.DoubleSide,
})

// Picture Mesh 2
let pictureMesh2 = new THREE.Mesh(pm2geometry, pm2material)
pictureMesh2.position.set(0,0,2.51)
pictureMesh2.frustumCulled = false
scene.add(pictureMesh2)

// Lighting

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 15, 4*0.8, 3*0.8)
rectAreaLight.position.set(0,0,2.51)
rectAreaLight.lookAt(new THREE.Vector3(0,0,100))
scene.add(rectAreaLight)

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

// Face Animations

let bFrame = -1
const bFrameInterval = [1, 0.8, 0.8, 0.5, 0.6, 0.7, 0.8]

const blink = () => {
    if (bFrame == blinkFrames.length - 1) {
        pm2material.uniforms.uTexture.value = textures[0]
        bFrame = -1
        setTimeout(() => {
            const DBorB = Math.random()
            if (DBorB < 0.8) {
                blink()
            }
            else {
                doubleBlink()
            }
        }, Math.random()*1000 + 3500)
    }
    else {
        bFrame += 1
        pm2material.uniforms.uTexture.value = blinkFrames[bFrame]
        setTimeout(() => {
            blink()
        }, bFrameInterval[bFrame]*1000*0.12)
    }
}

let dbFrame = -1
const dbFrameInterval = [1, 0.8, 0.8, 0.5, 0.5, 0.6, 0.5, 0.8, 0.6, 0.8, 1]

const doubleBlink = () => {
    if (dbFrame == doubleBlinkFrames.length - 1) {
        pm2material.uniforms.uTexture.value = textures[0]
        dbFrame = -1
        setTimeout(() => {
            const DBorB = Math.random()
            if (DBorB < 0.8) {
                blink()
            }
            else {
                doubleBlink()
            }
        }, Math.random()*1000 + 3500)
    }
    else {
        dbFrame += 1
        pm2material.uniforms.uTexture.value = doubleBlinkFrames[dbFrame]
        setTimeout(() => {
            doubleBlink()
        }, dbFrameInterval[dbFrame]*1000*0.12)
    }
}

blink()
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