import { THREE, GLTFLoader } from "./threeWrapper.js";
import * as Characters from "./characters.js";
import * as Objects from "./objects.js";

const loader = new GLTFLoader(); // GLTFLoader initialized globally within the module
const raycaster = new THREE.Raycaster();
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

// Function to list all data names from projectile data
function listProjectiles(threeMemory) {
  return threeMemory.projectileDataStorage.map((p) => p.type === "projectile");
}

// Function to get projectile data by dataname
function getProjectileData(threeMemory, dataname = "") {
  const projectileData = threeMemory.projectileDataStorage.find(
    (char) => char.dataname === dataname
  );
  if (!projectileData) throw new Error(`cannot find projectile: "${dataname}"`);
  return projectileData;
}

// Function to check if projectile data exists
function projectileDataExists(threeMemory, dataname = "") {
  return threeMemory.projectileDataStorage.some(
    (char) => char.dataname === dataname
  );
}

// Function to delete projectile data
function deleteProjectileData(threeMemory, dataname = "") {
  const index = threeMemory.projectileDataStorage.findIndex(
    (char) => char.dataname === dataname
  );
  if (index === -1) throw new Error(`dataname '${dataname}' does not exist!`);

  const projectileMemory = threeMemory.projectileDataStorage[index].model;
  threeMemory.Scene.remove(projectileMemory);

  // Remove the corresponding mixer from the mixers array
  _removeFromOwner(threeMemory, threeMemory.projectileDataStorage[index]);
  const mixerIndex = threeMemory.projectileDataStorage[index].mixerIndex;
  if (mixerIndex >= 0) {
    threeMemory.mixers.splice(mixerIndex, 1);
  }

  threeMemory.projectileDataStorage.splice(index, 1);
}

// save to owner
function _saveToOwner(threeMemory, projectileObject) {
  const { dataname, owner } = projectileObject;
  const ownerIndex = Characters.getCharacterIndex(threeMemory, owner);
  if (owner === -1) throw new Error(`Owner "${owner}" not found`);

  if (!Array.isArray(threeMemory.characterDataStorage[ownerIndex])) {
    threeMemory.characterDataStorage[ownerIndex].projectiles = [];
  }

  threeMemory.characterDataStorage[ownerIndex].projectiles.push(
    projectileObject
  );
}

function _removeFromOwner(threeMemory, projectileObject) {
  const { dataname, owner } = projectileObject;
  const ownerIndex = Characters.getCharacterIndex(threeMemory, owner);
  if (owner === -1) throw new Error(`Owner "${owner}" not found`);
  const { projectiles } = threeMemory.characterDataStorage[ownerIndex];
  const newProjectiles = projectiles.filter((p) => p.dataname != dataname);
  threeMemory.characterDataStorage[ownerIndex].projectiles = newProjectiles;
}

// Function to save or update projectile data in the scene
function saveProjectileData(threeMemory, projectileObject) {
  const { dataname, mixer } = projectileObject;

  if (!projectileDataExists(threeMemory, dataname)) {
    projectileObject.mixerIndex = threeMemory.mixers.length;
    threeMemory.mixers.push(mixer);
    threeMemory.projectileDataStorage.push(projectileObject);
    _saveToOwner(threeMemory, projectileObject);
  } else {
    deleteProjectileData(threeMemory, dataname);
    _removeFromOwner(threeMemory, projectileObject);
    projectileObject.mixerIndex = threeMemory.mixers.length;
    threeMemory.mixers.push(mixer);
    threeMemory.projectileDataStorage.push(projectileObject);
    _saveToOwner(threeMemory, projectileObject);
    console.log(`replaced projectile dataname '${dataname}'!`);
  }
}

// Function to modify existing projectile data
function modifyProjectileData(threeMemory, dataname = "", newData = {}) {
  const projectileData = getProjectileData(threeMemory, dataname);
  Object.assign(projectileData, newData);
}

/* A function that takes the Torso bone and applies a new bone on top of it, for this to work all 
specimen must have "Torso" bone. We must supply this function with the coordinates of where to put the prjBone */
async function addProjectileToMemory(threeMemory, projectileData) {
  const { src, name, owner, movementType, reachTime } = projectileData;
  const values = ["src", "name", "owner", "movementType"];

  // verify projectile
  values.forEach((v) => {
    if (!projectileData[v]) throw new Error(`projectileMissing "${v}"`);
  });

  // build projectile
  const gltf = await loader.loadAsync(src);
  const model = gltf.scene;
  const mixer = new THREE.AnimationMixer(model);
  const animation = gltf.animations[0]
    ? mixer.clipAction(gltf.animations[0])
    : null;

  // save projectile
  saveProjectileData(threeMemory, {
    dataname: name,
    owner,
    model,
    mixer,
    animation,
    movementType,
    reachTime: reachTime || 500,
    isActive: false, // To track if the projectile is currently in the scene
  });

  console.log(`Projectile ${projectileData.name} added to memory`);
  return name;
}

// Show projectile
function showProjectile(threeMemory, projectileName, initialPosition) {
  const projectile = getProjectileData(threeMemory, projectileName);

  if (projectile.isActive) {
    console.warn(`Projectile ${projectileName} is already in the scene`);
    return;
  }

  projectile.model.position.copy(initialPosition);
  threeMemory.Scene.add(projectile.model);
  modifyProjectileData(threeMemory, projectileName, { isActive: true });

  if (projectile.animation) {
    animation.reset();
    animation.play();
  }

  console.log(`Projectile ${projectileName} added to scene`);
  return projectile;
}

// Remove Projectile
function removeProjectile(threeMemory, projectileName) {
  const projectile = getProjectileData(threeMemory, projectileName);
  if (!projectile || !projectile.isActive) {
    console.error(`Projectile ${projectileName} is not active`);
    return;
  }

  threeMemory.Scene.remove(projectile.model);
  modifyProjectileData(threeMemory, projectileName, { isActive: false });
  console.log(`Projectile ${projectileName} removed! `);
}

function checkProjectileCollision(projectile, target) {
  const projectileBox = new THREE.Box3().setFromObject(projectile.model);
  const targetBox = new THREE.Box3().setFromObject(target);

  return projectileBox.intersectsBox(targetBox);
}

function setFaceDirection(threeMemory, dataname, compassDirection = "n") {
  const direction = Objects.compass[compassDirection];
  if (!direction) throw new Error("invalid compass direction");

  const data = getProjectileData(threeMemory, dataname);
  modifyProjectileData(threeMemory, dataname, { facing: compassDirection });
  data.model.rotation.set(direction.x, direction.y, direction.z);
}

export {
  getProjectileData,
  deleteProjectileData,
  projectileDataExists,
  listProjectiles,
  modifyProjectileData,
  addProjectileToMemory,
  showProjectile,
  removeProjectile,
  checkProjectileCollision,
  setFaceDirection,
};
