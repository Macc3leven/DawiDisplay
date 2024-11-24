import { THREE } from "../threeWrapper.js";

export const compass = {
  n: new THREE.Euler(0, 0, 0), // North
  ne: new THREE.Euler(0, Math.PI / 4, 0), // North-East
  e: new THREE.Euler(0, Math.PI / 2, 0), // East
  se: new THREE.Euler(0, (3 * Math.PI) / 4, 0), // South-East
  s: new THREE.Euler(0, Math.PI, 0), // South
  sw: new THREE.Euler(0, -(3 * Math.PI) / 4, 0), // South-West
  w: new THREE.Euler(0, -Math.PI / 2, 0), // West
  nw: new THREE.Euler(0, -Math.PI / 4, 0), // North-West
};

export function setToCompassDirection(model, compassDirection = "n") {
  const directionEuler = compass[compassDirection];
  if (!directionEuler) {
    console.warn(`Invalid compass direction: ${direction}`);
    return;
  }

  model.rotation.y = directionEuler.y;
}

export function getClosestCompassDirection(rotation) {
  let closestDirection = null;
  let smallestDifference = Infinity;

  Object.entries(compass).forEach(([direction, compassRotation]) => {
    // Calculate the angular difference
    const difference = rotation.angleTo(compassRotation);

    // Check if this difference is the smallest found
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestDirection = direction;
    }
  });

  return closestDirection;
}


/**
 * Rotate a character to face another character.
 * @param {THREE.Object3D} model - The first character's model.
 * @param {THREE.Object3D} targetModel - The target character's model.
 */
export function faceEachOther(model, targetModel) {
  const modelPosition = new THREE.Vector3().setFromMatrixPosition(model.matrixWorld);
  const targetPosition = new THREE.Vector3().setFromMatrixPosition(targetModel.matrixWorld);

  const directionVector = targetPosition.clone().sub(modelPosition).normalize();
  model.rotation.y = Math.atan2(directionVector.x, directionVector.z);
}

/**
 * Get a normalized vector for the current facing direction.
 * @param {THREE.Object3D} model - The character's model.
 * @returns {THREE.Vector3} - A normalized vector pointing in the direction the model is facing.
 */
export function getFacingDirection(model) {
  const forward = new THREE.Vector3(0, 0, -1); // Default forward vector in local space
  forward.applyQuaternion(model.quaternion); // Transform by the model's rotation
  forward.y = 0; // Ignore vertical rotation for movement
  return forward.normalize();
}

/**
 * Get a vector for a relative direction (e.g., "behind") based on the character's current facing direction.
 * @param {THREE.Object3D} model - The character's model.
 * @param {string} relativeDirection - The relative direction ("front", "behind", "left", "right").
 * @returns {THREE.Vector3} - A normalized vector for the relative direction.
 */
export function getRelativeDirection(model, relativeDirection) {
  const forward = getFacingDirection(model);

  switch (relativeDirection) {
    case "behind":
      return forward;
    case "forward":
      return forward.clone().negate(); // Reverse the forward vector
    case "left":
      return new THREE.Vector3(-forward.z, 0, forward.x).normalize(); // Perpendicular to the right
    case "right":
      return new THREE.Vector3(forward.z, 0, -forward.x).normalize(); // Perpendicular to the left
    default:
      console.warn(`Invalid relative direction: ${relativeDirection}`);
      return new THREE.Vector3(0, 0, 0); // Default to no movement
  }
}