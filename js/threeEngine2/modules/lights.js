import Light from "../prototypes/Light.js";
let lightNameGen = 1;

/**
 * Adds a light to ThreeMemory and the Three.js Scene. 
 * */
export function addLight(threeMemory, lightData) {
  const { dataname } = lightData;
  if (!dataname) {
    lightData.dataname = `light_${lightNameGen}`;
    lightNameGen++;
  };

  // Remove the existing light if it exists
  if (threeMemory.lightDataIndex[dataname] !== undefined) {
    deleteLight(threeMemory, dataname);
  }

  // Create the light using the Light prototype
  const light = new Light(lightData);

  // Save to ThreeMemory
  threeMemory.lightDataMemory.push(light);
  threeMemory.lightDataIndex[dataname] = threeMemory.lightDataMemory.length - 1;

  // Add the light's model to the Three.js Scene
  threeMemory.Scene.add(light.model);
}

export function addManyLights(threeMemory, lightDataArray=[]) {
  lightDataArray.forEach((lightData, indx) => {
    lightData.dataname = `light${indx}`;
    addLight(threeMemory, lightData);
  });
}

/**
 * Removes a light from ThreeMemory and the Three.js Scene.
 */
export function deleteLight(threeMemory, dataname) {
  const index = threeMemory.lightDataIndex[dataname];
  if (index === undefined) return; // Light not found

  // Remove the light's model from the Three.js Scene
  const light = threeMemory.lightDataMemory[index];
  threeMemory.Scene.remove(light.model);

  // Remove from memory
  threeMemory.lightDataMemory.splice(index, 1);
  delete threeMemory.lightDataIndex[dataname];

  // Update indices
  updateLightIndices(threeMemory);
}
export function deleteAllLights(threeMemory) {
  threeMemory.lightDataMemory.forEach(light => {
    deleteLight(threeMemory, light.dataname)
  });
}



function updateLightIndices(threeMemory) {
  threeMemory.lightDataIndex = {};
  threeMemory.lightDataMemory.forEach((light, index) => {
    threeMemory.lightDataIndex[light.dataname] = index;
  });
}

export function findLight(threeMemory, dataname) {
  const index = threeMemory.lightDataIndex[dataname];
  return index !== undefined ? threeMemory.lightDataMemory[index] : null;
}
