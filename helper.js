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