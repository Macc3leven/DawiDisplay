// Error Handling Functions
export function reject(condition, message) {
  if (condition) {
    throw new Error(message);
  }
}

export function confirm(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Array and Number Utilities
export function findIndexOf(array = [], type) {
  return array.findIndex((el) => el.type === type);
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// DOM Manipulation Functions
export async function unType(element, typeSpeed = 150) {
  return new Promise((resolve) => {
    var currentVal = element.innerText;
    const currentCharacters = currentVal.split("");

    currentCharacters.forEach((char, index) => {
      setTimeout(() => {
        currentVal = currentVal.slice(0, -1);
        element.innerText = currentVal;
        if (currentVal.length < 1) resolve();
      }, typeSpeed * index);
    });
  });
}

export async function typeOut(element, newValue = "", typeSpeed = 100) {
  await unType(element);
  const safeValue = newValue.replace(/ /g, "-");

  element.innerText = ""; // Clear existing text

  safeValue.split("").forEach((char, index) => {
    setTimeout(() => {
      const safeChar = char === "-" ? "\u00A0" : char;
      element.innerText += safeChar;
    }, typeSpeed * index);
  });
}

// Fullscreen Activation
export function activateFullScreen(buttonId = "fullscreen-button") {
  const fullscreenButton = document.getElementById(buttonId);
  if (!fullscreenButton) return;

  fullscreenButton.addEventListener("click", () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      // IE/Edge
      document.documentElement.msRequestFullscreen();
    }
  });
}

// Dynamic Component Loading
export function getComponent(name, callback) {
  const elemLocation = `./COMPONENTS/${name}.html`;
  fetch(elemLocation)
    .then((response) => response.text())
    .then((html) => callback(String(html)));
}

// Parsing Utilities
export function parsible(ob, y, z) {
  if (typeof ob === "object") {
    return { x: Number(ob.x), y: Number(ob.y), z: Number(ob.z) };
  } else {
    return { x: Number(ob), y: Number(y), z: Number(z) };
  }
}

export function crunchCase(text = "") {
  return text.replace(" ", "").toLowerCase();
}

export function capFirstLetter() {
  // Split the string into words using a space as the delimiter
  return (
    str
      .split(" ")
      // Map through each word in the array
      .map(
        (word) =>
          // Capitalize the first letter of each word and add the rest of the letters
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      // Join the words back into a single string
      .join(" ")
  );
}

export function htmlJsonExtract() {
  try {
    const docType = document.getElementById("doc_type").innerHTML;
    const docData = document.getElementById("doc_data").innerHTML;

    if (docType.includes("{%") || docData.includes("{%")) {
      return false;
    }

    return { docType, data: JSON.parse(docData) };
  } catch (error) {
    console.log("htmlJsonExtract", error.message);
    return false;
  }
}
