// CustomButton.js
import React from 'react';
import Button from '@mui/material/Button';

const PlayButton = ({ index, disabled = 0, onClick, name, color = "success" }) => {
  return (
    <Button disabled={disabled === 1} variant="contained" color={color} size="small" onClick={() => onClick(index)}>
      {name}
    </Button>
  );
};

export default PlayButton;