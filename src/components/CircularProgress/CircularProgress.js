import React from 'react'
import { makeStyles } from '@mui/styles'
import CircularProgressUI from '@mui/material/CircularProgress'

const useStyles = makeStyles(() => ({
  root: {
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
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgressUI size={size} />
    </div>
  )
}

export default CircularProgress
