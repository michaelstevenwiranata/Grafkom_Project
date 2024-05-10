import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import loadModels from './loadModels';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Octree } from 'three/addons/math/Octree.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import utils from './utils';

// INITIAL SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();
const clock = new THREE.Clock();

camera.position.z = 100;
camera.position.x = 200;
camera.position.y = 100;

const playerCollider = new Capsule(new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(0, 1, 0), 0.35);
const worldOctree = new Octree();

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const control = new PointerLockControls(camera, renderer.domElement)

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 5); // soft white light
ambientLight.position.set(20,20,20)
scene.add(ambientLight);

// EVENT HANDLING
let keyboard = {};
document.addEventListener('keydown', function(event) {
    keyboard[event.key] = true;
});
document.addEventListener('keyup', function(event) {
    keyboard[event.key] = false;
});

function movement(delta){
    let speed = 200;
    let actualSpeed = speed * delta;
    if(keyboard['W'] || keyboard['w']){
        control.moveForward(actualSpeed);
    }
    if(keyboard['a'] || keyboard['A']){
        control.moveRight(-actualSpeed)
    }
    if(keyboard['s'] || keyboard['S']){
        control.moveForward(-actualSpeed)
    }
    if(keyboard['d'] || keyboard['D']){
        control.moveRight(actualSpeed)
    }
}


// LOAD MODELS
async function loadModels() {
    let ruangan, meja;
    try {

        // load model ruangan
        const ruanganPromise = new Promise((resolve, reject) => {
            loader.load('/public/ruangan.glb', function (gltf) {
                ruangan = gltf.scene;
                ruangan.scale.set(10, 10, 10)

                const center = utils.getCenterOBJ(ruangan);
                ruangan.position.set(0, center.y, 0);

                worldOctree.fromGraphNode(ruangan);
                scene.add(ruangan);
                resolve();
            }, undefined, reject);
        });
        await ruanganPromise;

        // load meja tengah
        const mejaPromise = new Promise((resolve, reject) => {
            loader.load('/public/antique_wooden_table/scene.gltf', function (gltf) {
                meja = gltf.scene;
                meja.scale.set(100, 80, 150)

                meja.position.set(0,5,50)
                meja.rotation.y = -Math.PI / 2;
                meja.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true; // Enable shadow casting
                        child.receiveShadow = true; // Enable shadow receiving
                    }
                });

                worldOctree.fromGraphNode(meja);
                scene.add(meja);

                resolve()
            }, undefined, reject);
        });
        await mejaPromise;

        await Promise.all([ruanganPromise, mejaPromise]);
    } catch (error) {
        console.log("Error loading models : " + error);
    }
}
loadModels();

// COLLISION
function updatePlayerCollision(){
    const result = worldOctree.capsuleIntersect(playerCollider);
    if(result){
        console.log("tabrakan");
    }
}
// ANIMATE
function animate() {
	requestAnimationFrame( animate );

    updatePlayerCollision();
    movement(clock.getDelta())
    control.lock();

	renderer.render( scene, camera );
}

animate();