import { THREE, OrbitControls } from "./threeEngine/threeWrapper.js";
import ThreeMemory from "./threeEngine/threeMemory.js";
import * as Scene from "./threeEngine/scene.js";
import * as Camera from "./threeEngine/camera.js";
import * as Terrain from "./threeEngine/terrain.js";
import * as Character from "./threeEngine/characters.js";
import * as Actions from "./threeEngine/characterActions.js";
import * as Projectiles from "./threeEngine/projectiles.js";
import * as Objects from "./threeEngine/objects.js"

import * as tools from "./utils/tools.js";
import * as strings from "./utils/strings.js";

import exampleTerrain from "./examples/exampleTerrain.js";
import exampleToken from "./examples/exampleToken.js";
import addKeyboardControl from "./utils/keyboard.js";

//----set up the specimen scene----//
const docData = tools.htmlJsonExtract();
const context = docData.assetContext || "local";
const memory = new ThreeMemory();
const publicGateway =
  "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/";
const tokenJson = docData.data || exampleToken;
const terrainJson = exampleTerrain;
const abilityCache = {};
var specimenDataName = "character";

// --- apply context --- //
function applyFileContext() {
  // mugshots
  const _mugshot =
    context == "ipfs"
      ? publicGateway + tokenJson.files.mugshot[context]
      : tokenJson.files.mugshot[context];
  tokenJson.files.mugshot = _mugshot;

  // Glbs
  for (const key in tokenJson.files.glb) {
    const _glb =
      context == "ipfs"
        ? publicGateway + tokenJson.files.glb[key][context]
        : tokenJson.files.glb[key][context];
    tokenJson.files.glb[key] = _glb;
  }

  console.log("file context applied", tokenJson.files.glb);
}
applyFileContext();

// - - - - - - - - - - - -
// DOM & Gui Management
// - - - - - - - - - - - -
var isSidebarOpen = false;

document.addEventListener("DOMContentLoaded", async () => {
  isSidebarOpen ? null : toggleSidebar();
});

// Function to handle the open and close of toggle.
const sideBarToggle = document.getElementById("toggleBarBtn");
tools.confirm(sideBarToggle, "No sidebar toggle detected");
sideBarToggle.addEventListener("click", (e) => {
  e.preventDefault();
  toggleSidebar();
});

function toggleSidebar() {
  var sidebar = document.getElementById("mySidebar");
  var toggleBar = document.getElementById("toggleBarBtn");
  var toggleBarBtn = document.getElementById("toggleBarBtn");
  var isMobile = window.innerWidth <= 600;

  if (isSidebarOpen) {
    // close
    toggleBarBtn.textContent = ">";
    sidebar.style.height = isMobile ? "0" : "100%";
    sidebar.style.width = isMobile ? "100%" : "0";

    isMobile
      ? (toggleBar.style.marginBottom = "0")
      : (toggleBar.style.marginLeft = "0");
  } else {
    //open
    toggleBarBtn.textContent = "X";
    sidebar.style.height = isMobile ? "40%" : "100%";
    sidebar.style.width = isMobile ? "100%" : "38%";

    isMobile
      ? (toggleBar.style.marginBottom = "40vh")
      : (toggleBar.style.marginLeft = "38vw");
  }

  isSidebarOpen = !isSidebarOpen;
}

// --- For toggling loading modal --- //
function toggleLoader(toggleOn, msg) {
  const loaderDiv = document.getElementById("loader");
  if (toggleOn) {
    // turn on
    loaderDiv.style.display = "block";
  } else loaderDiv.style.display = "none"; // turn off

  loaderMsg(msg || "Loading");
}

function loaderMsg(msg = "") {
  const loaderTxt = document.getElementById("loaderTxt");
  loaderTxt.textContent = msg;
}

// --- Populating the specimen info --- //
function updateTitleSection(token) {
  const { mugshot } = token.files;
  document.getElementById("nameTxt").textContent = token.name;
  document.getElementById(
    "formTxt"
  ).textContent = `Form: ${token.currentForm} of ${token.max_form}`;
  document.getElementById("sidTxt").textContent = `TokenID: ${token.sid}`;
  document.getElementById("mugshotImg").src = mugshot;
}

