import { THREE } from "../threeWrapper.js";

class Light {
  constructor(lightData) {
    this.dataType = "light";
    this.dataname = "light";
    this.model = null;
    this.updateMethod = null;
    this.initLight(lightData);
  }

  initLight(lightDataObject) {
    const { type, position, rotation, ...params } = lightDataObject;
  
    switch (type) {
      case "HemisphereLight":
        this.model = new THREE.HemisphereLight(
          params.colorSky,
          params.colorGround,
          params.intensity
        );
        break;
      case "AmbientLight":
        this.model = new THREE.AmbientLight(params.color, params.intensity);
        break;
      case "DirectionalLight":
        this.model = new THREE.DirectionalLight(params.color, params.intensity);
        break;
      case "PointLight":
        this.model = new THREE.PointLight(
          params.color,
          params.intensity,
          params.distance,
          params.decay
        );
        break;
      default:
        throw new Error(`Invalid light type: ${type}`);
    }
  
    // Apply position if provided
    if (position) {
      this.model.position.set(position.x || 0, position.y || 0, position.z || 0);
    }
  
    // Apply rotation if provided
    if (rotation && this.model.rotation) {
      this.model.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);
    }
  }
  

  update(delta) {
    if (typeof this.updateMethod == "function") {
      // update method should return function or false;
      this.updateMethod = this.updateMethod(delta);
    }
  }
}

export default Light;