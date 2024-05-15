import { THREE } from "./threeWrapper.js";

// Function to play an animation
export function playAnimation(prefab, animationName) {
    const action = prefab.baseActions[animationName];
    if (action) {
        action.reset();
        action.play();
    }else console.log(`no such animation ${animationName}`)
}

// Function to stop an animation
export function stopAnimation(prefab, animationName) {
    const action = prefab.baseActions[animationName];
    if (action) {
        action.stop();
    }else console.log(`no such animation ${animationName}`)
}

// Function to crossfade between two animations
export function crossfadeAnimations(prefab, fromAnimation, toAnimation, duration = 1.0) {
    const fromAction = prefab.baseActions[fromAnimation];
    const toAction = prefab.baseActions[toAnimation];

    if (fromAction && toAction) {
        fromAction.fadeOut(duration);
        toAction.reset().fadeIn(duration).play();
    }
}

// Update the mixer for the prefab (should be called in your animation loop)
export function updateMixer(prefab, delta) {
    if (prefab.mixer) {
        prefab.mixer.update(delta);
    }
}