function updateInfoSection(token) {
  const description = document.getElementById("descriptionTxt");
  description.textContent = token.description;

  // Populate specimen info
  const attributes = [
    { title: "Build", key: "build" },
    { title: "Class", key: "class" },
    { title: "Skill", key: "skill" },
    { title: "Purg Lvl", key: "purg_lvl" },
  ];
  const stats = [
    { title: "Health", key: "health" },
    { title: "Attack", key: "attack" },
    { title: "Defense", key: "defense" },
    { title: "Stamina", key: "stamina" },
    { title: "Endurance", key: "endurance" },
    { title: "Agility", key: "agility" },
    { title: "Weight", key: "weight" },
  ];

  const attribContent = document.getElementById("attrib_content");
  for (const atr of attributes) {
    const newElement = document.createElement("div");
    newElement.className = "attrib";
    newElement.classList.add("row");
    const elemTitle = document.createElement("h3");
    elemTitle.textContent = atr.title;
    const elemValue = document.createElement("p");
    elemValue.textContent = token[atr.key]; // the attribute value
    newElement.appendChild(elemTitle);
    newElement.appendChild(elemValue);
    attribContent.appendChild(newElement);
  }
  const statContent = document.getElementById("stat_content");
  for (const stat of stats) {
    const newElement = document.createElement("div");
    newElement.className = "attrib";
    newElement.classList.add("row");
    const elemTitle = document.createElement("h3");
    elemTitle.textContent = stat.title;
    const elemValue = document.createElement("p");
    elemValue.textContent = token[stat.key]; // the attribute value
    newElement.appendChild(elemTitle);
    newElement.appendChild(elemValue);
    statContent.appendChild(newElement);
  }
}

function _createAbilityButton(ability) {
  const { displayName, mods } = ability;
  const abilityContainer = document.getElementById("ability_content");
  const categoryColors = {
    strike: "#e29300",
    ultstrike: "#a34c3f",
    alter: "#c218ff",
  };

  // Create the outer div
  const card = document.createElement("div");
  card.className = "ability-card";

  // Create title
  const title = document.createElement("div");
  title.className = "abiliy-header";
  title.textContent = displayName;
  card.appendChild(title);

  // Create the wrapper div for ability info
  const info = document.createElement("div");
  info.className = "ability-info";

  // populate ability info
  const category = document.createElement("span");
  category.textContent = strings.capFirstLetter(ability.category);
  category.style.color = categoryColors[ability.category.toLowerCase()];
  info.appendChild(category);

  const separator1 = document.createElement("span");
  separator1.textContent = "|";
  info.appendChild(separator1);

  const skillType = document.createElement("span");
  skillType.textContent = strings.capFirstLetter(ability.skillType);
  info.appendChild(skillType);

  const separator2 = document.createElement("span");
  separator2.textContent = "|";
  info.appendChild(separator2);

  const style = document.createElement("span");
  style.textContent = ability.style.toUpperCase();
  info.appendChild(style);
  card.appendChild(info);

  // create mod element
  const modsContainer = document.createElement("div");
  modsContainer.className = "ability-mods";

  for (const key in mods) {
    var value = mods[key];
    var strValue = (value * 100 - 100).toFixed(0);
    var color = value >= 1 ? "#1dffb740" : "#ff1d1d40";

    const mod = document.createElement("div");
    mod.className = "ability-mod";
    mod.style.backgroundColor = color || "#777";

    const modType = document.createElement("p");
    modType.textContent = key.toUpperCase();
    mod.appendChild(modType);

    const modValue = document.createElement("p");
    modValue.textContent = value > 1 ? `+${strValue}%` : `${strValue}%`;
    mod.appendChild(modValue);
    modsContainer.appendChild(mod);
  }

  card.appendChild(modsContainer);
  abilityContainer.appendChild(card);
  return card;
}

function updateAbilitySection(token) {
  const { abilities } = token;
  if (!abilities) {
    throw new Error("Abilities missing from token");
  }

  for (const ab of abilities) {
    const card = _createAbilityButton(ab);

    // add ability to cache
    abilityCache[ab.name] = card;
  }
}

/** Function should populate the entire specimen gui */
function populateTokenInfo(token = tokenJson) {
  updateTitleSection(token);
  updateInfoSection(token);
  updateAbilitySection(token);
}
populateTokenInfo();

