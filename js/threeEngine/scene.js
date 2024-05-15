// scene.js
import { THREE } from "./threeWrapper.js";

export function initScene(threeMemory) {
    const container = document.body; // Adjust this as necessary for your specific container element
    threeMemory.Scene = new THREE.Scene();
    threeMemory.Clock = new THREE.Clock();
    const bgColor = 0xa0a0a0;
    const fogColor = 0xa0a0a0;
    threeMemory.Scene.background = new THREE.Color(bgColor);
    threeMemory.Scene.fog = new THREE.Fog(fogColor, 20, 90);

    threeMemory.Renderer = new THREE.WebGLRenderer({ antialias: true });
    threeMemory.Renderer.setPixelRatio(window.devicePixelRatio);
    threeMemory.Renderer.setSize(window.innerWidth, window.innerHeight);
    threeMemory.Renderer.shadowMap.enabled = true;
    threeMemory.Renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(threeMemory.Renderer.domElement);

    threeMemory.Canvas = threeMemory.Renderer.domElement;
}

export function animate(threeMemory) {
    requestAnimationFrame(() => animate(threeMemory));
    threeMemory.Renderer.render(threeMemory.Scene, threeMemory.ClientCamera);

    // Example updating prefab animations
    if (threeMemory.prefabDataMemory.length > 0) {
        const mixerUpdateDelta = threeMemory.Clock.getDelta();
        threeMemory.prefabDataMemory.forEach(prefab => {
            if (prefab.mixer) prefab.mixer.update(mixerUpdateDelta);
        });
    }
}
