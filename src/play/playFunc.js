// 模拟功能
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