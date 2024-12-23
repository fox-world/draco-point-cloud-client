import axios from 'axios';
import protobuf from 'protobufjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import pcdProto from '../proto/pcd.proto';

let camera, scene, renderer;
let parent, width, height;

const loadProtobuf = async () => {
    const root = await protobuf.load(pcdProto);
    return root.lookupType("PcdData");
};

const decodeProtobuf = async (buffer) => {
    const MyMessage = await loadProtobuf();
    return MyMessage.decode(new Uint8Array(buffer));
};

export const playPcd = (pId, pHeight, data, props, callback) => {
    // 进行一些必要的初始化操作
    height = pHeight;
    parent = document.getElementById(`${pId}`);
    width = parent.offsetWidth;

    props = { ...props, 'progress0': 0, disabled0: 1 };
    callback(props);

    let total = data.total;
    if (total === 0) {
        return;
    }

    if (!scene) {
        initComponments();
    }
    loadPlayPcd(data, props, callback);
};

let count = 0;
export const loadPlayPcd = (data, props, callback) => {
    let file = data.file[count];
    let total = data.total;
    count++;
    let url = `http://127.0.0.1:8000/pcds/loadPcdBinary?pcd=${file}`;
    axios.get(url, { responseType: "arraybuffer" }).then(function (response) {
        decodeProtobuf(response.data).then(result => {
            renderPcd(result);
            if (count < total) {
                let percent = (count / total * 100).toFixed(2);
                props = { ...props, 'progress0': percent, processCount0: count, disabled0: 1 };
                callback(props);
                loadPlayPcd(data, props, callback)
            } else {
                props = { ...props, 'progress0': 100, processCount0: count, disabled0: 0 };
                callback(props);
                count = 0;
            }
        })
    }).catch(function (error) {
        console.log(error);
    });
};

function initComponments() {
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

    window.addEventListener('resize', onWindowResize);
}

function renderPcd(data) {
    // 移除旧点云数据
    for (let child of scene.children) {
        if (child.type === 'Points') {
            scene.remove(child);
            break;
        }
    }

    let geometry = new THREE.BufferGeometry();
    let material = new THREE.PointsMaterial({ size: 0.05, vertexColors: 2 });  //vertexColors: THREE.VertexColors
    let points = new THREE.Points(geometry, material);
    let positions = Float32Array.from(data.point)

    let color = []
    for (let i = 0; i < data.point.length; i += 3) {
        color[i] = 0.12;
        color[i + 1] = 0.565;
        color[i + 2] = 1;
    }
    let colors = new Float32Array(color)

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.center();
    geometry.rotateX(Math.PI);

    // 沿y轴方向平移一定单位
    //points.translateY(10);
    //points.translateX(70);
    points.name = data.name;

    // 图像缩放
    points.scale.set(1.2, 1.2, 1.2);
    scene.add(points);
    render();
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