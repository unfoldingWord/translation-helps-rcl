import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import { makeStyles } from '@mui/styles'
import TextFieldsIcon from '@mui/icons-material/TextFields'

const useStyles = makeStyles({
  gridItem: { cursor: 'pointer' },
  smallFont: {
    display: 'flex',
    margin: '0px',
    fontSize: '16px',
  },
  largeFont: {
    margin: '0px',
    cursor: 'pointer',
    fontSize: '22px',
  },
  sliderRoot: { color: '#38ADDF' },
  sliderMark: { backgroundColor: '#38ADDF' },
  valueLabel: {
    top: -14,
    fontSize: '10px',
    fontWeight: 'bold',
    userSelect: 'none',
    '& *': {
      background: 'transparent',
      color: '#38ADDF',
    },
  },
})

function FontSizeSlider({ min, max, step, marks, value, onChange }) {
  const classes = useStyles()

  const handleChange = (_, newValue) => {
    if (newValue >= min) {
      onChange(newValue)
    }
  }

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - step)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + step)
    }
  }

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item onClick={handleDecrease} classes={{ root: classes.gridItem }}>
        <TextFieldsIcon fontSize='small' htmlColor='#38ADDF' />
      </Grid>
      <Grid item style={{ display: 'flex', flex: 1 }}>
        <Slider
          marks={marks}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          classes={{
            root: classes.sliderRoot,
            mark: classes.sliderMark,
            valueLabel: classes.valueLabel,
          }}
          valueLabelDisplay='on'
          aria-labelledby='font-size-slider'
          value={typeof value === 'number' ? value : min}
        />
      </Grid>
      <Grid item onClick={handleIncrease} classes={{ root: classes.gridItem }}>
        <TextFieldsIcon fontSize='large' htmlColor='#38ADDF' />
      </Grid>
    </Grid>
  )
}

FontSizeSlider.defaultProps = {
  min: 50,
  max: 150,
  step: 10,
  value: 100, // 100%
  marks: false,
}

FontSizeSlider.propTypes = {
  marks: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

export default FontSizeSlider
