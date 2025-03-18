import axios from 'axios';
import { PointData } from '../proto/point_pb.js';
import * as draco3d from 'draco3d';

let parent, width, height;
let decoderModule = null;

export const playDrc = (pId, pHeight, data, playingRef, updateState) => {
    // 进行一些必要的初始化操作
    height = pHeight;
    parent = document.getElementById(`${pId}`);
    width = parent.offsetWidth;

    let total = data.total;
    if (total === 0) {
        return;
    }
    let decoderConfig = {
        wasmUrl: './static/draco_decoder.wasm'
    };
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
        console.log(result.getIdx() + '\t' + result.getName() + '\t' + result.getPoints().length);
        //renderPcd(result);
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
