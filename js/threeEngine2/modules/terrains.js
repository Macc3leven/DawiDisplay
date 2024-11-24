import Terrain from "../prototypes/Terrain.js";
import { addManyLights } from "./lights.js";

/**
 * Adds a terrain to ThreeMemory and the Three.js Scene.
 */
export async function addTerrain(threeMemory, terrainData) {
  const { dataname } = terrainData;
  if (!dataname) throw new Error("Terrain data must have a 'dataname' property");

  // Remove the existing terrain if it exists
  if (threeMemory.terrainDataIndex[dataname] !== undefined) {
    deleteTerrain(threeMemory, dataname);
  }

  // Create the terrain using the Terrain prototype
  const terrain = new Terrain(terrainData);
  await terrain.initTerrain(terrainData);

  // Save to ThreeMemory
  threeMemory.terrainDataMemory.push(terrain);
  threeMemory.terrainDataIndex[dataname] = threeMemory.terrainDataMemory.length - 1;

  // Add the terrain's model to the Three.js Scene
  threeMemory.Scene.add(terrain.model);
  addManyLights(threeMemory, terrain.lights);
  return terrain;
}

/**
 * Removes a terrain from ThreeMemory and the Three.js Scene.
 */
export function deleteTerrain(threeMemory, dataname) {
  const index = threeMemory.terrainDataIndex[dataname];
  if (index === undefined) return; // Terrain not found

  // Remove the terrain's model from the Three.js Scene
  const terrain = threeMemory.terrainDataMemory[index];
  threeMemory.Scene.remove(terrain.model);

  // Remove from memory
  threeMemory.terrainDataMemory.splice(index, 1);
  delete threeMemory.terrainDataIndex[dataname];

  // Update indices
  updateTerrainIndices(threeMemory);
}

function updateTerrainIndices(threeMemory) {
  threeMemory.terrainDataIndex = {};
  threeMemory.terrainDataMemory.forEach((terrain, index) => {
    threeMemory.terrainDataIndex[terrain.dataname] = index;
  });
}

export function findTerrain(threeMemory, dataname) {
  const index = threeMemory.terrainDataIndex[dataname];
  return index !== undefined ? threeMemory.terrainDataMemory[index] : null;
}
