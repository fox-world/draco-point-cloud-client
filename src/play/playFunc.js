import axios from 'axios';

export const startPcdPlay = (props, callback, interval) => {
    let progress = props.progress0;
    interval['interval0'] = setInterval(() => {
        progress = progress + 1;
        if (progress >= 100) {
            progress = 0;
            props.disabled0 = 0;
            clearInterval(interval['interval0']);
        }
        callback({ ...props, 'progress0': progress });
    }, 300);
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