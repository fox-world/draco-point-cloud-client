import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';

let camera, scene, renderer;
let parent, width, height;

export const playPcd = (pId, pWidth, pHeight) => {
    let pcd = 'http://127.0.0.1:8080/000001.pcd';
    height = pHeight;
    width = pWidth;
    parent = document.getElementById(`${pId}`);
    loadPcd(pcd);
    render();
};

function loadPcd(pcd) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    parent.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(12, width / height, 0.5, 50000);
    camera.position.z = 310;
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.target = new THREE.Vector3(0, 0, 1);
    controls.autoRotate = false;
    controls.dampingFactor = 0.25;

    // 控制缩放范围
    //controls.minDistance = 0.1;
    //controls.maxDistance = 100;

    //scene.add( new THREE.AxesHelper( 1 ) );

    const loader = new PCDLoader();
    loader.load(pcd, function (points) {
        points.geometry.center();
        points.geometry.rotateX(Math.PI);
        points.name = '000001.pcd';

        // 沿y轴方向平移一定单位
        //points.translateY(10);

        // 图像缩放
        points.scale.set(1.2, 1.2, 1.2);
        scene.add(points);

        render();
    });
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
}

function render() {
    renderer.render(scene, camera);
}