// cameras.js
import { THREE, OrbitControls } from "./threeWrapper.js";
import { parsible } from "../utils/tools.js"; // Import necessary utility functions if required

export function initCamera(threeMemory, x=2,y=2,z=2) {
    // const fov = 60;
    // const aspect = window.innerWidth / window.innerHeight;
    // const near = 1.0;
    // const far = 100;
    // threeMemory.ClientCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // threeMemory.Controls = new OrbitControls(threeMemory.ClientCamera, threeMemory.Renderer.domElement);
    // threeMemory.Controls.enablePan = true;
    // threeMemory.Controls.enableZoom = true;
    setCameraPosition(threeMemory, x, y, z);
}

export function setCameraPosition(threeMemory, posX, posY, posZ) {
    const { x, y, z } = parsible(posX, posY, posZ);
    threeMemory.ClientCamera.position.set(x, y, z);
    threeMemory.Controls.update();
}

export function setCameraTarget(threeMemory, posX, posY, posZ) {
    const { x, y, z } = parsible(posX, posY, posZ);
    threeMemory.Controls.target.set(x, y, z);
    threeMemory.Controls.update();
}

export function setCameraRotation(threeMemory, posX, posY, posZ) {
    const { x, y, z } = parsible(posX, posY, posZ);
    threeMemory.ClientCamera.rotation.set(x, y, z);
    threeMemory.Controls.update();
}

export function cameraLockBehind(threeMemory, prefabData, distance = 8, duration=0) {
    const prefab = prefabData.scene;
    const preLocation = threeMemory.ClientCamera.position.clone();
    const location = prefab.position.clone();
    const facing = prefabData.facing || "e";
    
    // set height
    const prefabHeight = prefabData.height || 1.2;
    location.y += prefabHeight * 0.8; //80% of its height

    //target
    setCameraTarget(threeMemory, location.x, location.y, location.z);
    if (facing.includes("e")) location.x -= distance;
    if (facing.includes("w")) location.x += distance;
    if (facing.includes("s")) location.z += distance;
    if (facing.includes("n")) location.z -= distance;
    setCameraPositionTween(threeMemory, preLocation, location, duration);
}

export function setCameraPositionTween(threeMemory, startPosition, endPosition, duration) {
    const startTimestamp = performance.now();
    const deltaPosition = new THREE.Vector3().copy(endPosition).sub(startPosition);
    const sceneCamera = threeMemory.ClientCamera;

    function animateCamera() {
        const elapsed = performance.now() - startTimestamp;
        const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1
        const newPosition = new THREE.Vector3().copy(startPosition).add(deltaPosition.clone().multiplyScalar(progress));
        sceneCamera.position.copy(newPosition);
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        } else {
            threeMemory.Controls.update();
        }
    }
    animateCamera();
}

export function setCameraRotationTween(threeMemory, startRotation, endRotation, duration) {
    const startTimestamp = performance.now();
    const deltaRotation = new THREE.Euler().copy(endRotation).sub(startRotation);
    const sceneCamera = threeMemory.ClientCamera;

    function animateRotation() {
        const elapsed = performance.now() - startTimestamp;
        const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1
        const newRotation = new THREE.Euler(
            startRotation.x + deltaRotation.x * progress,
            startRotation.y + deltaRotation.y * progress,
            startRotation.z + deltaRotation.z * progress
        );
        sceneCamera.rotation.copy(newRotation);
        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        } else {
            threeMemory.Controls.update();
        }
    }
    animateRotation();
}