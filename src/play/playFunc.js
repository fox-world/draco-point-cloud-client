import axios from 'axios';
import * as THREE from 'three';

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

export const renderPcd = (data, renderer, camera, scene) => {
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
    points.name = 'test.drc';

    // 图像缩放
    points.scale.set(1.2, 1.2, 1.2);
    scene.add(points);
    renderer.render(scene, camera);
}