const exampleSpecimen = {
  SID: 101,
  name: "Domigra",
  description: "Puny purgator you have little comprehension of my strength, take me to the battle!",
  totalForms: 1,
  population: 8,
  owned: 0,
  build: "Base",
  family: "Sukaru Motsu",
  purgLvl: "supermighty",
  creator: "Oneiric",
  knownAbilities: "Zephr Display, Inferno Decent",
  forms: [
    {
      name: "Domigra",
      size: "humanoid",
      class: "undead",
      skill: "samurai",
      health: 6640,
      damage: 889,
      defense: 600,
      time: 5,
      owned: 0,
      form: 1,
      build: "Base",
      purgLvl: "supermighty",
      stun: 342,
      agility: 762,
      power: 444,
    },
  ],
  locations: {
    assetsDirectory: "QmaYmqhftkyihs47ST6uRMGoHpnnkJnrg19fkZroGza7tn",
    mainDirectory: "",
  },
  class: "undead",
  skill: "samurai",
  abilities: [
    {
      form: 1,
      skin: 1,
      strike: {
        status: true,
        skill: "samurai",
        name: "Zephr Display",
        dataname: "zephyr display_x",
        description:
          "Pounces on the opponent with a furious spinning blade vortex mastery",
        mods: { dam: 1.4, power: 2 },
      },
      ultStrike: {
        status: true,
        skill: "mystical",
        name: "Inferno Decent",
        dataname: "slot2",
        description: "",
        requiredSkillPoints: 3,
        mods: { dam: 2.1, stun: 4 },
      },
    },
    {
      form: 1,
      skin: 2,
      strike: {
        status: true,
        skill: "samurai",
        name: "Zephr Display",
        dataname: "zephyr display_x",
        description:
          "Pounces on the opponent with a furious spinning blade vortex mastery",
        mods: { dam: 1.6, power: 1.2 },
      },
    },
  ],
  files: [
    {
      filename: "mugshot_1000.png",
      fileType: "png",
      content: "mugshot",
      form: 1,
      skin: 1,
      link: "QmaYmqhftkyihs47ST6uRMGoHpnnkJnrg19fkZroGza7tn/mugshot_1000.png",
    },
    {
      filename: "prefab_1000.glb",
      fileType: "glb",
      content: "prefab",
      form: 1,
      skin: 1,
      link: "QmaYmqhftkyihs47ST6uRMGoHpnnkJnrg19fkZroGza7tn/prefab_1000.glb",
    },
    {
      name: "dark-plane",
      content: "terrain",
      filename: null,
      jsonSrc: "QmP74foPLQERLTtz2B3h3qM3Ves4qM6prWVwSLsK7aSaQq",
    },
  ],
};


export default exampleSpecimen;