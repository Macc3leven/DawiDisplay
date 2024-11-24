// initScene.js
import { THREE } from "../threeWrapper.js";
import ClientCamera from "../prototypes/Camera.js";
import { addManyLights, deleteAllLights } from "./lights.js";
const defaultOptions = {
  container: document.body,
  transparent: false,
  enableShadows: true,
  enableCameraControls: true,
  cameraFov: 60,
  cameraNear: 1.0,
  cameraFar: 100,
  autoResize: true,
  groundCameraLock: true,
  sceneFrameCallback: null, // Custom callback for frame updates
  defaultScene: null
};

/**
 * Initializes the Three.js scene, renderer, and optional camera with given options,
 * and populates a provided ThreeMemory instance with these components.
 *
 * @param {ThreeMemory} threeMemory - Instance of ThreeMemory to store initialized components.
 * @param {Object} options - Configuration flags for initializing the scene.
 * (See previous documentation for option flags)
 *
 * @returns {Object} - An object containing mutable callbacks (onAnimate, onRender) for later updates.
 */
export function initScene(threeMemory, options = {}) {
  threeMemory.sceneOptions = {
    ...defaultOptions,
    ...options,
  };

  // Initialize and populate ThreeMemory with core components
  threeMemory.Scene = new THREE.Scene();
  threeMemory.Scene.background = new THREE.Color(threeMemory.sceneOptions);

  // Renderer
  threeMemory.Renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: threeMemory.sceneOptions.transparent,
  });
  threeMemory.Renderer.setPixelRatio(window.devicePixelRatio);
  threeMemory.Renderer.setSize(window.innerWidth, window.innerHeight);
  threeMemory.Renderer.shadowMap.enabled =
    threeMemory.sceneOptions.enableShadows;
  threeMemory.Renderer.shadowMap.type = THREE.PCFShadowMap;
  threeMemory.sceneOptions.container.appendChild(
    threeMemory.Renderer.domElement
  );

  // Default scene
  defaultScene(threeMemory);

  // Camera
  threeMemory.ClientCamera = new ClientCamera(threeMemory);

  // Animations
  threeMemory.Clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);
    const delta = threeMemory.Clock.getDelta(); // Calculate time since last frame
    if (typeof threeMemory.sceneOptions.sceneFrameCallback === "function") {
      threeMemory.sceneOptions.sceneFrameCallback(delta);
    }

    threeMemory.Renderer.render(
      threeMemory.Scene,
      threeMemory.ClientCamera.Camera
    );
  };
  animate();
}

export function defaultScene(threeMemory) {

  const worldColor = '#1a1a1a';
  setBackground(threeMemory, worldColor);
  const model = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: worldColor, depthWrite: false })
  );
  model.rotation.x = -Math.PI / 2;
  model.receiveShadow = true;

  defaultOptions.defaultScene = model;
  threeMemory.Scene.add(defaultOptions.defaultScene);

  addManyLights(
    [
      {
        // Defualt lights
        type: "PointLight",
        color: 0xffcc66,
        intensity: 5,
        position: { x: 0, y: 2, z: 2 },
        distance: 100,
        decay: 1,
      },
      {
        type: "PointLight",
        color: 0xffcc66,
        intensity: 15,
        position: { x: 2, y: 6.5, z: -2 },
        distance: 300,
        decay: 1,
      },
    ])
  
  console.log('default scene created.')
}

export function deleteDefaultScene(threeMemory) {
  deleteAllLights(threeMemory)

  const defaultPlane = defaultOptions.defaultScene;
  if (defaultPlane && defaultPlane.isMesh) {
    threeMemory.Scene.remove(defaultPlane);
    if (defaultPlane.geometry) defaultPlane.geometry.dispose();
    if (defaultPlane.material) defaultPlane.material.dispose();
  }

  console.log("Default scene deleted.");
}

export function setFog(threeMemory, { color = 0xa0a0a0, near = 20, far = 60 }) {
  threeMemory.Scene.fog = new THREE.Fog(color, near, far);
}

export function setBackground(threeMemory, _backgroundColor) {
  const bg = _backgroundColor || 0xa0a0a0;
  threeMemory.Scene.background = new THREE.Color(bg);
}

export function setGradBackground(
  threeMemory,
  firstColor = "#8AAB8A",
  lastColor = "#384538"
) {
  // Create plane
  const canvas = threeMemory.Canvas;
  const ctx = canvas.getContext("2d");
  canvas.width = 2;
  canvas.height = 256; // Vertical gradient
  // console.log({ctx})
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, firstColor);
  gradient.addColorStop(1, lastColor);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 256);

  // set the plane
  const textureMap = new THREE.CanvasTexture(canvas);
  const geometry = new THREE.PlaneGeometry(100, 100); // Adjust size as needed
  const material = new THREE.MeshBasicMaterial({
    map: textureMap,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, -1); // Move slightly behind the other objects in the scene
  scene.add(plane);
}

export function clearScene(threeMemory) {
  // Recursively dispose of a Three.js object and its children
  const disposeObject = (object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.material) {
      // If the material is an array (e.g., for multi-materials), iterate through it
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => mat.dispose());
      } else {
        object.material.dispose();
      }
    }

    // Dispose of textures if present
    if (object.material && object.material.map) {
      object.material.map.dispose();
    }

    // Remove from parent if it has one
    if (object.parent) {
      object.parent.remove(object);
    }
  };

  // Dispose of all objects in the scene
  threeMemory.Scene.traverse((object) => {
    disposeObject(object);
  });

  // Clear animations
  if (threeMemory.Renderer && threeMemory.Renderer.info) {
    threeMemory.Renderer.info.reset(); // Resets internal Three.js renderer stats
  }

  // Remove all children from the scene
  while (threeMemory.Scene.children.length > 0) {
    threeMemory.Scene.remove(threeMemory.Scene.children[0]);
  }

  // Dispose of lights and controls
  threeMemory.Controls && threeMemory.Controls.dispose();
  threeMemory.Scene.fog = null; // Clear fog if used
  threeMemory.Scene.background = null; // Remove background if used
}
