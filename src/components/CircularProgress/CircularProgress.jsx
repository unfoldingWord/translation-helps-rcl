import React from 'react'
import { styled, CircularProgress as CircularProgressUI } from '@mui/material'

const PREFIX = 'CircularProgress'

const classes = {
  root: `${PREFIX}-root`,
}

const Root = styled('div')(() => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '3rem',
  },
}))

function CircularProgress({ size }) {
  return (
    <Root className={classes.root}>
      <CircularProgressUI size={size} />
    </Root>
  )
}

export default CircularProgress
