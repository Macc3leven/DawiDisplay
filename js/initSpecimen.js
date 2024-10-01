import ThreeMemory from "./threeEngine/threeMemory.js";
import * as Scene from "./threeEngine/scene.js";
import * as Camera from "./threeEngine/camera.js";
import * as Terrain from "./threeEngine/terrain.js";
import * as Prefabs from "./threeEngine/prefabs.js";
import * as Actions from "./threeEngine/actions.js";

import * as Gui from "./gui.js";
import * as tools from "./utils/tools.js";
import * as strings from "./utils/strings.js";

import exampleTerrain from "./examples/exampleTerrain.js";
import exampleSpecimen from "./examples/exampleSpecimen.js";
import addKeyboardControl from "./utils/keyboard.js";

//----set up the specimen scene----//
const memory = new ThreeMemory();
const gtwy = "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/";
const specimenJson = tools.htmlJsonExtract().data || exampleSpecimen;

document.addEventListener("DOMContentLoaded", async () => {
  // Specimen Object
  const formAssets = getSpecimenAssets(specimenJson, 1);

  // HTML
  const specimenMugshot = gtwy + formAssets.mugshot.link;
  Gui.populateSpecimenGui(specimenJson, 0, specimenMugshot);

  // Scene
  Scene.initScene(memory);
  Camera.setCameraPosition(memory, 10, 5, 5);

  // add terrain
  await Terrain.setTerrain(memory, exampleTerrain);

  // add character
  const specDataName = tools.crunchCase(exampleSpecimen.name);
  const prefabLink = gtwy + formAssets.prefab.link;
  const specPrefabData = await Prefabs.addModel(
    memory,
    specDataName,
    prefabLink
  );
  Prefabs.setFaceDirection(memory, specDataName, "n");

  // manage abilities
  
  // add touch events (coming soon..)

  // Move around (coming soon...)

  // test
  const keyboardObj = {};
  keyboardObj.a = () => {
    console.log("camLoc", memory.ClientCamera.position.clone());
  };
  keyboardObj.s = () => {
    console.log(memory.prefabDataMemory);
    playAnimation(specPrefabData, "idle");
  };

  addKeyboardControl(keyboardObj);
});

// scene*
// camera*
// terrain*
// characters*
// animations

//----retrieve specimen json data----//
function getSpecimenAssets(spec = exampleSpecimen, formNumber = 1) {
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


