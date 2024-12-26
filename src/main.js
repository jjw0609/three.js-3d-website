import * as THREE from 'three';
// import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshObject } from './MeshObject.js';
import * as CANNON from 'cannon-es';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white')

// Camera
const camera = new THREE.PerspectiveCamera(
    60, // fov
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    1000 //far
);
camera.position.x = -1;
camera.position.y = 3;
camera.position.z = 7;
// camera.position.set(-1, 3, 7);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, renderer.domElement);
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();


// Light
const ambientLight = new THREE.AmbientLight('white', 1);
const pointLight = new THREE.PointLight('white', 100, 100);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.position.y = 10;
scene.add(ambientLight, pointLight);

// Cannon(Physics)
const cannonWorld = new CANNON.World();
cannonWorld.gravity.set(0, -10, 0);

const defaultCannonMaterial = new CANNON.Material('defulat');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultCannonMaterial,
    defaultCannonMaterial,
    {
        friction: 1,
        restituion: 0.2
    }
);
cannonWorld.defaultContactMaterial = defaultContactMaterial;

// Mesh
const ground = new MeshObject({
    scene,
    name: 'ground',
    width: 50,
    height: 0.1,
    depth: 50,
    color: '#092e66',
    y: -0.05,
    differenceY: '0'
});


const floor = new MeshObject({
    scene,
    name: 'floor',
    width: 5,
    height: 0.4,
    depth: 5,
    differenceY: '0'
});

const wall1 = new MeshObject({
    scene,
    name: 'wall1',
    width: 5,
    height: 3,
    depth: 0.2,
    z: -2.4
});

const wall2 = new MeshObject({
    scene,
    name: 'wall2',
    width: 0.2,
    height: 3,
    depth: 4.8,
    x: 2.4,
    z: 0.1
});

const desk = new MeshObject({
    scene,
    loader: gltfLoader,
    name: 'desk',
    width: 1.8,
    height: 0.8,
    depth: 0.75,
    x: 1.2,
    z: -1.9,
    modelSrc: './models/desk.glb'
});

const lamp = new MeshObject({
    scene,
    loader: gltfLoader,
    name: 'lamp',
    width: 0.5,
    height: 1.8,
    depth: 0.5,
    z: -1.7,
    modelSrc: './models/lamp.glb'
});

const roboticVaccum = new MeshObject({
    scene,
    loader: gltfLoader,
    name: 'roboticVaccum',
    width: 0.5,
    height: 0.1,
    depth: 0.5,
    x: -1,
    modelSrc: './models/vaccum.glb'
});

const magazine = new MeshObject({
    scene,
    loader: textureLoader,
    name: 'magazie',
    width: 0.2,
    height: 0.02,
    depth: 0.29,
    x: 0.7,
    y: 1.32,
    z: -2.2,
    rotationX: THREE.MathUtils.degToRad(52),
    mapSrc: './models/magazine.jpg'
})

function setLayout() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let movementX = 0;
let movementY = 0;
function updateMovementValue(event) {
    movementX = event.movementX * delta;
    movementY = event.movementY * delta;
    // console.log('x: ' + event.movementX);
    // console.log('y: ' + event.movementY);
}

const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const minPolarAngle = 0;
const maxPolarAngle = Math.PI;  // 100
function rotateCamera() {
    euler.setFromQuaternion(camera.quaternion);
    euler.y -= movementX;
    euler.x -= movementY;
    euler.x = Math.max(Math.PI/2 - maxPolarAngle, Math.min(Math.PI/2 - minPolarAngle, euler.x));

    movementX -= movementX * 0.2;
    movementY -= movementY * 0.2;

    if(Math.abs(movementX) < 0.1) movementX = 0;
    if(Math.abs(movementY) < 0.1) movementY = 0;

    camera.quaternion.setFromEuler(euler);
}

function setMode(mode) {
    document.body.dataset.mode = mode;

    if(mode === 'game') {
        document.addEventListener('mousemove', updateMovementValue);

    } else if(mode === 'website') {
        document.removeEventListener('mousemove', updateMovementValue);
    }
}

// Draw
const clock = new THREE.Clock();
let delta;
function draw() {

    delta = clock.getDelta();

    rotateCamera();
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
}

draw();

// Events
window.addEventListener('resize', setLayout);

document.addEventListener('click', () => {
    canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        setMode('game');
    } else {
        setMode('website');
    }
})