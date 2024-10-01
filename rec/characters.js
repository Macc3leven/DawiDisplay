

// -----------
import { THREE, GLTFLoader } from "./threeWrapper.js";
import * as Camera from "./camera.js";
import { parsible, confirm } from "../utils/tools.js"; // Assume 'confirm' is properly exported from utils.js

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

class ThreeMemory {
  constructor() {
    this.Scene;
    this.Renderer;
    this.ClientCamera;
    this.Controls;
    this.Clock;

    //global mixers
    this.mixers = [];

    // modules memory
    this.characterDataIndex = {}
    this.characterDataStorage = []

    this.lightDataIndex = {}
    this.lightDataMemory = []

    this.terrainDataIndex = {}
    this.terrainDataMemory = []
  }
  
}

// Function to list all data names from character data
function listCharacters(threeMemory) {
  return threeMemory.characterDataStorage.map((d) => d.dataname);
}

// Function to get a character by type
function getCharacter(threeMemory, dataname = "") {
  const index = threeMemory.characterDataIndex[dataname];
  confirm(index >= 0, "cannot find character: " + dataname);
  return threeMemory.characterDataStorage[index].model;
}

// Function to get character data by type
function getCharacterData(threeMemory, dataname = "") {
  const index = threeMemory.characterDataIndex[dataname];
  if (!(index >= 0)) throw new Error("cannot find character: " + dataname);
  return threeMemory.characterDataStorage[index];
}

// Function to check if character data exists
function characterDataExists(threeMemory, dataname = "") {
  return threeMemory.characterDataIndex.hasOwnProperty(dataname);
}

// Function to delete character data
function deleteCharacterData(threeMemory, dataname = "") {
  const index = threeMemory.characterDataIndex[dataname];
  const characterMemory = threeMemory.characterDataStorage[index].model;
  if (!(index >= 0)) throw new Error(`dataname '${dataname}' does not exist!`);
  threeMemory.Scene.remove(characterMemory);
  threeMemory.characterDataStorage.splice(index, 1);
  delete threeMemory.characterDataIndex[dataname];
  updateCharacterIndices(threeMemory);
}

// Function to update indices after deletion
function updateCharacterIndices(threeMemory) {
  threeMemory.characterDataIndex = {};
  threeMemory.characterDataStorage.forEach((item, index) => {
    threeMemory.characterDataIndex[item.dataname] = index;
  });
}

// Function to save or update character data in the scene
function saveCharacterData(threeMemory, characterObject) {
  const { dataname } = characterObject;
  if (!characterDataExists(threeMemory, dataname)) {
    threeMemory.characterDataStorage.push(characterObject);
    threeMemory.characterDataIndex[dataname] =
      threeMemory.characterDataStorage.length - 1;
  } else {
    deleteCharacterData(threeMemory, dataname);
    threeMemory.characterDataStorage.push(characterObject);
    threeMemory.characterDataIndex[dataname] =
      threeMemory.characterDataStorage.length - 1;
    console.log(`replaced character dataname '${dataname}'!`);
  }
  threeMemory.Scene.add(characterObject.model);
}

// Function to modify existing character data
function modifyCharacterData(threeMemory, dataname = "", newData = {}) {
  const index = threeMemory.characterDataIndex[dataname];
  confirm(index >= 0, "cannot find character index for: " + dataname);
  Object.assign(threeMemory.characterDataStorage[index], newData);
}

/**
 * Adds a new model as a character.
 * The GLB object must be formatted as follows:
 *
 * @param {Object} glbObject - The GLB object to be added.
 * @param {string} glbObject.basemodel - The base model of the character.
 * @param {string} glbObject.animationName1 - The first animation name.
 * @param {string} glbObject.animationName2 - The second animation name.
 */
async function addModel(threeMemory, dataname = "", glbObject = {}) {
  const src = glbObject.basemodel;
  if (typeof src !== "string" || !src) throw new error("no BaseModel present");

  const charGltf = await loader.loadAsync(src);
  const model = charGltf.scene;
  model.traverse(function (object) {
    if (object.isMesh) object.castShadow = true;
  });

  const character = {
    src,
    dataname,
    model,
    mixer: new THREE.AnimationMixer(model),
    animations: {},
  };

  console.log({ character });

  // apply animations
  await applyAnimations(character, glbObject);

  console.log(
    `applied animations ${Object.keys(character.animations).join(", ")}`
  );
  saveCharacterData(threeMemory, character);
  return character;
}

async function applyAnimations(characterData, glbObject) {
  for (const key in glbObject) {
    const value = glbObject[key];
    if (!value || typeof value !== "string") {
      throw new Error(`Invalid animation source ${key}`);
    }

    if (key !== "basemodel") {
      try {
        const gltf = await loader.loadAsync(value);
        const animation = gltf.animations[0];

        if (animation) {
          characterData.animations[key] =
            characterData.mixer.clipAction(animation);
        } else {
          console.log(
            `Corrupt GLB: ${characterData.dataname} has an error within animation "${key}"`
          );
        }
      } catch (error) {
        console.error(`Failed to load GLB: ${value}`, error);
      }
    }
  }
}

/* A function that takes the Torso bone and applies a new bone on top of it, for this to work all 
specimen must have "Torso" bone. We must supply this function with the coordinates of where to put the prjBone */
async function addProjectileProp(characterData, propSrc, propName) {
  const parentBone = characterData.model.getObjectByName("Torso") || characterData.model.getObjectByName("Root");
  if (!parentBone) {
    console.error(`No "Torso" or "Root" bone has been found`);
    return;
  }
  if (!propName) {
    console.error(`No prop name provided`);
    return;
  }

  // Create a new bone
  const newBone = new THREE.Bone();
  newBone.name = propName;
  newBone.position.set(0, 0, 0); // Adjust the position as needed

  // Add the new bone to the parent bone
  parentBone.add(newBone);

  // Load the prop model and attach it to the new bone
  const gltf = await loader.loadAsync(propSrc);
  const animations = gltf.animations
  const prop = gltf.scene;
  Array.isArray(characterData.props) ? characterData.props.push(prop) : characterData.props = [prop];
  newBone.add(prop);

  // Handle the prop externally
  return { parentBone, newBone, prop, animation: animations[0] };

  // setTimeout(() => {
  //   parentBone.remove(newBone)
  // }, 3000)
}

function setFaceDirection(threeMemory, dataname, compassDirection) {
  const direction = compass[compassDirection];
  if (!direction) throw new Error("invalid compass direction");

  const data = getCharacterData(threeMemory, dataname);
  modifyCharacterData(threeMemory, dataname, { facing: compassDirection });
  data.model.rotation.set(direction.x, direction.y, direction.z);
}

// Function to reset all characters to their default state
function clearCharacters(threeMemory) {
  Object.keys(threeMemory.characterDataIndex).forEach((key) => {
    deleteCharacterData(threeMemory, key);
  });
}

export {
  getCharacter,
  getCharacterData,
  deleteCharacterData,
  characterDataExists,
  listCharacters,
  modifyCharacterData,
  addModel,
  addProjectileProp,
  setFaceDirection,
  clearCharacters,
};
