// SceneController.js
import ThreeMemory from "../threeEngine/threeMemory.js";
import { Character } from "../threeEngine/Character.js";

class SceneController {
    constructor() {
        // terrain
        
        // tiles

    this.threeMemory = new ThreeMemory();
    this.characters = [];
  }

  // strike(sender, target)

  // defend(sender)

  // Spawn(sender)
  addCharacter(characterData) {
    const character = new Character(characterData, (loadedCharacter) => {
      this.characters.push(loadedCharacter);
      this.threeMemory.prefabDataMemory.push(loadedCharacter); // Store reference in memory
      this.threeMemory.Scene.add(loadedCharacter.model.scene); // Add to Three.js scene
    });
  }

  // Death(sender)
  removeCharacter(dataname) {
    const index = this.characters.findIndex(
      (char) => char.dataname === dataname
    );
    if (index !== -1) {
      const character = this.characters[index];
      this.threeMemory.Scene.remove(character.model.scene); // Remove from scene
      this.threeMemory.prefabDataMemory.splice(index, 1); // Remove from memory
      this.characters.splice(index, 1); // Remove from list
    }
  }

  update(delta) {
    this.characters.forEach((character) => character.update(delta));
  }
}

export default SceneController;
