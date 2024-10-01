import { THREE, GLTFLoader } from "./threeWrapper.js";

const compass = {
  n: new THREE.Euler(0, 0, 0), // North
  ne: new THREE.Euler(0, Math.PI / 4, 0), // North-East
  e: new THREE.Euler(0, Math.PI / 2, 0), // East
  se: new THREE.Euler(0, (3 * Math.PI) / 4, 0), // South-East
  s: new THREE.Euler(0, Math.PI, 0), // South
  sw: new THREE.Euler(0, -(3 * Math.PI) / 4, 0), // South-West
  w: new THREE.Euler(0, -Math.PI / 2, 0), // West
  nw: new THREE.Euler(0, -Math.PI / 4, 0), // North-West
};

function moveInDirection(model, direction, meters = 1) {
  // Create a direction vector pointing forward (along the z-axis)
  const directionVector = new THREE.Vector3(0, 0, -1);

  // Apply the direction's Euler rotation to the direction vector
  directionVector.applyEuler(direction);

  // Move the model in the direction of the resulting vector
  model.position.addScaledVector(directionVector, meters);
}

function getHeight(model) {
  const objectBoundingBox = new THREE.Box3().setFromObject(model);
  const objectHeight = objectBoundingBox.max.y - objectBoundingBox.min.y;
  return objectHeight;
}

function objectChaseTarget(model, targetPos, reachTime) {
  const startPos = model.position.clone();
  const clock = new THREE.Clock();
  const duration = reachTime / 1000; // Convert milliseconds to seconds

  function update() {
    const elapsed = clock.getElapsedTime();
    const t = Math.min(elapsed / duration, 1); // Calculate interpolation factor (0 to 1)

    // Interpolate between startPos and targetPos
    model.position.lerpVectors(startPos, targetPos, t);

    if (t < 1) {
      requestAnimationFrame(update);
    } else {
      console.log("Projectile reached target position");
    }
  }

  clock.start();
  update();
}

// Function to log the location of a character
function logLocation(model) {
  
    console.log(
      "character",
      "\n POSITION",
      model.position.x,
      model.position.y,
      model.position.z,
  
      "\n ROTATION",
      model.rotation.x,
      model.rotation.y,
      model.rotation.z
    );
}
  

export {
  compass,
  moveInDirection,
  getHeight,
  objectChaseTarget,
  logLocation
}