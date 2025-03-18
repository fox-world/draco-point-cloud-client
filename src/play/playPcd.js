import axios from 'axios';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PcdData } from '../proto/pcd_pb.js';
import { renderPcd } from './playFunc';

let camera, scene, renderer;
let parent, width, height;


export const playPcd = (pId, pHeight, data, playingRef, updateState) => {
    // 进行一些必要的初始化操作
    height = pHeight;
    parent = document.getElementById(`${pId}`);
    width = parent.offsetWidth;

    let total = data.total;
    if (total === 0) {
        return;
    }

    if (!scene) {
        initComponments();
    }
    loadPlayPcd(data, playingRef, updateState);
};

let count = 0;
export const loadPlayPcd = (data, playingRef, updateState) => {
    let file = data.file[count];
    let total = data.total;
    count++;
    let url = `http://127.0.0.1:8000/main/loadPcdBinary?pcd=${file}`;
    axios.get(url, { responseType: "arraybuffer" }).then(function (response) {
        if (!playingRef.current) {
            return;
        }
        let result = PcdData.deserializeBinary(response.data);
        renderPcd(result.getPointList(), renderer, camera, scene);
        if (count < total) {
            let percent = (count / total * 100).toFixed(2);
            updateState({ 'progress': percent, processCount: count });
            loadPlayPcd(data, playingRef, updateState)
        } else {
            updateState({ 'progress': 0, processCount: 0 });
            count = 0;
        }
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
    controls.addEventListener('change', () => renderer.render(scene, camera)); // use if there is no animation loop
    controls.target = new THREE.Vector3(0, 0, 1);
    controls.autoRotate = false;
    controls.dampingFactor = 0.25;

    // 控制缩放范围
    //controls.minDistance = 0.1;
    //controls.maxDistance = 100;

    //scene.add( new THREE.AxesHelper( 1 ) );

    window.addEventListener('resize', () => {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.render(scene, camera);
    });
}