// declare variables in global scope
let container;
let camera;
let controls;
let mesh;
let renderer;
let scene;

function createControls() {
    controls = new THREE.OrbitControls(camera, container);
}


function createCamera() {

    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 100;

    // create the camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // move the camera a bit back
    camera.position.set(-4, -4, 10);

}

function createLights() {
    const ambientLight = new THREE.HemisphereLight(
        0xddeeff, // bright sky color
        0x202020, // dim ground color
        5, // intensity
      );
    //create lights and set position
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    const mainLight = new THREE.DirectionalLight(0xffffff, 5.0);
    mainLight.position.set(-10, 10, 10);
    scene.add(ambientLight, mainLight);
    // scene.add(ambientLight);
}

function createMeshes() {
    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('textures/uv_test_bw.png');
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 2;
    const material = new THREE.MeshStandardMaterial({ map: texture });
    // create a mesh and add it to the scene
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function createRenderer() {
    // create the renderer -> which draws obects onto the canvas
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio);
    // append the canvas created by the WebGLRenderer to the container div
    container.appendChild(renderer.domElement);
}

// scene initialization function
function init() {

    container = document.querySelector('#scene-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color('plum');

    createCamera();
    createControls();
    createLights();
    createMeshes();
    createRenderer();

    // start animation loop
    renderer.setAnimationLoop(() => {
        update();
        render();
    })
}

function update() {
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    // mesh.rotation.z += 0.01;

}

function render() {
    // render a still of te scene
    renderer.render(scene, camera);
}

function updateCanvasOnWindowResize() {
    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    // update the camera's frustum
    camera.updateProjectionMatrix();
    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', updateCanvasOnWindowResize);

init();
