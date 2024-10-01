import * as Projectiles from "./projectiles.js";
import * as Objects from "./objects.js";
import { THREE, GLTFLoader } from "./threeWrapper.js";

export function playAnimation(characterData, name) {
  if (characterData.animations) {
    stopAllAnimation(characterData);

    characterData.animations[name].reset();
    characterData.animations[name].play();
  }
}

export function stopAllAnimation(characterData) {
  for (let key in characterData.animations) {
    if (characterData.animations.hasOwnProperty(key)) {
      characterData.animations[key].stop();
    }
  }
}

export async function playAnimationOnce(characterData, name) {
  if (characterData.animations) {
    stopAllAnimation(characterData);

    // Play the specified animation
    if (characterData.animations[name]) {
      const animationAction = characterData.animations[name];
      animationAction.setLoop(THREE.LoopOnce, 1);
      animationAction.clampWhenFinished = true;
      animationAction.play();

      // Create a Promise that resolves when the animation duration is over
      await new Promise((resolve) => {
        const duration = animationAction.getClip().duration * 1000; // Duration in milliseconds
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  }
}

// --- Deep Animation --- //
export function _parseAnimationMetadata(characterData, animationName) {
  var animationParams = characterData.animations[animationName].getClip().name;
  animationParams = String(animationParams).split("_");

  const style = animationParams[0],
    movementType = String(style).split("-")[1],
    styleDisplayName = animationParams[1],
    ms = Number(animationParams[2]);

  return {
    style,
    styleDisplayName,
    ms,
  };
}

// Only used in testing assets.
export function _checkAnimationMetadata(animationName, metadata) {
  for (const key in metadata) {
    const value = metadata[key];
    if (!value)
      throw new Error(
        `animation "${animationName}" has invalid metadata [${key}] is undefined`
      );
  }
}

export function _handleMovement(
  characterData,
  params
) {
  const { style, ms } = params;
  const { model, facing, target, reachTime = ms } = characterData;
  console.log(`handling movement ${facing}`);
  // const defaultTargetPos = model;

  // stk-a - do nothing, just play animation
  // stk-b - play animation, slide to target after ms
  // stk-c - play animation, teleport to target after ms
  switch (style) {
    case "stk-a":
      break;
    case "stk-b":
      setTimeout(() => {
        Objects.objectChaseTarget(model, target, reachTime);
      }, ms);
      break;
    case "stk-c":
      setTimeout(() => {
        model.position.set(target);
      }, ms);
      break;

    default:
      break;
  }
}

export async function _handleProjectileMovement(
  threeMemory,
  characterData,
  projectileObject,
  ms=200
) {
  console.log({ projectileObject });
  const { movementType, dataname, reachTime } = projectileObject;
  // a - stay same spot, play prj animation
  // b - slide to target
  // c - teleport to target

  setTimeout(()=>{
    switch (movementType) {
      case "a":
        Projectiles.showProjectile(
          threeMemory,
          dataname,
          characterData.model.position.clone()
        ); 
        break;
      
      case "b":
        const prj = Projectiles.showProjectile(
          threeMemory,
          dataname,
          characterData.model.position.clone()
        );
        Objects.objectChaseTarget(prj.model, characterData.target, reachTime);
        break;
      
      case "c":
        Projectiles.showProjectile(
          threeMemory,
          dataname,
          characterData.target
        );
        break;
    
      default:
        console.error(`projectile type "${movementType}" not defined`);
        break;
  }}, ms)
}

export async function playAbility(
  threeMemory,
  characterData,
  abilityObject,
  afterAnim
) {
  const { style, projectile } = abilityObject;
  if (!style) throw new Error("style not defined in ability");

  const animationName = abilityObject.style.toLowerCase();
  const animationParams = _parseAnimationMetadata(characterData, animationName);
  if (!characterData.target) throw new Error("Target position not defined");

  console.log("params:", animationParams);
  playAnimationOnce(characterData, animationName).then((res) => {
    if (afterAnim) afterAnim(Projectiles.removeProjectile(threeMemory, projectile.name));
    console.log("Hiding projectile")
  });

  _handleMovement(characterData, animationParams);
  if (projectile) {
    console.log("playing projectile")
    const projectileObject = Projectiles.getProjectileData(threeMemory, projectile.name);
    _handleProjectileMovement(threeMemory, characterData, projectileObject);
  }
}