// - - - - - - - - - - - -
// Three Js functionality
// - - - - - - - - - - - -
document.addEventListener("DOMContentLoaded", async () => {
  const currentGlbObject = tokenJson.files.glb; // Glb object
  const terrainObject = terrainJson; // Terrain Object
  toggleLoader(true, "loading scene");

  // --- Scene --- //
  const container = document.body;
  memory.Scene = new THREE.Scene();
  memory.Clock = new THREE.Clock();
  const bgColor = 0xa0a0a0;
  const fogColor = 0xa0a0a0;
  memory.Scene.background = new THREE.Color(bgColor);
  memory.Scene.fog = new THREE.Fog(fogColor, 20, 90);

  memory.Renderer = new THREE.WebGLRenderer({ antialias: true });
  memory.Renderer.setPixelRatio(window.devicePixelRatio);
  memory.Renderer.setSize(window.innerWidth, window.innerHeight);
  memory.Renderer.shadowMap.enabled = true;
  memory.Renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(memory.Renderer.domElement);
  memory.Canvas = memory.Renderer.domElement;

  // Camera init
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1.0;
  const far = 100;
  memory.ClientCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  memory.ClientCamera.position.set(10, 5, 5);
  memory.Controls = new OrbitControls(
    memory.ClientCamera,
    memory.Renderer.domElement
  );
  memory.Controls.enablePan = true;
  memory.Controls.enableZoom = true;
  memory.Controls.update();

  initWindowResize(memory.ClientCamera, memory.Renderer);
  animate(memory);

  // --- add terrain --- //
  loaderMsg("loading terrain");
  await Terrain.setTerrain(memory, exampleTerrain);

  // --- Character Base Model --- //
  loaderMsg("loading specimen model");
  const characterData = await loadModel(currentGlbObject);

  // --- manage abilities & animations --- //
  syncAbilities(characterData);

  // add keyboard events
  let directionIndex = 0;
    

  addKeyboardControl({
    a: () => {
      characterData.model.position.x += 1;
      console.log(characterData.model.position);
    },
    d: () => {
      characterData.model.position.x -= 1;
      console.log(characterData.model.position);
    },
    w: () => {
      Objects.moveInDirection(characterData.model, Objects.compass.n, 2)
    },
    space: () => {
      const direction = Object.keys(Objects.compass)[directionIndex];
      if (directionIndex > Object.keys(Objects.compass).length) {
        directionIndex+= 1
      } else directionIndex = 0;
      Character.setFaceDirection(memory, characterData.dataname, direction)
      console.log(direction, Object.keys(Objects.compass).length);
    },
    e: () => {
      const direction = Object.keys(Objects.compass)[directionIndex];
      Objects.moveInDirection(characterData.model, Objects.compass[direction], 2);
    }

  });

  // add touch events using hammer (coming soon..)
});

async function loadModel(currentGlbObject) {
  loaderMsg("loading specimen model");
  const characterName = strings.crunchCase(tokenJson.name);
  const characterData = await Character.addModel(
    memory,
    characterName,
    currentGlbObject
  );
  Character.setFaceDirection(memory, characterName, "n");
  characterData.target.z = 9;
  Actions.playAnimationOnce(characterData, "idle");
  toggleLoader(false);

  return characterData;
}

function syncAbilities(characterData) {
  const { abilities } = tokenJson;
  const afterAbility = () => Actions.playAnimationOnce(characterData, "idle");
  for (const ab of abilities) {
    const { name, projectile } = ab;

    // add projectiles to model if any
    if (projectile) {
      projectile.name = ab.name;
      projectile.owner = characterData.dataname;

      Projectiles.addProjectileToMemory(memory, projectile);
    }

    // append functionality to buttons
    abilityCache[name].addEventListener("click", (e) => {
      e.preventDefault();
      Actions.playAbility(memory, characterData, ab, afterAbility);
    });
  }
}

function initWindowResize(_camera, _renderer) {
  //window resize
  window.onresize = function () {
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();
    _renderer.setSize(window.innerWidth, window.innerHeight);
  };
}

function animate(threeMemory) {
  requestAnimationFrame(() => animate(threeMemory));
  threeMemory.Renderer.render(threeMemory.Scene, threeMemory.ClientCamera);

  // Example updating character animations
  if (threeMemory.characterDataStorage.length > 0) {
    const mixerUpdateDelta = threeMemory.Clock.getDelta();
    threeMemory.characterDataStorage.forEach((character) => {
      if (character.mixer) character.mixer.update(mixerUpdateDelta);
    });
  }
}
