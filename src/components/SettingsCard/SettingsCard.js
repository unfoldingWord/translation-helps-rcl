import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ComboBox from '../ComboBox'

import DraggableModal from '../DraggableModal'
import FontSizeSlider from '../FontSizeSlider'
import Card from '../Card'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  card: {
    margin: '35px !important',
    minWidth: '400px',
    backgroundColor: '#ffffff',
  },
  switchLabel: {
    color: '#666666',
    fontSize: '14px',
  },
  fontSlider: {
    padding: '15px 15px',
  },
  section: {
    padding: '15px 0px',
  },
  typography: {
    color: '#666666',
  },
  formGroup: {
    padding: '15px 0px',
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
    padding: '15px 5px 4px 0px',
    justifyContent: 'flex-end',
  },
  removeText: {
    color: '#FF4444',
    cursor: 'pointer',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

const BlueSwitch = withStyles({
  switchBase: {
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

const SettingsCard = ({
  open,
  onClose,
  headers,
  filters,
  fontSize,
  setFilters,
  setFontSize,
  markdownView,
  onRemoveCard,
  title: _title,
  onShowMarkdown,
  hideMarkdownToggle,
  dropDownConfig,
}) => {
  const classes = useStyles()

  const handleCheckboxClick = event => {
    let newFilters = []

    if (filters.includes(event.target.name)) {
      newFilters = filters.filter(item => item !== event.target.name)
    } else {
      newFilters = [...filters, event.target.name]
    }

    setFilters(newFilters)
  }

  const title = `${_title} Settings`

  return (
    <DraggableModal open={open} title={title} handleClose={onClose}>
      <Card
        closeable
        title={title}
        onClose={onClose}
        classes={{
          root: classes.card,
          dragIndicator: 'draggable-dialog-title',
        }}
      >
        <FormGroup row classes={{ row: classes.formGroup }}>
          {!hideMarkdownToggle &&
            <FormControlLabel
              control={
                <BlueSwitch
                  checked={markdownView}
                  onChange={e => onShowMarkdown(e.target.checked)}
                  name='markdownView'
                />
              }
              classes={{label: classes.switchLabel}}
              label='Markdown View'
              labelPlacement='bottom'
            />
          }
          {(!!dropDownConfig) &&
            <ComboBox {...dropDownConfig} />
          }
        </FormGroup>
        <Divider />
        <div className={classes.fontSlider}>
          <FontSizeSlider value={fontSize} onChange={setFontSize} />
        </div>
        {headers && headers.length > 0 && (
          <Fragment>
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
                          checked={filters.includes(header)}
                          onChange={handleCheckboxClick}
                          name={header}
                          color='primary'
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </Fragment>
        )}
        <Divider />
        <div className={classes.cardRemovalSection}>
          <div className={classes.removeText} onClick={onRemoveCard}>
            Remove Resource Card
          </div>
        </div>
      </Card>
    </DraggableModal>
  )
}

SettingsCard.defaultProps = {
  filters: [],
}

SettingsCard.propTypes = {
  /** The title of the card */
  title: PropTypes.string.isRequired,
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func.isRequired,
  /** Array of labels for checkboxes */
  headers: PropTypes.array.isRequired,
  /** Array of headers that are currently selected */
  filters: PropTypes.array,
  /** Updates the filters list */
  setFilters: PropTypes.func.isRequired,
  /** Current text font size */
  fontSize: PropTypes.number.isRequired,
  /** Updates the font size */
  setFontSize: PropTypes.func.isRequired,
  /** Event handler to Remove Card */
  onRemoveCard: PropTypes.func.isRequired,
  /** current state for markdown toggle */
  markdownView: PropTypes.bool.isRequired,
  /** callback for markdown toggle */
  onShowMarkdown: PropTypes.func.isRequired,
  /** when true markdown toggle is hidden (optional - default is visible) */
  hideMarkdownToggle: PropTypes.bool,
  /** configuration to show dropdown on settings card (optional, see properties of ComboBox for details of configuration) */
  dropDownConfig: PropTypes.object,
}

export default SettingsCard
