var isSidebarOpen = false;
const imagesFolder = "./images";
const syncFunctions = {};

document.addEventListener("DOMContentLoaded", async () => {
  isSidebarOpen ? null : toggleSidebar();
});

// Function to handle the open and close of toggle.
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

function toggleFormBtns(left, right) {
  document.getElementById("formBack").style.display = left ? "block" : "none";
  document.getElementById("formNext").style.display = right ? "block" : "none";
}

function createAbilityButton(displayName, mods = {}) {
  const abilityContainer = document.getElementById("abilityCont");

  // Create the outer div
  const abilDiv = document.createElement("div");
  abilDiv.className = "abil col";

  // Create and append the h2 element
  const h2 = document.createElement("h2");
  h2.textContent = displayName;
  abilDiv.appendChild(h2);

  // Create the wrapper div for abil_details
  const wrapDiv = document.createElement("div");
  wrapDiv.className = "row wrap";
  abilDiv.appendChild(wrapDiv);

  for (modType in mods) {
    const modValue = Number(mods[modType]).toFixed(1);

    const abilDetailDiv = document.createElement("div");
    abilDetailDiv.className = "abil_detail row";

    const img = document.createElement("img");
    img.src = `${imagesFolder}/${modType}.png`;
    img.alt = `${modType} icon symbol`;
    abilDetailDiv.appendChild(img);

    const p1 = document.createElement("p");
    p1.textContent = String(modType).toUpperCase();
    abilDetailDiv.appendChild(p1);

    const p2 = document.createElement("p");
    p2.textContent = String(modValue);
    modValue < 1 ? (p2.style.color = "#de6969") : (p2.style.color = "#69de69");
    abilDetailDiv.appendChild(p2);
    wrapDiv.appendChild(abilDetailDiv);
  }

  abilityContainer.appendChild(abilDiv);
  return abilDiv;
}

function populateSpecimenGui(specimenObject, currentFormIndex = 0, mugshot) {
  const { SID, description, forms } = specimenObject;
  const form = forms[currentFormIndex];

  // SID
  document.getElementById("sidTxt").textContent = `SID: #${SID}`;

  // Description
  document.getElementById("descriptionTxt").textContent = description;

  // Info in specimen
  for (const key in specimenObject) {
    const idName = key + "Txt";
    const element = document.getElementById(idName);
    if (element) {
      element.textContent = specimenObject[key];
    }
  }

  // info in form
  for (const key in form) {
    const idName = key + "Txt";
    const element = document.getElementById(idName);
    if (!form[key]) console.log(`there is no form.${key}`);
    if (element) {
      element.textContent = form[key];
    }
  }

  // shrink description txt
  document.getElementById("descriptionTxt").textContent.length > 95
    ? (document.getElementById("descriptionTxt").style.fontSize = "x-small")
    : null;

  // form details
  const formText = document.getElementById("formTxt");
  formText.textContent = `Form: ${currentFormIndex + 1} of ${forms.length}`;

  const formSwitchDiv = document.getElementById("formDiv");
  // forms.length == 1 ? formSwitchDiv.remove() : null;
  // forms.length == 1 ? toggleFormBtns(false, true) : null;

  // add mugshot
  document.getElementById("mugshotImg").src = mugshot;
}

function populateTokenGui() {}

function populateAbilities(abilityList = [], animationFunction) {
  abilityList.forEach((anim) => {
    if (anim) {
      const { dataname, mods, name, status } = anim;
      const div = createAbilityButton(name, mods);

      div.addEventListener("click", (e) => {
        e.preventDefault();
        animationFunction(dataname, status);
      });
    }
  });
}

function clearAbilities() {
  const abilityContainer = document.getElementById("abilityCont");
  abilityContainer.innerHTML = "";
}

export {
  populateSpecimenGui,
  populateAbilities,
  clearAbilities,
  toggleLoader,
  toggleFormBtns,
};
