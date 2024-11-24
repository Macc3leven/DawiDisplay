import Character from "../prototypes/Character.js";

/**
 * Adds a character to ThreeMemory and the Three.js Scene.
 * @param {ThreeMemory} threeMemory - The ThreeMemory instance managing the scene and memory.
 * @param {Object} characterData - Data to initialize the character (e.g., model path, dataname).
 */
export async function addCharacter(threeMemory, characterData) {
  const { dataname } = characterData;
  if (!dataname)
    throw new Error("Character data must have a 'dataname' property");

  // Remove the existing character if it exists
  if (threeMemory.characterDataIndex[dataname] !== undefined) {
    deleteCharacter(threeMemory, dataname);
  }

  // Create the character using the Character prototype
  const character = new Character(characterData);
  await character.loadModel(characterData.glbObj); // await strategy

  // Save to ThreeMemory
  threeMemory.characterDataMemory.push(character);
  threeMemory.characterDataIndex[dataname] =
    threeMemory.characterDataMemory.length - 1;

  // Add the character's model to the Three.js Scene
  threeMemory.Scene.add(character.model);
  return character;
}

/**
 * Removes a character from ThreeMemory and the Three.js Scene.
 * @param {ThreeMemory} threeMemory - The ThreeMemory instance.
 * @param {string} dataname - The name of the character to remove.
 */
export function deleteCharacter(threeMemory, dataname) {
  const index = threeMemory.characterDataIndex[dataname];
  if (index === undefined) return; // Character not found

  // Remove the character's model from the Three.js Scene
  const character = threeMemory.characterDataMemory[index];
  threeMemory.Scene.remove(character.model);

  // Remove from memory
  threeMemory.characterDataMemory.splice(index, 1);
  delete threeMemory.characterDataIndex[dataname];

  // Update indices
  updateCharacterIndices(threeMemory);
}

export function updateCharacterIndices(threeMemory) {
  threeMemory.characterDataIndex = {};
  threeMemory.characterDataMemory.forEach((character, index) => {
    threeMemory.characterDataIndex[character.dataname] = index;
  });
}

export function findCharacter(threeMemory, dataname) {
  const index = threeMemory.characterDataIndex[dataname];
  return index !== undefined ? threeMemory.characterDataMemory[index] : null;
}
