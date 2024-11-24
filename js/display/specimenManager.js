import ThreeMemory from "../threeEngine2/prototypes/ThreeMemory.js";
import * as scene from "../threeEngine2/modules/scene.js";
// import * as camera from "../threeEngine2/modules/camera.js";
import * as terrain from "../threeEngine2/modules/terrains.js";
import * as characters from "../threeEngine2/modules/characters.js";
// import * as Gui from "../gui.js";
import * as Tools from "../utils/tools.js";
// import * as strings from "../utils/strings.js";

import exampleTerrain from "../utils/exampleTerrain.js";
import exampleSpecimen from "../utils/exampleSpecimen.js";
// import addKeyboardControl from "../utils/keyboard.js";


//----set up the specimen scene----//
const memory = new ThreeMemory();
const gtwy = "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/";
const specimenJson = exampleSpecimen;

document.addEventListener("DOMContentLoaded", async () => {

  // scene
  scene.initScene(memory);

  // terrain
  exampleTerrain.dataname = "mainTerrain";
  const newTerrain = await terrain.addTerrain(memory, exampleTerrain);
  newTerrain.setAtmosphere(memory);
  newTerrain.scale(0.25);
  scene.deleteDefaultScene(memory);

  // character
  const characterData = {
    dataname: exampleSpecimen.name,
    glbObj: exampleSpecimen.assets_cloud.glb,
  };

  const newCharacter = await characters.addCharacter(memory, characterData);
  newCharacter.idle();

  // camera
  memory.ClientCamera.setZoomLimit(1, 20);
  // setTimeout(() => {
  //   newCharacter.setRotation("e");
  //   memory.ClientCamera.lockBehindCharacter(newCharacter, 2000);
  // }, 2000);














  // // add character
  // const specDataName = Tools.crunchCase(specimenJson.name);
  // const prefabLink = gtwy + formAssets.prefab.link;
  // const speccharacterData = await Prefabs.addModel(
  //   memory,
  //   specDataName,
  //   prefabLink
  // );
  // Prefabs.setFaceDirection(memory, specDataName, "n");

  // // manage abilities

  // // list what abilities are in json that are not present in the model
  // const allModelAnims = Object.keys(speccharacterData.baseActions);
  // const allJsonAbilities = formAssets.abilities.map(ab => ab.dataname);
  // // console.log({ allModelAnims, allJsonAbilities }, formAssets.abilities);
  // allJsonAbilities.forEach(dataname => {
  //   const abilityPresent = allModelAnims.some(element => element.includes(dataname));
  //   const answ = abilityPresent ? 'is' : 'is NOT';
  //   console.log(`ability with dataname '${dataname}' ${answ} in model`);
  // })

  // playAnimation(speccharacterData, "idle");
});

// scene*
// camera*
// terrain*
// characters*
// animations

//----retrieve specimen json data----//
// function getSpecimenAssets(spec = specimenJson, formNumber = 1) {
//   const { files } = spec;
//   const form = spec.forms[formNumber - 1];

//   return {
//     abilities: spec.abilities.filter(
//       (ab) => ab.form == formNumber || ab.form.includes("*")
//     ),
//     mugshot: files.find((f) => f.content == "mugshot" && f.form == formNumber)
//       .link,
//     prefab: files.find((f) => f.content == "prefab" && f.form == formNumber)
//       .link,
//     terrain: files.find((f) => f.content == "prefab").link,
//     form,
//   };
// }

// function getTokenOsAssets(token) {
//   const { prefab, image, abilities, terrain } = token;

//   return {
//     abilities,
//     mugshot: image.replace("ipfs://", gtwy),
//     prefab,
//     terrain,
//   };
// }

// function getTokenLiteAssets(token) {
//   const { prefab, image, abilities, terrain } = token;

//   return {
//     abilities,
//     mugshot: image.replace("ipfs://", gtwy),
//     prefab,
//     terrain,
//   };
// }
