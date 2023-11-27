import "../style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

console.log("Hello, world!");
/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * render sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const fov = 75;
const camera = new THREE.PerspectiveCamera(
  fov,
  sizes.width / sizes.height,
  1,
  1000
);
// camera.position.z = 48;
camera.position.set(4, 4, 4);
camera.lookAt(new THREE.Vector3(0, 2.5, 0));

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

/**
 * Group stuff
 */
// main group
const mainGroup = new THREE.Group();
mainGroup.position.y = 0.5;
scene.add(mainGroup);

/**
 * GUI
 */
const gui = new GUI();

/*
 * Ground
 */
const groundGeometry = new THREE.BoxGeometry(8, 0.5, 8);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.y = -2;
mainGroup.add(groundMesh);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
mainGroup.add(ambientLight!);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight!.position.set(0, 2, 2);
const dlHelper = new THREE.DirectionalLightHelper(directionalLight!, 3);
mainGroup.add(directionalLight, dlHelper);

// set up ambient light gui
const alFolder = gui.addFolder("ambient light");
const alSettings = { color: ambientLight!.color.getHex() };
alFolder.add(ambientLight!, "visible");
alFolder.add(ambientLight!, "intensity", 0, 1, 0.1);
alFolder
  .addColor(alSettings, "color")
  .onChange((value: THREE.ColorRepresentation) =>
    ambientLight!.color.set(value)
  );
alFolder.open();
/**
 * directional light settings GUI
 */
const dlSettings = {
  visible: true,
  color: directionalLight!.color.getHex(),
};
const dlFolder = gui.addFolder("directional light");
dlFolder.add(dlSettings, "visible").onChange((value: boolean) => {
  directionalLight.visible = value;
  dlHelper.visible = value;
});
dlFolder.add(directionalLight, "intensity", 0, 1, 0.25);
dlFolder.add(directionalLight.position, "y", 1, 4, 0.5);
dlFolder.add(directionalLight, "castShadow");
dlFolder
  .addColor(dlSettings, "color")
  .onChange((value: THREE.ColorRepresentation) =>
    directionalLight!.color.set(value)
  );
dlFolder.open();

/**
 * GLTF Loader
 */
const gltfLoader = new GLTFLoader();
const loadGltf2 = async () => await gltfLoader.loadAsync("./moto/scene.gltf");
loadGltf2().then((gltf) => {
  //   scene.add(gltf.scene);
  gltf.scene.position.x = 0;
  gltf.scene.position.y = +1;
  gltf.scene.scale.set(2, 2, 2);
  mainGroup.add(gltf.scene);
  gltf.scene.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
});
console.log(
  scene.children.forEach((child) =>
    child.type === "Group" ? console.log(child) : null
  )
);

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: window.devicePixelRatio < 2,
  logarithmicDepthBuffer: true,
});
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
handleResize();

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// renderer = new THREE.WebGLRenderer({
//   canvas,
//   // NOTE: Anti-aliasing smooths out the edges.
//   antialias: true,
// });

//! enable this for shadows
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
  /**
   * tempo trascorso dal frame precedente
   */
  // const deltaTime = clock.getDelta()
  /**
   * tempo totale trascorso dall'inizio
   */
  // const time = clock.getElapsedTime()

  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(tic);
}

requestAnimationFrame(tic);

window.addEventListener("resize", handleResize);

function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);
}
