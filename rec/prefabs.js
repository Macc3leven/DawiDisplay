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

// Function to list all data names from prefab data
function listPrefabs(threeMemory) {
  return threeMemory.prefabDataMemory.map((d) => d.dataname);
}

// Function to get a prefab by type
function getPrefab(threeMemory, dataname = "") {
  const index = threeMemory.prefabDataIndex[dataname];
  confirm(index >= 0, "cannot find prefab: " + dataname);
  return threeMemory.prefabDataMemory[index].model;
}

// Function to get prefab data by type
function getPrefabData(threeMemory, dataname = "") {
  const index = threeMemory.prefabDataIndex[dataname];
  if (!(index >= 0)) throw new Error("cannot find prefab: " + dataname);
  return threeMemory.prefabDataMemory[index];
}

// Function to check if prefab data exists
function prefabDataExists(threeMemory, dataname = "") {
  return threeMemory.prefabDataIndex.hasOwnProperty(dataname);
}

// Function to delete prefab data
function deletePrefabData(threeMemory, dataname = "") {
  const index = threeMemory.prefabDataIndex[dataname];
  const prefabMemory = threeMemory.prefabDataMemory[index].model;
  if (!(index >= 0)) throw new Error(`dataname '${dataname}' does not exist!`);
  threeMemory.Scene.remove(prefabMemory);
  threeMemory.prefabDataMemory.splice(index, 1);
  delete threeMemory.prefabDataIndex[dataname];
  updatePrefabIndices(threeMemory);
}

// Function to update indices after deletion
function updatePrefabIndices(threeMemory) {
  threeMemory.prefabDataIndex = {};
  threeMemory.prefabDataMemory.forEach((item, index) => {
    threeMemory.prefabDataIndex[item.dataname] = index;
  });
}

// Function to save or update prefab data in the scene
function savePrefabData(threeMemory, prefabObject) {
  const { dataname } = prefabObject;
  if (!prefabDataExists(threeMemory, dataname)) {
    threeMemory.prefabDataMemory.push(prefabObject);
    threeMemory.prefabDataIndex[dataname] =
      threeMemory.prefabDataMemory.length - 1;
  } else {
    deletePrefabData(threeMemory, dataname);
    threeMemory.prefabDataMemory.push(prefabObject);
    threeMemory.prefabDataIndex[dataname] =
      threeMemory.prefabDataMemory.length - 1;
    console.log(`replaced prefab dataname '${dataname}'!`);
  }
  threeMemory.Scene.add(prefabObject.model);
}

// Function to modify existing prefab data
function modifyPrefabData(threeMemory, dataname = "", newData = {}) {
  const index = threeMemory.prefabDataIndex[dataname];
  confirm(index >= 0, "cannot find prefab index for: " + dataname);
  Object.assign(threeMemory.prefabDataMemory[index], newData);
}

