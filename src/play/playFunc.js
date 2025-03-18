import axios from 'axios';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const loadDataInfo = async (url) => {
    try {
        const { data: response } = await axios.get(url);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const decodeDracoData = (decoderModule, rawBuffer) => {
    let points = [];
    const decoder = new decoderModule.Decoder();
    const buffer = new decoderModule.DecoderBuffer();
    buffer.Init(new Float32Array(rawBuffer), rawBuffer.byteLength);
    const geometryType = decoder.GetEncodedGeometryType(buffer);

    let dracoGeometry = null;
    let status;
    if (geometryType === decoderModule.TRIANGULAR_MESH) {
        dracoGeometry = new decoderModule.Mesh();
        status = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
    } else if (geometryType === decoderModule.POINT_CLOUD) {
        dracoGeometry = new decoderModule.PointCloud();
        status = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
    } else {
        const errorMsg = 'Error: Unknown geometry type.';
        console.error(errorMsg);
        return points;
    }
    console.log(`Decode status:${status.code()},${status.ok()}`);
    decoderModule.destroy(buffer);

    const attrs = {
        POSITION: 3
    };
    const numPoints = dracoGeometry.num_points();
    Object.keys(attrs).forEach((attr) => {
        const decoderAttr = decoderModule[attr];
        const attrId = decoder.GetAttributeId(dracoGeometry, decoderAttr);
        const stride = attrs[attr];
        const numValues = numPoints * stride;

        const attribute = decoder.GetAttribute(dracoGeometry, attrId);
        const attributeData = new decoderModule.DracoFloat32Array();
        decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, attributeData);
        for (let i = 0; i < numValues; i = i + stride) {
            for (let j = i; j < i + stride; j++) {
                points.push(attributeData.GetValue(j));
            }
        }
        decoderModule.destroy(attributeData);
    });
    console.log(`Encode finished, decode point size: ${numPoints}`);
    decoderModule.destroy(decoder);
    decoderModule.destroy(dracoGeometry);
    return points;
}

export const initComponments = (width, height, parent) => {
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    parent.appendChild(renderer.domElement);

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(12, width / height, 0.5, 50000);
    camera.position.z = 310;
    scene.add(camera);

    let controls = new OrbitControls(camera, renderer.domElement);
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
    return [renderer, camera, scene];
}

export const renderPcd = (name, data, renderer, camera, scene) => {
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
    let positions = Float32Array.from(data);

    let color = []
    for (let i = 0; i < data.length; i += 3) {
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
    points.name = name;

    // 图像缩放
    points.scale.set(1.2, 1.2, 1.2);
    scene.add(points);
    renderer.render(scene, camera);
}