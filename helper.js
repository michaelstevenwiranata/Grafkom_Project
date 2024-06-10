import * as THREE from 'three';

export function getBoundaryHWD(object) {
    var boundingBox = new THREE.Box3().setFromObject(object);
    var size = new THREE.Vector3();
    boundingBox.getSize(size);

    // Mendapatkan tinggi, lebar, dan kedalaman
    var height = size.y;
    var width = size.x;
    var depth = size.z;

    return { height, width, depth };
}
export function getCenterOBJ(object) {
    var boundingBox = new THREE.Box3().setFromObject(object);

    var center = new THREE.Vector3();
    boundingBox.getCenter(center);

    return { ...center }
}
export function showAlert(alertContainer, message, type, duration = 2000) {
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`);
    alert.textContent = message;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('fadeOut');
        setTimeout(() => {
            alert.remove();
        }, 300); // duration of fadeOut animation
    }, duration);
}
function computeVerticesCount(object) {
    let verticesCount = 0;
    object.traverse(function (child) {
        if (child.isMesh) {
            verticesCount += child.geometry.attributes.position.count;
        }
    });
    return verticesCount;
}
export function createCollisionCube(object, worldOctree, scene) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    console.log(size);
    console.log(center);
    box.getSize(size);
    box.getCenter(center);

    // Create a cube with the same size as the bounding box
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true // biar cuman garis garis kerangka doang yang tampil
    });
    const cube = new THREE.Mesh(geometry, material);
    // Position the cube at the center of the bounding box
    cube.position.copy(center);
    // console.log(cube.geometry.attributes.position.count);
    // const totalVertices = computeVerticesCount(object);
    // console.log('Total number of vertices in the loaded model:', totalVertices);

    worldOctree.fromGraphNode(object);
}