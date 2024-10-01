// scene.js
import { THREE, OrbitControls } from "./threeWrapper.js";

export function initScene(threeMemory, transparent = false) {
  const container = document.body; // Adjust this as necessary for your specific container element
  threeMemory.Scene = new THREE.Scene();
  threeMemory.Clock = new THREE.Clock();
  const bgColor = 0xa0a0a0;
  const fogColor = 0xa0a0a0;
  threeMemory.Scene.background = new THREE.Color(bgColor);
  threeMemory.Scene.fog = new THREE.Fog(fogColor, 20, 90);

  if (transparent) {
    threeMemory.Renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    threeMemory.Renderer.setClearColor(0x000000, 0);
  }else threeMemory.Renderer = new THREE.WebGLRenderer({ antialias: true });
  threeMemory.Renderer.setPixelRatio(window.devicePixelRatio);
  threeMemory.Renderer.setSize(window.innerWidth, window.innerHeight);
  threeMemory.Renderer.shadowMap.enabled = true;
  threeMemory.Renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(threeMemory.Renderer.domElement);
  threeMemory.Canvas = threeMemory.Renderer.domElement;

  //Camera init
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1.0;
  const far = 100;
  threeMemory.ClientCamera = new THREE.PerspectiveCamera(
    fov,
    aspect,
    near,
    far
  );
  threeMemory.Controls = new OrbitControls(
    threeMemory.ClientCamera,
    threeMemory.Renderer.domElement
  );
  threeMemory.Controls.enablePan = true;
  threeMemory.Controls.enableZoom = true;
  threeMemory.Controls.update();

  initWindowResize(threeMemory.ClientCamera, threeMemory.Renderer);
  animate(threeMemory);
}

export function initWindowResize(_camera, _renderer) {
  //window resize
  window.onresize = function () {
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();
    _renderer.setSize(window.innerWidth, window.innerHeight);
  };
}

export function animate(threeMemory) {
  requestAnimationFrame(() => animate(threeMemory));
  threeMemory.Renderer.render(threeMemory.Scene, threeMemory.ClientCamera);

  // Example updating prefab animations
  if (threeMemory.prefabDataMemory.length > 0) {
    const mixerUpdateDelta = threeMemory.Clock.getDelta();
    threeMemory.prefabDataMemory.forEach((prefab) => {
      if (prefab.mixer) prefab.mixer.update(mixerUpdateDelta);
    });
  }
}
