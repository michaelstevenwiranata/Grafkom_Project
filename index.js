import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import loadModels from './loadModels';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// INITIAL SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();
const clock = new THREE.Clock();

camera.position.z = 10;
camera.position.y = 100;

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
    let speed = 100;
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
loadModels(loader, scene);

// ANIMATE
function animate() {
	requestAnimationFrame( animate );

    movement(clock.getDelta())
    control.lock();

	renderer.render( scene, camera );
}

animate();