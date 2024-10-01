// let m = "./assets/specimen/101_assets/mugshots/mugshot_1000.png"
const exampleToken = {
  "name": "Domigra",
  "sid": 101,
  "description": "Domigora is a formidable entity, a fallen warrior once belonging to the revered Devine class. Cast \n  down due to the envy of his brethren, he now resides among the unclean as an Undead Samurai. Despite his fall from\n  grace, Domigora wields the unparalleled power of tau, a force utilized by the ancient creators to forge galaxies.\n  With a towering presence and a determined spirit, Domigora is driven by a singular goal: to ascend through the\n  ranks and reclaim his lost birthright.",
  "size": "humanoid",
  "tokenId": 10100001,
  "currentForm": 1,
  "currentSkin": 1,
  "abilities": [
    {
      "form": "*",
      "skin": "*",
      "name": "zephr-display",
      "displayName": "Zephr Display",
      "category": "strike",
      "skillType": "samurai",
      "style": "stk",
      "pointsRequired": 0,
      "projectile": false,
      "mods": { "attack": 1.15, "defense": .1, "endurance": 1.1 }
    },
    {
      "form": "*",
      "skin": "*",
      "name": "galactic-pyro-dragon",
      "displayName": "Galactic Pyro Dragon",
      "category": "ultStrike",
      "skillType": "sorcerer",
      "style": "prj",
      "pointsRequired": 12,
      "projectile": { src: "./assets/props/mage-ball.glb", movementType: "b" },
      "mods": { "attack": 1.1, "defense": 1.1, "endurance": 1.1 }
    },
    {
      "form": "*",
      "skin": "*",
      "name": "sensei's-orders",
      "displayName": "Sensei's Orders",
      "category": "alter",
      "skillType": "samurai",
      "style": "prj",
      "pointsRequired": 0,
      "projectile": false,
      "mods": { "attack": 1.1, "defense": 1.1, "endurance": 1.1 }
    }
  ],
  "owner": "0x",
  "files": {
    "glb": {
      "basemodel": {
        "cloud": "https://storage.googleapis.com/shadawi_assets_bucket_n1/SPECIMEN%2F101%20Domigra%2Fglb_1000%2Fbasemodel.glb",
        "ipfs": "123/glb_1000/basemodel.glb",
        "local": "./assets/specimen/101_assets/glb_1000/basemodel.glb",
      },
      "faint": {
        "cloud": "https://storage.googleapis.com/shadawi_assets_bucket_n1/SPECIMEN%2F101%20Domigra%2Fglb_1000%2Ffaint.glb",
        "ipfs": "123/glb_1000/faint.glb",
        "local": "./assets/specimen/101_assets/glb_1000/faint.glb",
      },
      "idle": {
        "cloud": "https://storage.googleapis.com/shadawi_assets_bucket_n1/SPECIMEN%2F101%20Domigra%2Fglb_1000%2Fidle.glb",
        "ipfs": "123/glb_1000/idle.glb",
        "local": "./assets/specimen/101_assets/glb_1000/idle.glb",
      },
      "prj": {
        "cloud": "https://storage.googleapis.com/shadawi_assets_bucket_n1/SPECIMEN%2F101%20Domigra%2Fglb_1000%2Fprj_summoning.glb",
        "ipfs": "123/glb_1000/prj_summoning.glb",
        "local": "./assets/specimen/101_assets/glb_1000/prj_summoning.glb",

      },
      "stk": {
        "cloud": "https://storage.googleapis.com/shadawi_assets_bucket_n1/SPECIMEN%2F101%20Domigra%2Fglb_1000%2Fstk_spinning-blade.glb",
        "ipfs": "123/glb_1000/stk_spinning-blade.glb",
        "local": "./assets/specimen/101_assets/glb_1000/stk_spinning-blade.glb",
      }
    },
    "mugshot": {
      "cloud": "https://storage.googleapis.com/shadawi_assets_bucket_n1/SPECIMEN%2F101%20Domigra%2Fmugshots%2Fmugshot_1000.png",
      "ipfs": "123/mugshots/mugshot_1000.png",
      "local": "./assets/specimen/101_assets/mugshots/mugshot_1000.png",
    }
  },
  "class": "undead",
  "purg_lvl": "supermighty",
  "build": "base",
  "population": 8,
  "max_form": 1,
  "max_health": 7800,
  "health": 7593,
  "max_attack": 671,
  "attack": 583,
  "max_defense": 901,
  "defense": 789,
  "max_stamina": 2890,
  "stamina": 2652,
  "max_endurance": 500,
  "endurance": 464,
  "max_agility": 500,
  "agility": 438,
  "max_weight": 201,
  "weight": 190
}



export default exampleToken;
