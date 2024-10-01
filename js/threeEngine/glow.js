// glow.js
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { THREE } from './threeWrapper.js';

let composer = null;
export function initGlow(threeMemory) {
    const { ClientCamera, Scene, Renderer } = threeMemory;
    composer = new EffectComposer(Renderer);
    const renderPass = new RenderPass(Scene, ClientCamera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.21;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.55;
    composer.addPass(bloomPass);
}

export function renderGlow() {
    if (composer) {
        composer.render();
    }
}

export function updateGlowParameters({ threshold, strength, radius }) {
    const bloomPass = composer.passes.find(pass => pass instanceof UnrealBloomPass);
    if (bloomPass) {
        bloomPass.threshold = threshold;
        bloomPass.strength = strength;
        bloomPass.radius = radius;
    }
}
