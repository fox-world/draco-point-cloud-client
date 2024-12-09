export const startPcdPlay = (props, callback, interval) => {
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

export const startDracoPlay = (props, callback, interval) => {
    let progress = props.progress2;
    interval['interval2'] = setInterval(() => {
        progress = progress + 1;
        if (progress >= 100) {
            progress = 0;
            props.disabled2 = 0;
            clearInterval(interval['interval2']);
        }
        callback({ ...props, 'progress2': progress });
    }, 100);
};