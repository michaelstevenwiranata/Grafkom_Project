// Import Three.js
import * as THREE from 'three';

// Inisialisasi scene, camera, dan renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xFFFFFF);
// Menambahkan kubus ke dalam scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Gunakan material Phong untuk mendapatkan efek pencahayaan yang lebih baik
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Menambahkan DirectionalLight ke dalam scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5); // Mengatur posisi DirectionalLight
scene.add(directionalLight);

// Menambahkan PointLight ke dalam scene
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(0, 10, 0); // Mengatur posisi PointLight
scene.add(pointLight);

camera.position.z = 5;

// Fungsi untuk merender adegan 3D
function animate() {
    requestAnimationFrame(animate);

    // Putar kubus
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();