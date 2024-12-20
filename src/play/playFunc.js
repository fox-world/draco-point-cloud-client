import axios from 'axios';
import { playPcd } from './playPcd'

export const startPcdPlay = (pId, height, data, props, callback, interval) => {
    let total = data.total;
    let files = data.file;
    let i = 0;
    for (let file of files) {
        let url = `http://127.0.0.1:8000/pcds/loadPcdBinary?pcd=${file}`;
        setTimeout(() => playPcd(pId, url, height), 5000 * (i++));
    }
};

export const startDracoPlay = (props, callback, interval) => {
    let progress = props.progress1;
    interval['interval1'] = setInterval(() => {
        progress = progress + 1;
        if (progress >= 100) {
            progress = 0;
            props.disabled1 = 0;
            clearInterval(interval['interval1']);
        }
        callback({ ...props, 'progress1': progress });
    }, 100);
};

export const loadPcdDataInfo = async (url) => {
    try {
        const { data: response } = await axios.get(url);
        return response;
    } catch (error) {
        console.log(error);
    }
}