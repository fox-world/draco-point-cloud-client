import React from 'react';
import Typography from '@mui/material/Typography';

const PlayArea = ({ id, content, minHeight, showContent }) => {
    const playAreaStyle = {
        border: '1px dashed #d0d0d0',
        marginTop: '5px',
        minHeight: `${minHeight}px`,
    };

    return (
        <div id={id} style={playAreaStyle}>
            {showContent ? <Div content={content} minHeight={minHeight} /> : null}
        </div>
    );
};

const Div = ({ content, minHeight }) => {
    const playContentStyle = {
        width: '100%',
        minHeight: `${minHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        opacity: '0.5',
        backgroundColor: '#d0d0d0'
    };

    return (
        <Typography style={playContentStyle}>
            {content}
        </Typography>
    );
};

export default PlayArea;