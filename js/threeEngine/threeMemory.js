class ThreeMemory {
  constructor() {
    this.Scene;
    this.Renderer;
    this.ClientCamera;
    this.Controls;
    this.Clock;

    // modules memory
    this.prefabDataIndex = {}
    this.prefabDataMemory = []

    this.lightDataIndex = {}
    this.lightDataMemory = []

    this.terrainDataIndex = {}
    this.terrainDataMemory = []
  }
  
}


export default ThreeMemory;
