import { THREE, GLTFLoader } from "./threeWrapper.js";
import * as Objects from './objects.js';
import * as Camera from "./camera.js";
import { parsible, confirm } from "../utils/tools.js"; // Assume 'confirm' is properly exported from utils.js

const loader = new GLTFLoader(); // GLTFLoader initialized globally within the module
const raycaster = new THREE.Raycaster();


// Function to list all data names from character data
function listCharacters(threeMemory) {
  return threeMemory.characterDataStorage.map((d) => d.dataname);
}

// Function to get character data by dataname
function getCharacterData(threeMemory, dataname = "") {
  const characterData = threeMemory.characterDataStorage.find(
    (char) => char.dataname === dataname
  );
  if (!characterData) throw new Error("cannot find character: " + dataname);
  return characterData;
}

// Function to get character index by dataname
function getCharacterIndex(threeMemory, dataname = "") {
  return threeMemory.characterDataStorage.findIndex(
    (char) => char.dataname === dataname
  );
}

// Function to check if character data exists
function characterDataExists(threeMemory, dataname = "") {
  return threeMemory.characterDataStorage.some(
    (char) => char.dataname === dataname
  );
}

// Function to delete character data
function deleteCharacterData(threeMemory, dataname = "") {
  const index = threeMemory.characterDataStorage.findIndex(
    (char) => char.dataname === dataname
  );
  if (index === -1) throw new Error(`dataname '${dataname}' does not exist!`);

  const characterMemory = threeMemory.characterDataStorage[index].model;
  threeMemory.Scene.remove(characterMemory);

  // Remove the corresponding mixer from the mixers array
  const mixerIndex = threeMemory.characterDataStorage[index].mixerIndex;
  if (mixerIndex >= 0) {
    threeMemory.mixers.splice(mixerIndex, 1);
  }

  threeMemory.characterDataStorage.splice(index, 1);
}

// Function to save or update character data in the scene
function saveCharacterData(threeMemory, characterObject) {
  const { dataname, mixer } = characterObject;

  if (!characterDataExists(threeMemory, dataname)) {
    characterObject.mixerIndex = threeMemory.mixers.length;
    threeMemory.mixers.push(mixer);
    threeMemory.characterDataStorage.push(characterObject);
  } else {
    deleteCharacterData(threeMemory, dataname);
    characterObject.mixerIndex = threeMemory.mixers.length;
    threeMemory.mixers.push(mixer);
    threeMemory.characterDataStorage.push(characterObject);
    console.log(`replaced character dataname '${dataname}'!`);
  }

  threeMemory.Scene.add(characterObject.model);
}

// Function to modify existing character data
function modifyCharacterData(threeMemory, dataname = "", newData = {}) {
  const characterData = getCharacterData(threeMemory, dataname);
  Object.assign(characterData, newData);
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
  setTarget(threeMemory, dataname);
  return character;
}

/** Ask Ai: What if one of the abilities has a mesh that goes only with 
 * that animation, how can i go about adding it to the scene for only 
 * that animation in a way that integrates well with this code we 
 * already have */
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
          characterData.animations[key] = characterData.mixer.clipAction(animation);
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

function setTarget(threeMemory, dataname, x=0, y=0, z=0) {
  const data = getCharacterData(threeMemory, dataname);
  const targetPos = new THREE.Vector3(Number(x), Number(y), Number(z));

  data.target = targetPos;
}

function setFaceDirection(threeMemory, dataname, compassDirection) {
  const direction = Objects.compass[compassDirection];
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

function listBoneNames(model) {
  const boneNames = [];
  
  model.traverse((object) => {
    if (object.isBone) {
      boneNames.push(object.name);

    }
  });

  return boneNames;
}

export {
  getCharacterData,
  getCharacterIndex,
  deleteCharacterData,
  characterDataExists,
  listCharacters,
  modifyCharacterData,
  addModel,
  setFaceDirection,
  setTarget,
  clearCharacters, 
  listBoneNames
};