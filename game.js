import * as THREE from 'three';

export function checkUpdateIntersect(camera, raycaster, object, focusIndicator) {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersectObject = raycaster.intersectObject(object);

    if (intersectObject.length > 0 && intersectObject[0].distance <= 20) {
        focusIndicator.style.visibility = 'visible';
        return true;
    } else {
        focusIndicator.style.visibility = 'hidden';
        return false;
    }
}

