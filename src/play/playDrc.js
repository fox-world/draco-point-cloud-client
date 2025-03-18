import axios from 'axios';
import { PointData } from '../proto/point_pb.js';
import * as draco3d from 'draco3d';
import * as THREE from 'three';
import { decodeDracoData, renderPcd } from './playFunc';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let parent, width, height;
let decoderModule = null;
let renderer, camera, scene;

export const playDrc = (pId, pHeight, data, playingRef, updateState) => {
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
    draco3d.createDecoderModule({}).then(module => {
        decoderModule = module;
        console.log('Decoder Module Initialized!');
        loadPlayDrc(data, playingRef, updateState);
    });
};

let count = 0;
export const loadPlayDrc = (data, playingRef, updateState) => {
    let file = data.file[count];
    let total = data.total;
    count++;
    let url = `http://127.0.0.1:8000/main/loadDrcBinary?drc=${file}`;
    axios.get(url, { responseType: "arraybuffer" }).then(function (response) {
        if (!playingRef.current) {
            return;
        }
        let result = PointData.deserializeBinary(response.data);
        let points = decodeDracoData(decoderModule, result.getPoints());
        renderPcd(points, renderer, camera, scene);
        if (count < total) {
            let percent = (count / total * 100).toFixed(2);
            updateState({ 'progress': percent, processCount: count });
            loadPlayDrc(data, playingRef, updateState)
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