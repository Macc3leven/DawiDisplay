import { THREE, OrbitControls } from "../threeWrapper.js";
import { getRelativeDirection } from "../modules/compass.js";


const defaultOptions = {
  cameraFov: 60,
  cameraNear: 1.0,
  cameraFar: 1000,
  autoResize: true,
  groundCameraLock: true,
  enableCameraControls: true,
  cameraPosition: { x: 0, y: 10, z: 20 },
};

class ClientCamera {
  constructor(threeMemory, options = {}) {
    this.options = { ...defaultOptions, ...options };
    threeMemory = threeMemory;
    this.Camera = null;
    this.Controls = null;
    this.initCamera(threeMemory);
  }

  initCamera(threeMemory) {
    const {
      cameraFov,
      cameraNear,
      cameraFar,
      cameraPosition,
      autoResize,
      groundCameraLock,
      enableCameraControls,
    } = this.options;

    // Initialize Perspective Camera
    this.Camera = new THREE.PerspectiveCamera(
      cameraFov,
      window.innerWidth / window.innerHeight,
      cameraNear,
      cameraFar
    );
    this.Camera.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );

    // Add Camera to ThreeMemory

    // Initialize Controls
    if (enableCameraControls) {
      this.Controls = new OrbitControls(
        this.Camera,
        threeMemory.Renderer.domElement
      );
      this.Controls.enablePan = true;
      this.Controls.enableZoom = true;
      this.Controls.update();
    }

    // Handle Resizing
    if (autoResize) {
      window.addEventListener("resize", () => {
        this.Camera.aspect = window.innerWidth / window.innerHeight;
        this.Camera.updateProjectionMatrix();
        threeMemory.Renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    // Apply Ground Camera Lock Logic
    if (groundCameraLock && this.Controls) {
      this.applyGroundCameraLock();
    }
  }

  applyGroundCameraLock() {
    const onCameraChange = () => {
      const centerPosition = this.Controls.target.clone();
      centerPosition.y = 0;
      const groundPosition = this.Camera.position.clone();
      groundPosition.y = 0;
      const distance = centerPosition.distanceTo(groundPosition);

      const origin = new THREE.Vector2(this.Controls.target.y, 0);
      const remote = new THREE.Vector2(0, distance);
      const angleRadians = Math.atan2(remote.y - origin.y, remote.x - origin.x);
      this.Controls.maxPolarAngle = angleRadians;
    };

    this.Controls.addEventListener("change", onCameraChange);
  }

  setPosition({
    x = this.Camera.position.x,
    y = this.Camera.position.y,
    z = this.Camera.position.z,
  } = {}) {
    console.log("new cam position:", { x, y, z });
    this.Camera.position.set(x, y, z);
    this.Controls?.update();
  }

  setTarget({
    x = this.Controls.target.x,
    y = this.Controls.target.y,
    z = this.Controls.target.z,
  } = {}) {
    if (this.Controls) {
      console.log("new cam target:", { x, y, z });
      this.currentTarget = { x, y, z };
      this.Controls.target.set(x, y, z);
      this.Controls?.update();
    }
  }

  setRotation({
    x = this.Camera.rotation.x,
    y = this.Camera.rotation.y,
    z = this.Camera.rotation.z,
  } = {}) {
    console.log("new cam rotation", x, y, z);
    this.Camera.rotation.set(x, y, z);
    this.Controls?.update();
  }

  setZoomLimit(min,max) {
    // Set the minimum and maximum zoom distances (radius from the target point)
    this.Controls.minDistance = min; // Minimum distance the camera can zoom in
    this.Controls.maxDistance = max; // Maximum distance the camera can zoom out
    this.Controls.update();
  }

  getLoc() {
    const model = this.model;

    console.log(
      `prefab: ${this.dataname}`,
      "\n POSITION",
      model.position.x,
      model.position.y,
      model.position.z,

      "\n ROTATION",
      model.rotation.x,
      model.rotation.y,
      model.rotation.z
    );
  }
  
  lockBehindCharacter(character, duration = 0) {
    const preLocation = this.Camera.position.clone();
    console.log({preLocation})
    const behindDirection = getRelativeDirection(character.model, "behind");
    const distance = (character.getWidth() * 2);
    const cameraOffset = behindDirection.multiplyScalar(distance); // 10 units behind

    const newCamPos = character.model.position.clone().add(cameraOffset);
    const newCamTarg = character.model.position.clone();
    newCamTarg.y = character.getHeight();
    newCamPos.y = character.getHeight();

    console.log(newCamPos);
    this.setTarget(newCamTarg);
    this.tweenPosition(preLocation, newCamPos, duration);
    // this.setPosition(newCamPos);
  }

  tweenPosition(startPosition, endPosition, duration) {
    const startTime = performance.now();
    const deltaPosition = new THREE.Vector3().subVectors(
      endPosition,
      startPosition
    );

    const animatePosition = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newPosition = startPosition
        .clone()
        .add(deltaPosition.clone().multiplyScalar(progress));
      this.Camera.position.copy(newPosition);
      this.setTarget(this.currentTarget);


      if (progress < 1) {
        requestAnimationFrame(animatePosition);
      } else {
        this.Controls?.update();
      }
    };

    animatePosition();
  }

  tweenRotation(startRotation, endRotation, duration) {
    const startTime = performance.now();
    const deltaRotation = new THREE.Euler().setFromRotationMatrix(
      new THREE.Matrix4().makeRotationFromEuler(endRotation)
    );

    const animateRotation = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newRotation = new THREE.Euler(
        startRotation.x + deltaRotation.x * progress,
        startRotation.y + deltaRotation.y * progress,
        startRotation.z + deltaRotation.z * progress
      );
      this.Camera.rotation.copy(newRotation);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        this.Controls?.update();
      }
    };

    animateRotation();
  }
}

export default ClientCamera;
