import axios from 'axios';
import { PointData } from '../proto/point_pb.js';
import * as draco3d from 'draco3d';
import { decodeDracoData, initComponments, renderPcd } from './playFunc';

let decoderModule = null;
export const playDrc = (pId, pHeight, data, playingRef, updateState) => {
    // 进行一些必要的初始化操作
    let parent = document.getElementById(`${pId}`);
    let width = parent.offsetWidth;

    let total = data.total;
    if (total === 0) {
        return;
    }
    let [renderer, camera, scene] = initComponments(width, pHeight, parent);
    draco3d.createDecoderModule({}).then(module => {
        decoderModule = module;
        console.log('Decoder Module Initialized!');
        loadPlayDrc(data, playingRef, updateState, renderer, camera, scene);
    });
};

let count = 0;
export const loadPlayDrc = (data, playingRef, updateState, renderer, camera, scene) => {
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
            loadPlayDrc(data, playingRef, updateState, renderer, camera, scene);
        } else {
            updateState({ 'progress': 0, processCount: 0 });
            count = 0;
        }
    }).catch(function (error) {
        console.log(error);
    });
};