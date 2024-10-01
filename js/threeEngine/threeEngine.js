import { THREE, GLTFLoader, OrbitControls } from "./threeWrapper.js";
import ToolKit from "../utils.js";
import Actions from "./actions.js";
import Prefabs from "./prefabs.js";
import Effects from "./effects.js";
import Terrain from "./terrain.js";
import ThreeMemory from "./threeMemory.js";
// import defaultMap from "../MISC/terrain.js";

var controls, clock;

const tools = new ToolKit();
const loader = new GLTFLoader();

class ThreeActionModule extends ThreeMemory {
  constructor() {
    super();
    this.Cameras;
    this.Terrain = new Terrain(loader, this);
    this.Prefab = new Prefabs(loader, this);
    this.Actions = new Actions(this);
    // this.GlowEffects = new Effects(this);
    console.log("Three Engine Running");
  }

  async init() {
    const container = document.body; //getElementById("container");
    this.Raycaster = new THREE.Raycaster();
    clock = new THREE.Clock();

    //scene
    this.Scene = new THREE.Scene();
    const bgColor = 0xa0a0a0;
    const fogColor = 0xa0a0a0;
    this.Scene.background = new THREE.Color(bgColor);
    this.Scene.fog = new THREE.Fog(fogColor, 20, 90);

    //Render
    this.Renderer = new THREE.WebGLRenderer({ antialias: true });
    this.Renderer.setPixelRatio(window.devicePixelRatio);
    this.Renderer.setSize(window.innerWidth, window.innerHeight);
    this.Renderer.shadowMap.enabled = true;
    this.Renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(this.Renderer.domElement);

    //canvas
    this.Canvas = this.Renderer.domElement;

    //camera
    this.initCamera();

    //Ground to camera
    this.initGroundCameraLock();

    //window resize
    this.initWindowResize(this.ClientCamera, this.Renderer);

    //animate
    this.animate();
  }

  // --- U T I L S --- //
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.Renderer.render(this.Scene, this.ClientCamera);

    // Update the animation mixer (for each object in scene)
    const mixerUpdateDelta = clock.getDelta();
    this.Prefab.prefabData.forEach((prefab) => {
      if (prefab.mixer) prefab.mixer.update(mixerUpdateDelta);
    });
  }

  initWindowResize(_camera, _renderer) {
    //window resize
    window.onresize = function () {
      _camera.aspect = window.innerWidth / window.innerHeight;
      _camera.updateProjectionMatrix();
      _renderer.setSize(window.innerWidth, window.innerHeight);
    };
  }

  //--- C A M E R A ---//
  /** Common positions are located inside of "this.cameraBaseLocations" or
  "this.directions" these store the rotation and locations values in xyz format. */

  initCamera() {
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 100;

    this.ClientCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    controls = new OrbitControls(this.ClientCamera, this.Renderer.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;

    this.setCameraTarget(0, 2, 0);
    controls.update();
  }

  setCameraPosition(posX, posY, posZ) {
    const { x, y, z } = tools.parsible(posX, posY, posZ);
    this.ClientCamera.position.set(x, y, z);
    controls.update();
  }

  setCameraPositionTween(startPosition, endPosition, duration) {
    const startTimestamp = performance.now();
    const deltaPosition = new THREE.Vector3()
      .copy(endPosition)
      .sub(startPosition);
    const sceneCamera = this.ClientCamera;

    function _animate() {
      const elapsed = performance.now() - startTimestamp;
      const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1

      // Interpolate the camera position
      const newPosition = new THREE.Vector3()
        .copy(startPosition)
        .add(deltaPosition.clone().multiplyScalar(progress));
      sceneCamera.position.copy(newPosition);

      if (progress < 1) {
        requestAnimationFrame(_animate);
      }

      controls.update();
    }

    _animate();
  }

  setCameraRotation(posX, posY, posZ) {
    const { x, y, z } = tools.parsible(posX, posY, posZ);
    this.ClientCamera.rotation.set(x, y, z);
    controls.update();
  }

  setCameraTarget(posX, posY, posZ) {
    const { x, y, z } = tools.parsible(posX, posY, posZ);
    console.log("//setTarget:", { x, y, z });

    controls.target.set(x, y, z);
    controls.update();
  }

  cameraLockBehind(prefabType, distance = 8) {
    const prefabData = this.Prefab._getPrefabData(prefabType);
    const prefab = prefabData.scene;
    const preLocation = this.ClientCamera.position.clone();
    const location = prefab.position.clone();
    const facing = prefabData.facing || "e";

    // camera height
    const prefabHeight = this.Prefab.getPrefabHeight(prefab);
    location.y += prefabHeight * 0.8; //80% of its height

    // lockOn
    this.setCameraTarget(location);

    // position camera
    console.log("//cameraLookBehind", { location, facing });
    if (facing.includes("e")) location.x -= distance;
    if (facing.includes("w")) location.x += distance;
    if (facing.includes("s")) location.z += distance;
    if (facing.includes("n")) location.z -= distance;

    // set camera to position
    // this.setCameraPosition(location);
    this.setCameraPositionTween(preLocation, location, 500);
  }

  //Ground to camera
  initGroundCameraLock() {
    const _onCameraChange = () => {
      const centerPosition = controls.target.clone();
      centerPosition.y = 0;
      const groundPosition = this.ClientCamera.position.clone();
      groundPosition.y = 0;
      const d = centerPosition.distanceTo(groundPosition);

      const origin = new THREE.Vector2(controls.target.y, 0);
      const remote = new THREE.Vector2(0, d);
      const angleRadians = Math.atan2(remote.y - origin.y, remote.x - origin.x);
      controls.maxPolarAngle = angleRadians;
    };

    controls.addEventListener("change", _onCameraChange);
    controls.addEventListener("change", _onCameraChange);
  }

  //TESTING
  logCamLoc() {
    console.log(
      "cameraLoc:",
      "\n POSITION",
      this.ClientCamera.position.x,
      this.ClientCamera.position.y,
      this.ClientCamera.position.z,

      "\n ROTATION",
      this.ClientCamera.rotation.x,
      this.ClientCamera.rotation.y,
      this.ClientCamera.rotation.z
    );
  }
}

export default ThreeActionModule;
