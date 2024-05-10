import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


const loader = new GLTFLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z =-30;
camera.position.y = 30;
camera.position.x = 0;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFFFFF);
document.body.appendChild( renderer.domElement );


const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); // soft white light
ambientLight.position.set(20,20,20)
scene.add(ambientLight);




renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//Create a PointLight and turn on shadows for the light


const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color, Intensity
directionalLight.position.set(0, 30, 0); // Position of the light

directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 4096; // Width of the shadow map
directionalLight.shadow.mapSize.height = 4096; // Height of the shadow map

// Set the size of the shadow camera frustum    
directionalLight.shadow.camera.left = -400; // Left boundary of the shadow camera's view frustum
directionalLight.shadow.camera.right = 400; // Right boundary of the shadow camera's view frustum
directionalLight.shadow.camera.top = 400; // Top boundary of the shadow camera's view frustum
directionalLight.shadow.camera.bottom = -400; // Bottom boundary of the shadow camera's view frustum

//pointerlock dipake buat bisa dapetin first person experience
const control = new PointerLockControls(camera,renderer.domElement)

let model;

let clock = new THREE.Clock();
let lampu;
let radio;
let old_pc;
let new_pc;
let newChair;
let meja;
let ruangan;
var keyboard = {};

const geometry = new THREE.BoxGeometry();

// Create a standard material


// Create a mesh using the geometry and material



const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/public/antique_fan/textures/TF_Oldfan_03a_normal.png');
const material = new THREE.MeshStandardMaterial({ map:texture});  
const cube = new THREE.Mesh(geometry, material)
cube.position.x = 20;
cube.position.y =20;
cube.position.z=20;
cube.scale.set(200,0.1,200)
scene.add(cube)
document.addEventListener('keydown', function(event) {
    keyboard[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keyboard[event.key] = false;
});


async function loadModels() {
    try {
        const lampuPromise = new Promise((resolve, reject) => {
            loader.load('/public/lamp.glb', function ( gltf ) {
                lampu = gltf.scene;
                scene.add( lampu );
                lampu.scale.set(3,3,3)
                lampu.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });
                resolve();
            }, undefined, reject);
        });

        await lampuPromise;
        const mejaPromise = new Promise((resolve, reject) => {
            loader.load('/public/antique_wooden_table/scene.gltf', function ( gltf ) {
                meja = gltf.scene;
                scene.add( meja  );
                meja.scale.set(600,50,200)
                meja.rotation.y = -Math.PI / 2;
                meja.position.y=-40
                meja.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });
                resolve()
            }, undefined, reject);
        });

        await mejaPromise;
        const radioPromise = new Promise((resolve, reject) => {
            loader.load('/public/vintage_radio.glb', function ( gltf ) {
                radio = gltf.scene;
                radio.scale.set(0.1,0.1,0.1);
                radio.position.x = lampu.position.x + 40;
                radio.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });
                scene.add( radio );
                resolve();
            }, undefined, reject);
        });
        await radioPromise;
        const oldPCPromise = new Promise((resolve, reject) => {
            loader.load('/public/old_pc.glb', function ( gltf ) {
                old_pc = gltf.scene;
                old_pc.position.x = lampu.position.x - 40;
                old_pc.scale.set(0.08,0.08,0.08);
                old_pc.position.y+=10;
                old_pc.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });
                scene.add( old_pc);
                resolve();
            }, undefined, reject);
        });
        await oldPCPromise;
        const newPCPromise = new Promise((resolve, reject) => {
            loader.load('/public/anime_style_80s_computer.glb', function ( gltf ) {
                new_pc = gltf.scene;
                new_pc.position.x = lampu.position.x - 80;
                new_pc.scale.set(200,200,200);
                
                scene.add(new_pc);
                new_pc.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });
                resolve();
            }, undefined, reject);
        });
        await newPCPromise;
        const newChairPromise = new Promise((resolve, reject) => {
            loader.load('/public/old_wooden_chair.glb', function ( gltf ) {
                newChair = gltf.scene;
                newChair.position.x = lampu.position.x - 120;
                newChair.scale.set(100,100,100);
                newChair.receiveShadow = true;
                newChair.castShadow = true;
                newChair.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });
                scene.add(newChair);
                resolve();
            }, undefined, reject);
        });

        await newChairPromise;
        const ruanganPromise = new Promise((resolve, reject) => {
            loader.load('/public/coba.glb', function ( gltf ) {
                ruangan = gltf.scene;
                ruangan.scale.set(10,10,10)
                scene.add(ruangan);
                resolve();
            }, undefined, reject);
        });
        await ruanganPromise;
        await Promise.all([lampuPromise,radioPromise, oldPCPromise, newPCPromise, newChairPromise,mejaPromise,ruanganPromise]);

        console.log("All models loaded successfully!");
    } catch (error) {
        console.error("Error loading models:", error);
    }
}


loadModels();


let loncat = false;
let fall = false;


function movement(delta){
    let speed = 50;
    let actualSpeed = speed * delta;
    if(keyboard['W'] || keyboard['w']){
        control.moveForward(actualSpeed);
        console.log("POSISI X :" + camera.position.x)
        console.log("POSISI Y :" + camera.position.y)
        console.log("POSISI Z :" + camera.position.z)
    }
    if(keyboard['a'] || keyboard['A']){
        control.moveRight(-actualSpeed)
        console.log("POSISI X :" + camera.position.x)
        console.log("POSISI Y :" + camera.position.y)
        console.log("POSISI Z :" + camera.position.z)
    }
    if(keyboard['s'] || keyboard['S']){
        control.moveForward(-actualSpeed)
        console.log("POSISI X :" + camera.position.x)
        console.log("POSISI Y :" + camera.position.y)
        console.log("POSISI Z :" + camera.position.z)
    }
    if(keyboard['d'] || keyboard['D']){
        control.moveRight(actualSpeed)
        console.log("POSISI X :" + camera.position.x)
        console.log("POSISI Y :" + camera.position.y)
        console.log("POSISI Z :" + camera.position.z)
    }

    
}


function animate() {
    requestAnimationFrame( animate );
    movement(clock.getDelta());
    control.lock();
    


    renderer.render(scene, camera);

    
}

animate();
