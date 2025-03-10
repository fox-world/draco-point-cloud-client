// CustomButton.js
import React from 'react';
import Button from '@mui/material/Button';

const PlayButton = ({ index, playing = true, onClick, name, color = "success" }) => {
  return (
    <Button disabled={playing} variant="contained" color={color} size="small" onClick={() => onClick(index)}>
      {name}
    </Button>
  );
};

export default PlayButton;