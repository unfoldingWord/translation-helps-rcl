import React, { useState } from 'react'
import Switch from '@material-ui/core/Switch'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import FontSizeSlider from '../FontSizeSlider'
import Card from '../Card'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  switchLabel: {
    color: '#666666',
    fontSize: '14px',
  },
  fontSlider: {
    padding: '20px 15px',
  },
  section: {
    padding: '20px 0px',
  },
  typography: {
    color: '#666666',
  },
  formGroup: {
    padding: '20px 0px',
  },
  columns: {
    padding: '0px 15px 0px',
  },
  label: {
    color: '#424242',
  },
  checkboxes: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 5px 0px',
  },
  cardRemovalSection: {
    display: 'flex',
    padding: '20px 5px 4px 0px',
    justifyContent: 'flex-end',
  },
  removeText: {
    color: '#FF4444',
    cursor: 'pointer',
  },
}))

const BlueSwitch = withStyles({
  switchBase: {
    // color: purple[300],
    '&$checked': {
      color: '#00B0FF',
    },
    '&$checked + $track': {
      backgroundColor: '#00B0FF',
    },
  },
  checked: {},
  track: {},
})(Switch)

const BlueCheckbox = withStyles({
  root: {
    color: '#000000',
    '&$checked': {
      color: '#00B0FF',
    },
  },
  checked: {},
})(props => <Checkbox color='default' {...props} />)

const NotesSettingsCard = ({
  title,
  onClose,
  headers,
  filters, // TODO: Make use of this prop
  onRemoveCard,
  onShowMarkdown, // TODO: Make use of this prop
}) => {
  const initialState = {
    markdownView: false,
  }
  // Initialize headers to initial state
  headers.forEach(header => (initialState[header] = false))
  const [state, setState] = useState(initialState)
  // TODO: Move font size state up the component tree.
  const [fontSize, setFontSize] = useState(100)
  const classes = useStyles()

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  return (
    <Card closeable title={title} onClose={onClose}>
      <FormGroup row classes={{ row: classes.formGroup }}>
        <FormControlLabel
          control={
            <BlueSwitch
              checked={state.markdownView}
              onChange={handleChange}
              name='markdownView'
            />
          }
          classes={{ label: classes.switchLabel }}
          label='Markdown View'
          labelPlacement='bottom'
        />
      </FormGroup>
      <Divider />
      <div className={classes.fontSlider}>
        <FontSizeSlider value={fontSize} onChange={setFontSize} />
      </div>
      <Divider />
      <div className={classes.section}>
        <div className={classes.columns}>
          <Typography
            classes={{ root: classes.typography }}
            variant='caption'
            display='block'
            gutterBottom
          >
            Show Columns
          </Typography>
          <div className={classes.checkboxes}>
            {headers.map(header => (
              <FormControlLabel
                key={header}
                label={header}
                classes={{ root: classes.label }}
                control={
                  <BlueCheckbox
                    checked={state[header]}
                    onChange={handleChange}
                    name={header}
                    color='primary'
                  />
                }
              />
            ))}
          </div>
        </div>
      </div>
      <Divider />
      <div className={classes.cardRemovalSection}>
        <div className={classes.removeText} onClick={onRemoveCard}>
          Remove Resource Card
        </div>
      </div>
    </Card>
  )
}

NotesSettingsCard.defaultProps = {
  filters: [],
}

NotesSettingsCard.propTypes = {
  filters: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  onRemoveCard: PropTypes.func.isRequired,
  onShowMarkdown: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

export default NotesSettingsCard
