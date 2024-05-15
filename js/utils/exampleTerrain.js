// This how maps should be stored in the database

/** Note: Choose any one of these example light data types, to set the light.
 * these are the strict format for developing lights. They must be put in an 
 * terrainData.lights as an array to be included in the scene. 
 * */

const lightingData = {
    
    hemi: {
        //
        type: "HemisphereLight",
        colorSky: 0xffffff,
        colorGround: 0x8d8d8d,
        intensity: 2,
    },
    amb: {
        type: "AmbientLight",
        color: 0xffffff,
        intensity: 1,
    },
    dir: {
        type: "DirectionalLight",
        color: "#6dd5ed",
        intensity: 1,
        position: { x: 0, y: 1, z: 0 },
        // rotation: { x: 0, y: 8, z: 0 }
    },
    point: {
        type: "PointLight",
        color: 0xffcc66,
        intensity: 5,
        position: { x: 0, y: 6, z: 0 },
        distance: 300,
        decay: 1
    },
  };


const exampleTerrain = {
    name: "defualtTerrain",
    bgColor: "#3d5f91",
    groundColor: "#1b1b1b",
    fog: { color: "#1b1b1b", near: 2, far: 40 },
    src: null,
    lights: [
        {
            type: "DirectionalLight",
            color: "#6dd5ed",
            intensity: 3,
            position: { x: 0, y: 2, z: 0 },
            // rotation: { x: 0, y: 8, z: 0 }
        },
        { //light1: face
            type: "PointLight",
            color: 0xffcc66,
            intensity: 5,
            position: { x: 0, y: 2, z: 2 },
            distance: 100,
            decay: 1
        },
        { //light2:
            type: "PointLight",
            color: 0xffcc66,
            intensity: 15,
            position: { x: 2, y: 6.5, z: -2 },
            distance: 300,
            decay: 1
        },
        { //light3:
            type: "PointLight",
            color: 0xffcc66,
            intensity: 15,
            position: { x: -2, y: 6.5, z: 1 },
            distance: 300,
            decay: 1
        },
    ]
}


// IN THREE JS
export default exampleTerrain