/** 
 * Adds a new model as a prefab.
 * The GLB object must be formatted as follows:
 * 
 * @param {Object} glbObject - The GLB object to be added.
 * @param {string} glbObject.basemodel - The base model of the prefab.
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

  const prefab = {
    src,
    dataname,
    model,
    mixer: new THREE.AnimationMixer(model),
    animations: {},
    height: getPrefabHeight(model),
  };

  console.log({ prefab });

  // apply animations
  for (const key in glbObject) {
    const value = glbObject[key];
    if (!value || typeof value !== "string") {
      throw new Error(`invalid animation source ${key}`);
    }

    if (key !== "basemodel") {
      loader.load(value, function (gltf) {
        const animation = gltf.animations[0];

        // console.log({ key, animation, look: gltf.animations });
        if (animation) prefab.animations[key] = prefab.mixer.clipAction(animation);
        else console.log(`corrupt glb: ${prefab.dataname} has an error within animation "${key}"`);
      });
    }
  }

  console.log(`applied animations ${Object.keys(prefab.animations).join(", ")}`)
  savePrefabData(threeMemory, prefab);
  return prefab;
}

// function loadCharacterModel(threeMemory, characterName) {
//   const loader = new GLTFLoader();
//   const modelPath = characterFolder + 'models/base-model_suit-man-with-hat.glb';
//   const characterIndex = threeMemory.CharacterData.length;
//   characterName = characterName || "defualtCharacter" + characterIndex;

//   loader.load(modelPath, function (gltf) {
//     const model = gltf.scene;
//     threeMemory.Scene.add(model);

//     const mixer = new AnimationMixer(model);

//     const animations = {};
//     const animationPaths = ['evadeL', 'evadeR', 'idle', 'block', 'run', 'prj_rath-of-staff', 'stk_punch'];
//     animationPaths.forEach(path => {
//       loadAnimation(mixer, path, animations);
//     });

//     currentCharacter = { model, mixer, animations };
//     threeMemory.CharacterData.push(currentCharacter);
//     threeMemory.CharacterDataIndex[characterName] = characterIndex;
//     threeMemory.ClientCamera.position.z = 5;

//     const boneNames = listBoneNames(model);
//     console.log({ boneNames });
//     playAnimation("idle");

//     // Add a new bone to the model and attach a prop to it
//     // addBoneAndAttachProp(model, "Torso", "prjBone", `${propsFolder}prjob_mageball2.glb`);
//   });
// }

/** This function will need the paths to the animations its best to tie this with any 3D document  */
function appendAnimation(mixer, path, animations) {
  const loader = new GLTFLoader();
  loader.load(`${characterFolder}animations/${path}.glb`, function (gltf) {
    const animation = gltf.animations[0];
    //const name = path.split('.')[0]; // Assuming animation name from file name without extension
    animations[path] = mixer.clipAction(animation);
  });
}

function getPrefabHeight(prefab) {
  const objectBoundingBox = new THREE.Box3().setFromObject(prefab);
  const objectHeight = objectBoundingBox.max.y - objectBoundingBox.min.y;
  return objectHeight;
}

function setFaceDirection(threeMemory, dataname, compassDirection) {
  const direction = compass[compassDirection];
  if (!direction) throw new Error("invalid compass direction");

  const data = getPrefabData(threeMemory, dataname);
  modifyPrefabData(threeMemory, dataname, { facing: compassDirection });
  data.model.rotation.set(direction.x, direction.y, direction.z);
}

function enablePrefabClicks(threeMemory) {
  threeMemory.Canvas.addEventListener("click", (event) => {
    onPrefabClick(event, threeMemory, function (prefabObj) {
      Camera.cameraLockBehind(threeMemory, prefabObj.dataname, 8);
    });
  });
}

function onPrefabClick(event, threeMemory, callback) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, threeMemory.ClientCamera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(
    threeMemory.prefabDataMemory.map((prefab) => prefab.model)
  );

  if (intersects.length > 0) {
    // Handle the click on the first intersected object (you can iterate through the 'intersects' array for multiple objects)
    const clickedObject = intersects[0].object;
    const parentObject = clickedObject.parent;

    // Find the topmost group that this object is part of
    let topObject = clickedObject;
    while (topObject.parent && !topObject.topOfGroup) {
      topObject = topObject.parent;
    }

    console.log(`youve clicked: ${dataname}`);
    callback(topObject);
  }
}

// Function to reset all prefabs to their default state
function clearPrefabs(threeMemory) {
  Object.keys(threeMemory.prefabDataIndex).forEach((key) => {
    deletePrefabData(threeMemory, key);
  });
}

// Function to log the location of a prefab
function logPrefabLoc(dataname) {
  const subject = this._getPrefab(dataname);

  console.log(
    "prefab",
    "\n POSITION",
    subject.position.x,
    subject.position.y,
    subject.position.z,

    "\n ROTATION",
    subject.rotation.x,
    subject.rotation.y,
    subject.rotation.z
  );
}

export {
  getPrefab,
  getPrefabData,
  deletePrefabData,
  prefabDataExists,
  listPrefabs,
  modifyPrefabData,
  addModel,
  getPrefabHeight,
  setFaceDirection,
  enablePrefabClicks,
  clearPrefabs,
  logPrefabLoc,
};
