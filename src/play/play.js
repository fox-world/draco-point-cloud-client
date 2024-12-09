const startDracoPlay = (props, callback, interval) => {
    let progress = props.progress2;
    interval['interval2'] = setInterval(() => {
        progress = progress + 1;
        if (progress >= 100) {
            progress = 0;
            props.disabled2 = 0;
            clearInterval(interval['interval2']);
        }
        callback({ ...props, 'progress2': progress });
    }, 200);
}

export default startDracoPlay;