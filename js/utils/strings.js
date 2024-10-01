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

export function crunchCase(text = "") {
  return text.replace(" ", "").toLowerCase();
}

export function capFirstLetter(str) {
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
