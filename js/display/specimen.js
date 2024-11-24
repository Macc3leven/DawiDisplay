import ThreeMemory from "../threeEngine/threeMemory.js";
import * as Scene from "../threeEngine/scene.js";
import * as Camera from "../threeEngine/camera.js";
import * as Terrain from "../threeEngine/terrain.js";
import * as Prefabs from "../threeEngine/Characters.js";
// import * as Gui from "../gui.js";
import * as Tools from "../utils/tools.js";
// import * as strings from "../utils/strings.js";

import exampleTerrain from "../utils/exampleTerrain.js";
import exampleSpecimen from "../utils/exampleSpecimen.js";
// import addKeyboardControl from "../utils/keyboard.js";
import { playAnimation } from "../threeEngine/actions.js";

//----set up the specimen scene----//
const memory = new ThreeMemory();
const gtwy = "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/";
const specimenJson = exampleSpecimen;

document.addEventListener("DOMContentLoaded", async () => {
  // Specimen Object
  const formAssets = getSpecimenAssets(specimenJson, 1);

  // HTML
  const specimenMugshot = gtwy + formAssets.mugshot.link;

  // Scene
  Scene.initScene(memory);
  Camera.setCameraPosition(memory, 10, 5, 5);

  // add terrain
  await Terrain.setTerrain(memory, exampleTerrain);

  // add character
  const specDataName = Tools.crunchCase(specimenJson.name);
  const prefabLink = gtwy + formAssets.prefab.link;
  const speccharacterData = await Prefabs.addModel(
    memory,
    specDataName,
    prefabLink
  );
  Prefabs.setFaceDirection(memory, specDataName, "n");

  // manage abilities

  // list what abilities are in json that are not present in the model
  const allModelAnims = Object.keys(speccharacterData.baseActions);
  const allJsonAbilities = formAssets.abilities.map(ab => ab.dataname);
  // console.log({ allModelAnims, allJsonAbilities }, formAssets.abilities);
  allJsonAbilities.forEach(dataname => {
    const abilityPresent = allModelAnims.some(element => element.includes(dataname));
    const answ = abilityPresent ? 'is' : 'is NOT';
    console.log(`ability with dataname '${dataname}' ${answ} in model`);
  })

  playAnimation(speccharacterData, "idle");

  // add touch events (coming soon..)

  // Move around (coming soon...)

  // test
  // const keyboardObj = {};

  // keyboardObj.a = () => {
  //   console.log("camLoc", memory.ClientCamera.position.clone());
  // };

  // keyboardObj.s = () => {
  //   console.log(memory.characterDataMemory);
  //   playAnimation(speccharacterData, "idle");
  // };

  // addKeyboardControl(keyboardObj);
});

// scene*
// camera*
// terrain*
// characters*
// animations

//----retrieve specimen json data----//
function getSpecimenAssets(spec = specimenJson, formNumber = 1) {
  const { files } = spec;
  const form = spec.forms[formNumber - 1];

  return {
    abilities: spec.abilities.filter((ab) => ab.form == formNumber || ab.form.includes("*")),
    mugshot: files.find((f) => f.content == "mugshot" && f.form == formNumber),
    prefab: files.find((f) => f.content == "prefab" && f.form == formNumber),
    terrain: files.find((f) => f.content == "prefab"),
    form,
  };
}

function getTokenOsAssets(token) {
  const { prefab, image, abilities, terrain } = token;

  return {
    abilities,
    mugshot: image.replace("ipfs://", gtwy),
    prefab,
    terrain,
  };
}

function getTokenLiteAssets(token) {
  const { prefab, image, abilities, terrain } = token;

  return {
    abilities,
    mugshot: image.replace("ipfs://", gtwy),
    prefab,
    terrain,
  };
}


