export function getSpecimenAssets(spec = specimenJson, formNumber = 1) {
  const { files } = spec;
  const form = spec.forms[formNumber - 1];

  return {
    abilities: spec.abilities.filter(
      (ab) => ab.form == formNumber || ab.form.includes("*")
    ),
    mugshot: files.find((f) => f.content == "mugshot" && f.form == formNumber),
    prefab: files.find((f) => f.content == "prefab" && f.form == formNumber),
    terrain: files.find((f) => f.content == "prefab"),
    form,
  };
}

export function getTokenOsAssets(token) {
  const { prefab, image, abilities, terrain } = token;

  return {
    abilities,
    mugshot: image.replace("ipfs://", gtwy),
    prefab,
    terrain,
  };
}

export function getTokenLiteAssets(token) {
  const { prefab, image, abilities, terrain } = token;

  return {
    abilities,
    mugshot: image.replace("ipfs://", gtwy),
    prefab,
    terrain,
  };
}


// fetch specimen by from asset api

// fetch token