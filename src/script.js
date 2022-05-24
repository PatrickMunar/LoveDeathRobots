import './style.css'
// import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import testVertexShader from './shaders/vertex.glsl'
import testFragmentShader from './shaders/fragment.glsl'
import thumbnailFragmentShader from './shaders/thumbnailFragment.glsl'
import thumbnailVertexShader from './shaders/thumbnailVertex.glsl'
import gsap from 'gsap'
import ScrollToPlugin from "gsap/ScrollToPlugin";

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
textures[1] = textureLoader.load('./images/Scared.png')

const thumbnails = []
thumbnails[0] = textureLoader.load('./images/tn1.png')
thumbnails[1] = textureLoader.load('./images/tn2.png')

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
const robotHeadBig = new THREE.Group
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
robotHeadBig.position.set(5,-2,-4)

robotHeadBig.rotation.y = -Math.PI/4
robotHeadBig.rotation.x = Math.PI/10
robotHeadBig.add(robotHead)
scene.add(robotHeadBig)

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
    waveFrequency: 0.5,
    waveAmplitude: 0.8
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
    },
    transparent: true,
    side: THREE.DoubleSide,
})

// Picture Mesh 2
let pictureMesh2 = new THREE.Mesh(pm2geometry, pm2material)
pictureMesh2.position.set(0,2,2.51)
robotHead.add(pictureMesh2)
pictureMesh2.frustumCulled = false

// Thumbnails
const tn1geometry = new THREE.PlaneGeometry(parameters.widthFactor * 0.45, parameters.heightFactor * 0.45, planeSize.width, planeSize.height)

// Material
const tn1material = new THREE.RawShaderMaterial({
    vertexShader: thumbnailVertexShader,
    fragmentShader: thumbnailFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 1},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: thumbnails[0] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
    },
    // transparent: true,
    side: THREE.DoubleSide,
})

// Thumbnail Mesh 2
let thumbnail1 = new THREE.Mesh(tn1geometry, tn1material)
thumbnail1.position.set(3.3,-10,0)
scene.add(thumbnail1)
thumbnail1.frustumCulled = false

// Thumbnails
const tn2geometry = new THREE.PlaneGeometry(parameters.widthFactor * 0.45, parameters.heightFactor * 0.45, planeSize.width, planeSize.height)

// Material
const tn2material = new THREE.RawShaderMaterial({
    vertexShader: thumbnailVertexShader,
    fragmentShader: thumbnailFragmentShader,
    uniforms: {
        uFrequency: {value: waveClickParameters.waveFrequency * 1.5},
        uTime: {value: 0},
        uOscillationFrequency: {value: 1},
        uColor: {value: new THREE.Color('#aa00ff')},
        uTexture: { value: thumbnails[1] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
    },
    // transparent: true,
    side: THREE.DoubleSide,
})

// Thumbnail Mesh 2
let thumbnail2 = new THREE.Mesh(tn2geometry, tn2material)
thumbnail2.position.set(-3.3,-20,0)
scene.add(thumbnail2)
thumbnail2.frustumCulled = false

// Particles
const particlesCount = 70000
const positions = new Float32Array(particlesCount * 3)

for (let i=0; i<particlesCount*3; i++) {
    positions[i*3 + 0] = ( Math.random() - 0.5 ) * 200
    positions[i*3 + 1] = ( Math.random() - 0.5 ) * 300 + ( Math.random() * 10 )
    positions[i*3 + 2] = Math.random()*-10 - 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffffff',
    size: 0.03,
    sizeAttenuation: true,
    depthWrite: true,
    blending: THREE.AdditiveBlending
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Scroll
const sectionDistance = 10

let scrollX = 0
let scrollY = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
})

// Mouse
const mouse = {x: 0, y:0}

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 15, 4*0.8, 3*0.8)
rectAreaLight.position.set(0,2,2.51)
rectAreaLight.lookAt(new THREE.Vector3(0,2,100))
scene.add(rectAreaLight)
robotHead.add(rectAreaLight)

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
pointLight.position.x += 10
pointLight.position.y += 10
pointLight.position.z += 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled = false
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

    // Update Times
    tn1material.uniforms.uTime.value = elapsedTime
    tn2material.uniforms.uTime.value = elapsedTime

    // Face Changes
    if (scrollY >= sizes.height*0.5) {
        pm2material.uniforms.uTexture.value = textures[1]
    }

    console.log(robotHeadBig.position)

    robotHead.rotation.x = Math.sin(elapsedTime) * 0.1
    // robotHead.rotation.y = Math.sin(elapsedTime) * 0.1 - Math.PI/6
    robotHead.rotation.z = Math.cos(elapsedTime) * 0.1

    // Camera Scroll
    camera.position.y = -scrollY / sizes.height * sectionDistance

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

// scrollTriggers
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

gsap.to(robotHeadBig.position, {x: 5, y: -2, z: -4})
gsap.to(robotHeadBig.rotation, {x: Math.PI/10, y: -Math.PI/4})

gsap.fromTo(robotHeadBig.position , {x: 5, y: -2, z: -4}, {
    scrollTrigger: {
        trigger: '.slider',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // markers: true
    },
    y: -2 - 10,
    x: -5,
    ease: 'none',
})

gsap.fromTo(robotHeadBig.rotation , {y: -Math.PI/4}, {
    scrollTrigger: {
        trigger: '.slider',
        start: () => window.innerHeight*1 + ' bottom',
        end: () => window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // markers: true
    },
    y: robotHeadBig.rotation.y + - Math.PI*1.5,
    ease: 'none',
})

gsap.fromTo(thumbnail1.position, {x: 5}, {
    scrollTrigger: {
        trigger: '.slider',
        start: () => window.innerHeight*1 + ' bottom',
        end: () => window.innerHeight*1 + ' top',
        snap: 1,
        scrub: 1.5,
        // markers: true
    },
    x: 3.3,
    ease: 'none',
})

gsap.fromTo(robotHeadBig.position , {y: -12, x: -5}, {
    scrollTrigger: {
        trigger: '.slider',
        start: () => window.innerHeight*2 + ' bottom',
        end: () => window.innerHeight*2 + ' top',
        snap: 1,
        scrub: true,
        // markers: true
    },
    x: 5,
    y: -2 - 20,
    ease: 'none',
})

gsap.fromTo(robotHeadBig.rotation , {x: robotHeadBig.rotation.x}, {
    scrollTrigger: {
        trigger: '.slider',
        start: () => window.innerHeight*2 + ' bottom',
        end: () => window.innerHeight*2 + ' top',
        snap: 1,
        scrub: true,
        // markers: true
    },
    x: Math.PI*2,
    y: -Math.PI/4,
    // y: Math.PI*2,
    ease: 'none',
})

gsap.fromTo(thumbnail2.position, {x: -5}, {
    scrollTrigger: {
        trigger: '.slider',
        start: () => window.innerHeight*2 + ' bottom',
        end: () => window.innerHeight*2 + ' top',
        snap: 1,
        scrub: 1.5,
        // markers: true
    },
    x: -3.3,
    ease: 'none',
})