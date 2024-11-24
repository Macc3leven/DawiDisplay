import { setBackground, setGradBackground, setFog } from "../modules/scene.js";
import { THREE, GLTFLoader } from "../threeWrapper.js";

const loader = new GLTFLoader(); // GLTFLoader initialized globally within the module

class Terrain {
  constructor(terrainData) {
    // rendering
    this.updateMethod = null;

    // information
    this.dataname = "defualtTerrain";
    this.bgColor = "#3d5f91";
    this.groundColor = "#1b1b1b";
    this.fog = { color: "#1b1b1b", near: 2, far: 40 };
    this.model = null;
    this.src = null;

    // lights
    this.lights = [
      {
        // Defualt lights
        type: "PointLight",
        color: 0xffcc66,
        intensity: 5,
        position: { x: 0, y: 2, z: 2 },
        distance: 100,
        decay: 1,
      },
      {
        type: "PointLight",
        color: 0xffcc66,
        intensity: 15,
        position: { x: 2, y: 6.5, z: -2 },
        distance: 300,
        decay: 1,
      },
    ];

    // this.initTerrain(terrainData)
  }

  async initTerrain(terrainData = {}) {
    this.typeOfData = "terrain";
    this.dataname = terrainData.name;
    this.src = terrainData.src;
    this.bgColor = terrainData.bgColor || this.bgColor;

    if (!this.src) {
      const groundColor = terrainData.groundColor || this.bgColor;
      this.model = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshPhongMaterial({ color: groundColor, depthWrite: false })
      );
      this.model.rotation.x = -Math.PI / 2;
      this.model.receiveShadow = true;
    } else {
      const gltf = await loader.loadAsync(this.src);
      this.model = gltf.scene;
      this.model.scale.set(1, 1, 1);
      this.model.receiveShadow = true;
    }
  }

  // defaultTerrain: returns a default terrainObj to give to terrain module.
  static defaultTerrain() {
    const terrain = {
      dataname: 'defaultTerrain',
      
    }
  }

  scale(decimal) {
    this.model.scale.set(decimal, decimal, decimal);
  }

  setAtmosphere(threeMemory) {
    console.log("atmo set");
    //set background
    if (typeof this.bgColor == "string") {
      console.log("atmo set bg");
      setBackground(threeMemory, this.bgColor);
    } else if (Array.isArray(this.bgColor)) {
      setGradBackground(threeMemory, this.bgColor[0], this.bgColor[1]);
    }

    //set fog
    if (this.fog) setFog(threeMemory, this.fog);
  }

  update(threeMemory, delta) {
    if (typeof this.updateMethod == "function") {
      //update method should return function or false;
      this.updateMethod = this.updateMethod(threeMemory, delta);
    }
  }
}

export default Terrain;
