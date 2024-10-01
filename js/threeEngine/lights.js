import { THREE } from "./threeWrapper.js";

function getLightData(threeMemory, dataname = "") {
  const index = threeMemory.lightDataIndex[dataname];
  return threeMemory.lightDataMemory[index];
}

function lightDataExists(threeMemory, dataname = "") {
  const index = threeMemory.lightDataIndex[dataname];
  return Boolean(index >= 0);
}

function deleteLightData(threeMemory, dataname = "") {
  const index = threeMemory.lightDataIndex[dataname];
  const lightCache = threeMemory.lightDataMemory[index].prefab;
  threeMemory.Scene.remove(lightCache);
  threeMemory.lightDataMemory.splice(index, 1);
  delete threeMemory.lightDataIndex[dataname];
  updateLightIndexes(threeMemory);
}

function updateLightIndexes(threeMemory) {
  threeMemory.lightDataMemory.forEach((el, idx) => {
    threeMemory.lightDataIndex[el.type] = idx;
  });
}

function saveLightData(threeMemory, lightObject) {
  const { dataname } = lightObject;
  if (!dataname) throw new Error("light has no 'dataname' property");
  const lightExists = lightDataExists(threeMemory, dataname);

  if (!lightExists) {
    threeMemory.lightDataMemory.push(lightObject);
    threeMemory.lightDataIndex[dataname] =
      threeMemory.lightDataMemory.length - 1;
  } else {
    deleteLightData(threeMemory, dataname);
    threeMemory.lightDataMemory.push(lightObject);
    threeMemory.lightDataIndex[dataname] =
      threeMemory.lightDataMemory.length - 1;
  }
  threeMemory.Scene.add(lightObject.scene);
}

//used for creating each light
function createLight(lightDataObject) {
  const { type, ...params } = lightDataObject;

  switch (type) {
    case "HemisphereLight":
      return new THREE.HemisphereLight(
        params.colorSky,
        params.colorGround,
        params.intensity
      );
    case "AmbientLight":
      return new THREE.AmbientLight(params.color, params.intensity);
    case "DirectionalLight":
      return new THREE.DirectionalLight(params.color, params.intensity);
    case "PointLight":
      return new THREE.PointLight(
        params.color,
        params.intensity,
        params.distance,
        params.decay
      );

    // Add cases for other light types...
    default:
      throw new Error(`Invalid light type: ${type}`);
  }
}

export {
  getLightData,
  lightDataExists,
  saveLightData,
  deleteLightData,
  createLight,
};
