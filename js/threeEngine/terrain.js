import { THREE, GLTFLoader } from "./threeWrapper.js";
import * as Lights from "./lights.js";

const loader = new GLTFLoader(); // GLTFLoader initialized globally within the module
let currentTerrainObject = null;

function getTerrainData(threeMemory, terrainDataName = "") {
  const index = threeMemory.terrainDataIndex[terrainDataName];
  return threeMemory.terrainDataMemory[index];
}

function terrainDataExists(threeMemory, terrainDataName = "") {
  const index = threeMemory.terrainDataIndex[terrainDataName];
  return Boolean(index >= 0);
}

function deleteTerrainData(threeMemory, terrainDataName = "") {
  const index = threeMemory.terrainDataIndex[terrainDataName];
  const terrainCache = threeMemory.terrainDataMemory[index].scene;
  threeMemory.Scene.remove(terrainCache);
  threeMemory.terrainDataMemory.splice(index, 1);
  delete threeMemory.terrainDataIndex[terrainDataName];
  updateTerrainIndices(threeMemory);
}

function updateTerrainIndices(threeMemory) {
  threeMemory.terrainDataMemory.forEach((el, idx) => {
    threeMemory.terrainDataIndex[el.dataname] = idx;
  });
}

function saveTerrainData(threeMemory, terrainObject) {
  const { dataname } = terrainObject;
  if (!dataname) throw new Error("terrain data has no 'dataname' property");
  const terrainExists = terrainDataExists(threeMemory, dataname);
  if (!terrainExists) {
    threeMemory.terrainDataMemory.push(terrainObject);
    threeMemory.terrainDataIndex[dataname] = threeMemory.terrainDataMemory.length - 1;
  } else {
    deleteTerrainData(threeMemory, dataname);
    threeMemory.terrainDataMemory.push(terrainObject);
    threeMemory.terrainDataIndex[dataname] = threeMemory.terrainDataMemory.length - 1;
  }
    threeMemory.Scene.add(terrainObject.scene);
    console.log({terrainObject});
}

async function setTerrain(threeMemory, terrainObject) {
  terrainObject.typeOfData = "terrain";
  terrainObject.dataname = terrainObject.name;
  terrainObject = terrainObject || { dataname: "mainTerrain" };
  const mapSource = terrainObject.src;
  const backgroundColor = terrainObject.bgColor || "#9cbdff";
  const groundColor = terrainObject.groundColor || "#9cbdff";

  if (terrainObject.fog) {
    setFog(threeMemory, terrainObject.fog);
  }

  if (!mapSource) {
    terrainObject.scene = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshPhongMaterial({ color: groundColor, depthWrite: false })
    );
    terrainObject.scene.rotation.x = -Math.PI / 2;
    terrainObject.scene.receiveShadow = true;
  } else {
    const gltf = await loader.loadAsync(mapSource);
    terrainObject.gltf = gltf;
    terrainObject.scene = gltf.scene;
    terrainObject.scene.scale.set(1, 1, 1);
    terrainObject.scene.receiveShadow = true;
  }

  threeMemory.Scene.background = new THREE.Color(backgroundColor);
  saveTerrainData(threeMemory, terrainObject);
  setTerrainLights(threeMemory, terrainObject.lights);
}

function setTerrainLights(threeMemory, terrainLights = []) {
  if (terrainLights.length > 0) {
    terrainLights.forEach((lightData, index) => {
      const newLightData = Object.assign({}, lightData);
      const lighting = Lights.createLight(newLightData);
      const { type, position, rotation } = newLightData;

      //set position
      if (position) lighting.position.set(position.x, position.y, position.z);

      //set rotation
      if (rotation) lighting.rotation.set(rotation.x, rotation.y, rotation.z);

      //add shadows
      if (type.includes("Dir") || type.includes("Point")) {
        lighting.castShadow = true;
      }

      //save light data
      newLightData.dataname = newLightData.type + `_t${index}`;
      newLightData.scene = lighting;
      Lights.saveLightData(threeMemory, newLightData);
    });
  } else {
    // If there are no lights use this default.
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d);
    hemiLight.position.set(0, 20, 0);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(3, 10, 10);
    dirLight.target.position.set(0, 0, 0);
    dirLight.castShadow = true;

    Lights.saveLightData(threeMemory, { dataname: "hemiLight", typeOfData: "light", scene: hemiLight });
    Lights.saveLightData(threeMemory, { dataname: "dirLight", typeOfData: "light", scene: dirLight });
  }
}

function setFog(threeMemory, { color = 0xa0a0a0, near = 20, far = 60 }) {
  threeMemory.Scene.fog = new THREE.Fog(color, near, far);
}

function setBackground(threeMemory, _backgroundColor) {
  const bg = _backgroundColor || 0xa0a0a0;
  threeMemory.Scene.background = new THREE.Color(bg);
}

export {
  setTerrain,
  saveTerrainData,
  deleteTerrainData,
  getTerrainData,
  terrainDataExists,
  setFog,
};
