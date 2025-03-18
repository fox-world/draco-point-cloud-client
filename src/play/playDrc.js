import * as draco3d from 'draco3d';
import { PointData } from '../proto/point_pb';
import { request } from '../tools/axios_tools';
import { decodeDracoData, initComponments, renderPcd } from '../tools/play_tools';

let decoderModule = null;
let renderer, camera, scene;
export const playDrc = (pId, pHeight, data, playingRef, updateState) => {
    // 进行一些必要的初始化操作
    let parent = document.getElementById(`${pId}`);
    let width = parent.offsetWidth;

    let total = data.total;
    if (total === 0) {
        return;
    }
    if (!scene) {
        let [sRenderer, sCamera, sScene] = initComponments(width, pHeight, parent);
        renderer = sRenderer;
        camera = sCamera;
        scene = sScene;
    }
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
    let url = `main/loadDrcBinary?drc=${file}`;
    request.get(url, { responseType: "arraybuffer" }).then(function (response) {
        if (!playingRef.current) {
            return;
        }
        let result = PointData.deserializeBinary(response.data);
        let points = decodeDracoData(decoderModule, result.getPoints());
        renderPcd(result.getName(), points, renderer, camera, scene);
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