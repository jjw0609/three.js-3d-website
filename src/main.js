import * as THREE from 'three';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;

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

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 3);
directionalLight.position.set(-3, 5, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Mesh
const boxMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2), // geometry
    // new THREE.MeshBasicMaterial({color: 'firebrick'}) // material
    new THREE.MeshLambertMaterial({color: 'firebrick'}) // material
);
boxMesh.position.y = 1;
boxMesh.castShadow = true;
scene.add(boxMesh);

const groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10), // geometry
    // new THREE.MeshBasicMaterial({color: '#092e66'}) // material
    new THREE.MeshLambertMaterial({color: '#092e66'}) // material
);
groundMesh.rotation.x = THREE.MathUtils.degToRad(-90);
// groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
// scene.add(groundMesh);
scene.add(boxMesh, groundMesh);

camera.lookAt(boxMesh.position);

// Draw
renderer.render(scene, camera);