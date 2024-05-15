import ThreeMemory from "./threeEngine/threeMemory.js";
import * as Scene from "./threeEngine/scene.js";
import * as Camera from "./threeEngine/camera.js";
import * as Terrain from "./threeEngine/terrain.js";
import * as Prefabs from "./threeEngine/prefabs.js";
import * as Gui from "./gui.js";
import * as Tools from "./utils/tools.js";

// import * as strings from "./utils/strings.js";

import exampleTerrain from "./utils/exampleTerrain.js";
import exampleSpecimen from "./utils/exampleSpecimen.js";
import addKeyboardControl from "./utils/keyboard.js";
import { playAnimation } from "./threeEngine/actions.js";

//----set up the specimen scene----//
const memory = new ThreeMemory();
const gtwy = "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/";
const specimenJson = Tools.htmlJsonExtract().data || exampleSpecimen;

document.addEventListener("DOMContentLoaded", async () => {
  const formAssets = getSpecimenAssets(specimenJson, 1);
  // HTML
  const specimenMugshot = gtwy + formAssets.mugshot.link;
  console.log({ specimenMugshot, specimenJson });
  Gui.populateSpecimenGui(specimenJson, 0, specimenMugshot);

  // Scene
  Scene.initScene(memory);
  Camera.initCamera(memory, 10, 5, 5);
  Scene.animate(memory);

  // add terrain
  await Terrain.setTerrain(memory, exampleTerrain);

  // add character
  const specDataName = Tools.crunchCase(exampleSpecimen.name);
  const prefabLink = gtwy + formAssets.prefab.link;
  const specPrefabData = await Prefabs.addModel(
    memory,
    specDataName,
    prefabLink
  );
  Prefabs.setFaceDirection(memory, specDataName, "n");

  // manage abilities
  console.log(specPrefabData.baseActions);
  playAnimation(specPrefabData, "idle");

  // add touch events

  // Move around
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
    abilities: spec.abilities.filter((ab) => ab.form == formNumber),
    mugshot: files.find((f) => f.content == "mugshot" && f.form == formNumber),
    prefab: files.find((f) => f.content == "prefab" && f.form == formNumber),
    terrain: files.find((f) => f.content == "prefab"),
    form,
  };
}
// console.log(getSpecimenAssets());
// form
// stats
// image
// prefab
// abilities

//----manage specimen DOM elements----//
// sidebar
// sidebar data
// loader
// ability button
// clear abilities

// var isSidebarOpen = false;
// isSidebarOpen ? null : toggleSidebar();

// var playAnim = null;

// const imagesFolder = "./images";
// const syncFunctions = {};

// // Function to handle the open and close of toggle.
// function toggleSidebar() {
//   var sidebar = document.getElementById("mySidebar");
//   var toggleBar = document.getElementById("toggleBarBtn");
//   var toggleBarBtn = document.getElementById("toggleBarBtn");
//   var isMobile = window.innerWidth <= 600;

//   if (isSidebarOpen) {
//     // close
//     toggleBarBtn.textContent = ">";
//     sidebar.style.height = isMobile ? "0" : "100%";
//     sidebar.style.width = isMobile ? "100%" : "0";

//     isMobile
//       ? (toggleBar.style.marginBottom = "0")
//       : (toggleBar.style.marginLeft = "0");
//   } else {
//     //open
//     toggleBarBtn.textContent = "X";
//     sidebar.style.height = isMobile ? "40%" : "100%";
//     sidebar.style.width = isMobile ? "100%" : "38%";

//     isMobile
//       ? (toggleBar.style.marginBottom = "40vh")
//       : (toggleBar.style.marginLeft = "38vw");
//   }

//   isSidebarOpen = !isSidebarOpen;
// }

// function toggleLoader(toggleOn, msg) {
//   const loaderDiv = document.getElementById("loader");
//   if (toggleOn) {
//     // turn on
//     loaderDiv.style.display = "block";
//   } else loaderDiv.style.display = "none"; // turn off

//   loaderMsg(msg || "Loading");
// }

// function loaderMsg(msg = "") {
//   const loaderTxt = document.getElementById("loaderTxt");
//   loaderTxt.textContent = msg;
// }

// function toggleFormBtns(left, right) {
//   document.getElementById("formBack").style.display = left
//     ? "block"
//     : "none";
//   document.getElementById("formNext").style.display = right
//     ? "block"
//     : "none";
// }

// function createAbilityButton(displayName, mods = {}) {
//   const abilityContainer = document.getElementById("abilityCont");

//   // Create the outer div
//   const abilDiv = document.createElement("div");
//   abilDiv.className = "abil col";

//   // Create and append the h2 element
//   const h2 = document.createElement("h2");
//   h2.textContent = displayName;
//   abilDiv.appendChild(h2);

//   // Create the wrapper div for abil_details
//   const wrapDiv = document.createElement("div");
//   wrapDiv.className = "row wrap";
//   abilDiv.appendChild(wrapDiv);

//   for (modType in mods) {
//     const modValue = Number(mods[modType]).toFixed(1);

//     const abilDetailDiv = document.createElement("div");
//     abilDetailDiv.className = "abil_detail row";

//     const img = document.createElement("img");
//     img.src = `${imagesFolder}/${modType}.png`;
//     img.alt = `${modType} icon symbol`;
//     abilDetailDiv.appendChild(img);

//     const p1 = document.createElement("p");
//     p1.textContent = String(modType).toUpperCase();
//     abilDetailDiv.appendChild(p1);

//     const p2 = document.createElement("p");
//     p2.textContent = String(modValue);
//     modValue < 1
//       ? (p2.style.color = "#de6969")
//       : (p2.style.color = "#69de69");
//     abilDetailDiv.appendChild(p2);
//     wrapDiv.appendChild(abilDetailDiv);
//   }

//   abilityContainer.appendChild(abilDiv);
//   return abilDiv;
// }

// function populateSpecimen(specimenObject, currentFormIndex = 0, mugshot) {
//   const { SID, description, forms } = specimenObject;
//   const form = forms[currentFormIndex];

//   // SID
//   document.getElementById("sidTxt").textContent = `SID: #${SID}`;
//   forms.length == 1 ? toggleFormBtns(false, false) : null;

//   // Info in specimen
//   for (key in specimenObject) {
//     const idName = key + "Txt";
//     const element = document.getElementById(idName);
//     if (element) {
//       element.textContent = specimenObject[key];
//     }
//   }

//   // info in form
//   for (key in form) {
//     const idName = key + "Txt";
//     const element = document.getElementById(idName);
//     if (!form[key]) continue;
//     if (element) {
//       element.textContent = form[key];
//     }
//   }

//   // shrink description txt
//   document.getElementById("descriptionTxt").textContent.length > 95
//     ? (document.getElementById("descriptionTxt").style.fontSize =
//         "x-small")
//     : null;

//   //add form text
//   document.getElementById("formTxt").textContent = `Form: ${
//     currentFormIndex + 1
//   } of ${forms.length}`;
//   document.getElementById("mugshotImg").src = mugshot;
// }

// function populateAbilities(abilityPack = [], animationFunction) {
//   abilityPack.forEach((anim) => {
//     if (anim) {
//       const { dataname, mods, name, status } = anim;
//       const div = createAbilityButton(name, mods);

//       div.addEventListener("click", (e) => {
//         e.preventDefault();
//         animationFunction(dataname, status);
//       });
//     }
//   });
// }

// function clearAbilities(){
//   const abilityContainer = document.getElementById("abilityCont");
//   abilityContainer.innerHTML = "";
// }
