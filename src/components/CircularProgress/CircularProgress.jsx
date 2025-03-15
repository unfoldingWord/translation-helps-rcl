import React from 'react'
import { styled } from '@mui/material/styles';
import CircularProgressUI from '@mui/material/CircularProgress'

const PREFIX = 'CircularProgress';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled('div')(() => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '3rem',
  }
}));

function CircularProgress({ size }) {


  return (
    <Root className={classes.root}>
      <CircularProgressUI size={size} />
    </Root>
  );
}

export default CircularProgress
