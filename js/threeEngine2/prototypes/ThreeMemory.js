class ThreeMemory {
  constructor() {
    this.Scene;
    this.Renderer;
    this.ClientCamera;
    this.Controls;
    this.Clock;

    // modules memory
    this.characterDataIndex = {};
    this.characterDataMemory = [];

    this.lightDataIndex = {};
    this.lightDataMemory = [];

    this.terrainDataIndex = {};
    this.terrainDataMemory = [];
  }
}


export default ThreeMemory;
