import { THREE, GLTFLoader } from "./threeWrapper.js";
import * as Camera from "./camera.js";
import { parsible, confirm } from "../utils/tools.js"; // Assume 'confirm' is properly exported from utils.js


const loader = new GLTFLoader(); // GLTFLoader initialized globally within the module
const raycaster = new THREE.Raycaster();
const compass = {
  n: new THREE.Euler(0, 0, 0),   // North
  ne: new THREE.Euler(0, Math.PI / 4, 0),   // North-East
  e: new THREE.Euler(0, Math.PI / 2, 0),   // East
  se: new THREE.Euler(0, (3 * Math.PI) / 4, 0),   // South-East
  s: new THREE.Euler(0, Math.PI, 0),   // South
  sw: new THREE.Euler(0, -(3 * Math.PI) / 4, 0),   // South-West            
  w: new THREE.Euler(0, -Math.PI / 2, 0),   // West
  nw: new THREE.Euler(0, -Math.PI / 4, 0),   // North-West
};


// Function to list all data names from prefab data
function listPrefabs(threeMemory) {
  return threeMemory.prefabDataMemory.map((d) => d.dataname);
}

// Function to get a prefab by type
function getPrefab(threeMemory, dataname = "") {
  const index = threeMemory.prefabDataIndex[dataname];
  confirm(index >= 0, "cannot find prefab: " + dataname);
  return threeMemory.prefabDataMemory[index].scene;
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
  const prefabMemory = threeMemory.prefabDataMemory[index].scene;
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
    threeMemory.prefabDataIndex[dataname] = threeMemory.prefabDataMemory.length - 1;
  } else {
    deletePrefabData(threeMemory, dataname);
    threeMemory.prefabDataMemory.push(prefabObject);
    threeMemory.prefabDataIndex[dataname] = threeMemory.prefabDataMemory.length - 1;
    console.log(`replaced prefab dataname '${dataname}'!`);
  }
  threeMemory.Scene.add(prefabObject.scene);
}

// Function to modify existing prefab data
function modifyPrefabData(threeMemory, dataname = "", newData = {}) {
  const index = threeMemory.prefabDataIndex[dataname];
  confirm(index >= 0, "cannot find prefab index for: " + dataname);
  Object.assign(threeMemory.prefabDataMemory[index], newData);
}

// Function to add a new model as a prefab
async function addModel(threeMemory, dataname = "", prefabSrc) {
  const model = await loader.loadAsync(prefabSrc);
  model.scene.traverse(function (object) {
    if (object.isMesh) object.castShadow = true;
  });
  const prefab = {
    src: prefabSrc,
    scene: model.scene,
    dataname: dataname,
    mixer: new THREE.AnimationMixer(model.scene),
    baseActions: {},
  };
  model.animations.forEach((clip) => {
    const action = prefab.mixer.clipAction(clip);
    prefab.baseActions[clip.name] = action;
  });
  prefab.height = getPrefabHeight(prefab.scene);
  savePrefabData(threeMemory, prefab);
  return prefab;
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
  data.scene.rotation.set(direction.x, direction.y, direction.z);
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
    threeMemory.prefabDataMemory.map((prefab) => prefab.scene)
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
