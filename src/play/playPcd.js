import axios from 'axios';
import { PcdData } from '../proto/pcd_pb.js';
import { initComponments, renderPcd } from './playFunc';

export const playPcd = (pId, pHeight, data, playingRef, updateState) => {
    // 进行一些必要的初始化操作
    let parent = document.getElementById(`${pId}`);
    let width = parent.offsetWidth;

    let total = data.total;
    if (total === 0) {
        return;
    }

    let [renderer, camera, scene] = initComponments(width, pHeight, parent);
    loadPlayPcd(data, playingRef, updateState, renderer, camera, scene);
};

let count = 0;
export const loadPlayPcd = (data, playingRef, updateState, renderer, camera, scene) => {
    let file = data.file[count];
    let total = data.total;
    count++;
    let url = `http://127.0.0.1:8000/main/loadPcdBinary?pcd=${file}`;
    axios.get(url, { responseType: "arraybuffer" }).then(function (response) {
        if (!playingRef.current) {
            return;
        }
        let result = PcdData.deserializeBinary(response.data);
        renderPcd(result.getName(), result.getPointList(), renderer, camera, scene);
        if (count < total) {
            let percent = (count / total * 100).toFixed(2);
            updateState({ 'progress': percent, processCount: count });
            loadPlayPcd(data, playingRef, updateState, renderer, camera, scene)
        } else {
            updateState({ 'progress': 0, processCount: 0 });
            count = 0;
        }
    }).catch(function (error) {
        console.log(error);
    });
};