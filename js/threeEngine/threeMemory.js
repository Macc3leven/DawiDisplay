class ThreeMemory {
  constructor() {
    this.Scene;
    this.Renderer;
    this.ClientCamera;
    this.Controls;
    this.Clock;

    //global mixers
    this.mixers = [];

    // modules memory
    this.characterDataStorage = []
    this.projectileDataStorage = []

    this.lightDataIndex = {}
    this.lightDataMemory = []

    this.terrainDataIndex = {}
    this.terrainDataMemory = []
  }
  
}


export default ThreeMemory;
