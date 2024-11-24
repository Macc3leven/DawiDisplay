import { THREE } from "../threeWrapper.js";


//==============================
//Enable clicking on objects
//==============================
function enablePrefabClicks(threeMemory) {
  threeMemory.Canvas.addEventListener("click", (event) => {
    onPrefabClick(event, threeMemory, function (prefabObj) {
      Camera.cameraLockBehind(threeMemory, prefabObj.dataname, 8);
    });
  });
}

function onObjectClick(event, threeMemory, callback) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, threeMemory.ClientCamera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(
    threeMemory.characterDataMemory.map((prefab) => prefab.scene)
  );

  if (intersects.length > 0) {
    // Handle the click on the first intersected object (you can iterate through the 'intersects' array for multiple objects)
    const clickedObject = intersects[0].object;
    const parentObject = clickedObject.parent;

    // Find the topmost group that this object is part of
    let topObject = clickedObject;
    while (topObject.parent && !topObject.topOfGroup) {
      topObject = topObject.parent;
    }

    console.log(`youve clicked: ${dataname}`);
    callback(topObject);
  }
}

export { enablePrefabClicks };
