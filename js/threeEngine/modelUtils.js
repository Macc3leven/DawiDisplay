import { THREE, GLTFLoader } from "./threeWrapper.js";

// Function to create a box mesh and position it 2 units in front of the model
export function createBoxInFront(model) {
  // Create a box mesh
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

  // Calculate the forward direction vector based on the model's orientation
  const directionVector = new THREE.Vector3(0, 0, -1);
  directionVector.applyQuaternion(model.quaternion); // Apply the model's rotation to the direction vector

  // Calculate the new position for the box
  const modelPosition = new THREE.Vector3().setFromMatrixPosition(
    model.matrixWorld
  );
  const boxPosition = modelPosition
    .clone()
    .add(directionVector.multiplyScalar(2));

  // Set the box mesh position
  boxMesh.position.copy(boxPosition);

  // Add the box mesh to the scene
  scene.add(boxMesh);
}

// // Example usage:
// // Assuming you have a model and a scene
// const model = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// scene.add(model);

// // Create a box 2 units in front of the model
// createBoxInFront(model);
