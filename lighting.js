import * as THREE from 'three';

export function setupLighting(scene, camera) {

    // ambient light
    // const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.00001, 10, 2);
    // scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1); // Warna putih dengan intensitas 0.5
    directionalLight.position.set(-50, 100, 20);
    scene.add(directionalLight);

    const streetLight1 = new THREE.PointLight(0xffffff, 1000, 100, 2);
    streetLight1.position.set(-4, 60, -45);
    streetLight1.castShadow = true;
    scene.add(streetLight1);
    streetLight1.shadow.mapSize.width = 512;
    streetLight1.shadow.mapSize.height = 512;
    streetLight1.shadow.bias = -0.005;

    const streetLight2 = new THREE.PointLight(0xffffff, 1000, 100, 2);
    streetLight2.position.set(14, 60, -60);
    streetLight2.castShadow = true;
    scene.add(streetLight2);
    streetLight2.shadow.mapSize.width = 512;
    streetLight2.shadow.mapSize.height = 512;
    streetLight2.shadow.bias = -0.005;

    const streetLight3 = new THREE.PointLight(0xffffff, 1000, 100, 2);
    streetLight3.position.set(-104, 60, -45);
    streetLight3.castShadow = true;
    scene.add(streetLight3);
    streetLight3.shadow.mapSize.width = 512;
    streetLight3.shadow.mapSize.height = 512;
    streetLight3.shadow.bias = -0.005;

    const streetLight4 = new THREE.PointLight(0xffffff, 1000, 100, 2);
    streetLight4.position.set(14 - 100, 60, -60);
    streetLight4.castShadow = true;
    scene.add(streetLight4);
    streetLight4.shadow.mapSize.width = 512;
    streetLight4.shadow.mapSize.height = 512;
    streetLight4.shadow.bias = -0.005;

    // light kipas
    const kipasLight = new THREE.PointLight(0xffffff, 100, 100, 2);
    kipasLight.position.set(-18, 27, -88);
    kipasLight.castShadow = true;
    scene.add(kipasLight);
    kipasLight.shadow.mapSize.width = 512;
    kipasLight.shadow.mapSize.height = 512;
    kipasLight.shadow.bias = -0.005;
    kipasLight.shadow.camera.near = 1;
    kipasLight.shadow.camera.far = 5;

    // light bulan
    const bulanLight = new THREE.PointLight(0xffffff, 1000, 1000, 2);
    bulanLight.position.set(-100, 290, -80);
    bulanLight.castShadow = true;
    scene.add(bulanLight);
    bulanLight.shadow.mapSize.width = 2048;
    bulanLight.shadow.mapSize.height = 2048;
    bulanLight.shadow.bias = -0.005;
}