// declare variables in global scope
let container;
let camera;
let controls;
let mesh;
let renderer;
let scene;
const mixers = [];
const clock = new THREE.Clock();

function createControls() {
    controls = new THREE.OrbitControls(camera, container);
}


function createCamera() {

    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 200;

    // create the camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // move the camera a bit back
    camera.position.set(-5, 1.5, 150);

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

function loadModels() {
    const loader = new THREE.GLTFLoader();

    const onLoad = (gltf, position) => {
        const model = gltf.scene.children[0];
        model.position.copy(position);
        const animation = gltf.animations[0];
        const mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);
        const action = mixer.clipAction(animation);
        action.play();
        scene.add(model);
    };

    const parrotPosition = new THREE.Vector3(0, 0, 2.5);
    loader.load('models/Parrot.glb', gltf => onLoad(gltf, parrotPosition));
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
    createRenderer();
    loadModels();

    // start animation loop
    renderer.setAnimationLoop(() => {
        update();
        render();
    })
}

function update() {
    const delta = clock.getDelta();

    for (const m of mixers) {
        m.update(delta);
    }
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
