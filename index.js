import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import loadModels from './loadModels';

// INITIAL SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); // soft white light
ambientLight.position.set(20,20,20)
scene.add(ambientLight);

// LOAD MODELS
loadModels(loader, scene);

// ANIMATE
function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();