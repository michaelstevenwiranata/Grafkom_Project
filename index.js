import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import loadModels from './loadModels';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import utils from './utils';

// INITIAL SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

camera.position.z = 100;
camera.position.x = 200;
camera.position.y = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const control = new PointerLockControls(camera, renderer.domElement)

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 5); // soft white light
ambientLight.position.set(20, 20, 20)
scene.add(ambientLight);

// EVENT HANDLING
let keyboard = {};
document.addEventListener('keydown', function (event) {
    keyboard[event.key] = true;
});
document.addEventListener('keyup', function (event) {
    keyboard[event.key] = false;
});

// bobbing
var bobAmount = 0.3; // How much the camera should bob up and down
var bobSpeed = 0.1; // How fast the bobbing should occur
var bobOffset = 1; // Offset for bobbing animation
function updateBobbing() {
    var bobHeight = Math.sin(bobOffset) * bobAmount;
    camera.position.y += bobHeight;
    bobOffset += bobSpeed;
}

// movement handling
function movement(delta) {
    let speed = 200;
    let move = false;
    let actualSpeed = speed * delta;
    if (keyboard['W'] || keyboard['w']) {
        control.moveForward(actualSpeed);
        move = true
    }
    if (keyboard['a'] || keyboard['A']) {
        control.moveRight(-actualSpeed)
        move = true
    }
    if (keyboard['s'] || keyboard['S']) {
        control.moveForward(-actualSpeed)
        move = true
    }
    if (keyboard['d'] || keyboard['D']) {
        control.moveRight(actualSpeed)
        move = true
    }

    if (move) { updateBobbing() }
}


// LOAD MODELS
let ruangan, meja, walldepan, wallkanan, wallatas, kipas;
async function loadModels() {
    try {

        // load model ruangan
        const ruanganPromise = new Promise((resolve, reject) => {
            loader.load('/public/ruangan.glb', function (gltf) {
                ruangan = gltf.scene;
                ruangan.scale.set(10, 10, 10)

                const center = utils.getCenterOBJ(ruangan);
                ruangan.position.set(-center.x, center.y, -center.z);

                scene.add(ruangan);
                resolve();
            }, undefined, reject);
        });
        await ruanganPromise;

        // load tembok depan - kanan - atas
        const ruangan_detail = utils.getBoundaryHWD(ruangan);
        const texture = textureLoader.load("./public/6464298.jpg");

        const wkanan_geometry = new THREE.BoxGeometry(3, ruangan_detail.height, ruangan_detail.depth);
        const wkanan_material = new THREE.MeshStandardMaterial({ map: texture });
        wallkanan = new THREE.Mesh(wkanan_geometry, wkanan_material);
        wallkanan.position.set(ruangan_detail.width / 2 - 10, ruangan_detail.height / 2, 0)
        scene.add(wallkanan);

        const wdepan_geometry = new THREE.BoxGeometry(ruangan_detail.width - 70, ruangan_detail.height, 3);
        const wdepan_material = new THREE.MeshStandardMaterial({ map: texture });
        walldepan = new THREE.Mesh(wdepan_geometry, wdepan_material);
        walldepan.position.set(25, ruangan_detail.height / 2, ruangan_detail.depth / 2)
        scene.add(walldepan);

        const watas_geometry = new THREE.BoxGeometry(ruangan_detail.width - 70, 3, ruangan_detail.depth);
        const watas_material = new THREE.MeshStandardMaterial({ map: texture });
        wallatas = new THREE.Mesh(watas_geometry, watas_material);
        wallatas.position.set(25, ruangan_detail.height, 0)
        scene.add(wallatas);

        // load meja tengah
        const mejaPromise = new Promise((resolve, reject) => {
            loader.load('/public/antique_wooden_table/scene.gltf', function (gltf) {
                meja = gltf.scene;
                meja.scale.set(100, 80, 150)

                meja.position.set(ruangan_detail.width / 2 - 50, 5, 120)
                meja.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });

                scene.add(meja);

                resolve()
            }, undefined, reject);
        });
        await mejaPromise;

        const kipasPromise = new Promise((resolve, reject) => {
            loader.load('./public/simple_ceiling_fan.glb', function (gltf) {
                kipas = gltf.scene;
                kipas.scale.set(0.1, 0.1, 0.1)
                kipas.position.set(0, 195, 0)
                kipas.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });

                scene.add(kipas);

                resolve()
            }, undefined, reject);
        });
        await kipasPromise;

        await Promise.all([ruanganPromise, mejaPromise, kipasPromise]);
    } catch (error) {
        console.log("Error loading models : " + error);
    }
}
loadModels();

// COLLISION
let prevCameraPos = new THREE.Vector3(); //buat nyimpen posisi camera sebelumnya
function checkCollisions() {
    camera.updateMatrixWorld();
    const cameraBox = new THREE.Box3();
    const cameraPos = new THREE.Vector3();
    camera.getWorldPosition(cameraPos);
    cameraBox.setFromCenterAndSize(cameraPos, new THREE.Vector3(1, 1, 1));

    let collisionDetected = false;

    if (meja) {
        const tableBox = new THREE.Box3().setFromObject(meja);
        const tableSize = tableBox.getSize(new THREE.Vector3());
        const tableCenter = tableBox.getCenter(new THREE.Vector3());
        tableBox.setFromCenterAndSize(tableCenter, new THREE.Vector3(tableSize.x, tableSize.y + 100, tableSize.z));

        if (cameraBox.intersectsBox(tableBox)) {
            collisionDetected = true;
        }
    }
    if (wallkanan) {
        const wallKananBox = new THREE.Box3().setFromObject(wallkanan);
        if (cameraBox.intersectsBox(wallKananBox)) {
            collisionDetected = true;
            console.log("kenak tembok kanan")
        }
    }
    if (walldepan) {
        const wallDepanBox = new THREE.Box3().setFromObject(walldepan);
        if (cameraBox.intersectsBox(wallDepanBox)) {
            collisionDetected = true;
            console.log("kenak tembok depan")
        }
    }

    if (collisionDetected) {
        camera.position.copy(prevCameraPos);
    } else {
        prevCameraPos.copy(cameraPos);
    }
}

function animasiKipas() {
    if (kipas) {
        let jarakx = Math.floor((Math.abs(camera.position.x)+50)/50);
        let speed = (0.2) - ((jarakx/50)) - 0.04;
        if(speed > 0.1) speed = 0.1;
        kipas.rotation.y += speed;
    }
}

// ANIMATE
function animate() {
    requestAnimationFrame(animate);

    checkCollisions();
    // animasi kipas
    animasiKipas();

    movement(clock.getDelta())
    control.lock();

    renderer.render(scene, camera);
}

animate();