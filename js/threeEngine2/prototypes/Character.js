import { THREE, GLTFLoader } from "../threeWrapper.js";
import * as actions from "../modules/actions.js";
import { setToCompassDirection } from "../modules/compass.js";
import { hasProperties } from "../../utils/security.js";

function verifySrc(glbObject) {
  for (const key in glbObject) {
    const src = glbObject[key];
    if (!src || typeof src !== "string") {
      throw new Error(`Invalid glb source ${key}`);
    }
  }
}

class Character {
  constructor(characterData) {
    hasProperties(characterData, "dataname src glbObject");

    this.dataType = "character";
    this.dataname = characterData.dataname;
    this.model = null;
    this.mixer = null;
    this.animations = null;
    this.baseActions = {};
    this.isLoaded = false;
    this.projectile = false;
    this.src = characterData.src;
  }

  // loaders
  async loadModel(glbObject={}) {
    // console.log("my", glbObject);
    hasProperties(glbObject, "basemodel");
    verifySrc(glbObject);
    const loader = new GLTFLoader();
    console.log('fetching base model...');

    // load basemodel //"./models/cloud-ogre-browser.glb"
    const basemodelSRC = glbObject["basemodel"];
    const basemodelGLTF = await loader.loadAsync(basemodelSRC);

    // add shadows
    basemodelGLTF.scene.traverse((object) => {
      if (object.isMesh) object.castShadow = true;
    });

    this.model = basemodelGLTF.scene;
    this.mixer = new THREE.AnimationMixer(this.model);
    console.log('fetching animations...');

    // load glb object
    for (const key in glbObject) {
      const src = glbObject[key];

      // handle animations
      if (key !== "basemodel") {
        const gltf = await loader.loadAsync(src);
        const animation = gltf.animations[0]; // assumes only one animation in each glb

        if (animation) {
          this.baseActions[key] = this.mixer.clipAction(animation);
        } else {
          console.error(
            `CorruptGLB: ${this.dataname} has an error within animation "${key}"`
          );
        }

        console.log("BaseActions", this.baseActions)
      }
    }

    this.isLoaded = true;
  }

  //---set
  setRotation(compassDirection = "n") {
    setToCompassDirection(this.model, compassDirection);
  }

  //---information
  // height
  getHeight() {
    const objectBoundingBox = new THREE.Box3().setFromObject(this.model);
    const objectHeight = objectBoundingBox.max.y - objectBoundingBox.min.y;
    return objectHeight;
  }

  getWidth() {
    const objectBoundingBox = new THREE.Box3().setFromObject(this.model);
    const objectHeight = objectBoundingBox.max.x - objectBoundingBox.min.x;
    return objectHeight;
  }

  // logLocations
  getLoc() {
    const model = this.model;

    console.log(
      `prefab: ${this.dataname}`,
      "\n POSITION",
      model.position.x,
      model.position.y,
      model.position.z,

      "\n ROTATION",
      model.rotation.x,
      model.rotation.y,
      model.rotation.z
    );
  }

  //---animations
  run() {
    actions.repeatAnimation(this, "run", 100);
  }

  stopRun() {
    actions.stopAnimation(this, "run");
  }

  jump() {
    actions.playAnimation(this, "jump");
  }

  block() {
    // repeatAnimation(this, 'block', 100);
    // play animation and clamp
  }

  idle() {
    actions.playAnimation(this, "idle");
  }

  stk() {
    actions.playAnimation(this, "stk");
  }

  prj() {
    actions.playAnimation(this, 'prj');
  }

  //stk
  //prj
  //alt
  //evadeL
  //evadeR
  //faint

  playAnimation(animationName) {
    actions.playAnimation(this, animationName);
  }

  stopAnimation(animationName) {
    actions.stopAnimation(this, animationName);
  }

  update(delta) {
    if (this.isLoaded) {
      actions.updateMixer(this.model, delta);
      if (this.projectile) {
        actions.updateMixer(this.projectile.model, delta);
      }
    }
  }
}

export default Character;
