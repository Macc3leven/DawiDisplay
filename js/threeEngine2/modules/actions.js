import { THREE } from "../threeWrapper.js";

// Function to play an animation
export function playAnimation(model, animationName) {
    const action = model.baseActions[animationName];

    if (action) {
        action.reset();
        action.play();
        console.log("ACTION", animationName)
    }else console.log(`no such animation ${animationName}`)
}

export function repeatAnimation(model, animationName, repeatCount = 1) {
    const action = model.baseActions[animationName];
    if (action) {
        action.reset();
        action.repetitions = repeatCount; // Set the number of repetitions
        action.clampWhenFinished = false; // Ensures the animation can repeat
        action.play();
        console.log("ACTION", animationName, "will repeat", repeatCount, "times");
    } else {
        console.log(`No such animation: ${animationName}`);
    }
}

// Function to stop an animation
export function stopAnimation(model, animationName) {
    const action = model.baseActions[animationName];
    if (action) {
        action.stop();
    }else console.log(`no such animation ${animationName}`)
}

// Function to crossfade between two animations
export function crossfadeAnimations(model, fromAnimation, toAnimation, duration = 1.0) {
    const fromAction = model.baseActions[fromAnimation];
    const toAction = model.baseActions[toAnimation];

    if (fromAction && toAction) {
        fromAction.fadeOut(duration);
        toAction.reset().fadeIn(duration).play();
    }
}

// Update the mixer for the model (should be called in your animation loop)
export function updateMixer(model, delta) {
    if (model.mixer) {
        model.mixer.update(delta);
    }
}

//Jump, Run