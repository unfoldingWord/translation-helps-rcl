import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import DraggableModal from '../DraggableModal'
import FontSizeSlider from '../FontSizeSlider'
import Card from '../Card'

const useStyles = makeStyles(theme => ({
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
      color: '#38ADDF',
    },
    '&$checked + $track': {
      backgroundColor: '#38ADDF',
    },
  },
  checked: {},
  track: {},
})(Switch)

const BlueCheckbox = withStyles({
  root: {
    color: '#000000',
    '&$checked': {
      color: '#38ADDF',
    },
  },
  checked: {},
})(props => <Checkbox color='default' {...props} />)

const SettingsCard = ({
  open,
  title,
  onClose,
  headers,
  filters,
  fontSize,
  setFilters,
  setFontSize,
  markdownView,
  onRemoveCard,
  onShowMarkdown,
  disableFilters,
  hideMarkdownToggle,
  getCustomComponent,
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
          {!hideMarkdownToggle && (
            <FormControlLabel
              control={
                <BlueSwitch
                  checked={markdownView}
                  onChange={e => onShowMarkdown(e.target.checked)}
                  name='markdownView'
                />
              }
              classes={{ label: classes.switchLabel }}
              label='Markdown View'
              labelPlacement='bottom'
            />
          )}
          {!!getCustomComponent && getCustomComponent()}
        </FormGroup>
        <Divider />
        <div className={classes.fontSlider}>
          <FontSizeSlider value={fontSize} onChange={setFontSize} />
        </div>
        {!disableFilters && headers && headers.length > 0 && (
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
        { !!onRemoveCard && (
          <>
            <Divider />
            <div className={classes.cardRemovalSection}>
              <div className={classes.removeText} onClick={onRemoveCard}>
                Remove Resource Card
              </div>
            </div>
          </>
        )}
      </Card>
    </DraggableModal>
  )
}

SettingsCard.defaultProps = {
  filters: [],
  disableFilters: false,
  hideMarkdownToggle: false,
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
  /** Event handler to Remove Card, if not set then remove card is not shown */
  onRemoveCard: PropTypes.func,
  /** current state for markdown toggle */
  markdownView: PropTypes.bool.isRequired,
  /** callback for markdown toggle */
  onShowMarkdown: PropTypes.func.isRequired,
  /** Disables the filters checkboxes. */
  disableFilters: PropTypes.bool,
  /** when true markdown toggle is hidden (optional - default is visible) */
  hideMarkdownToggle: PropTypes.bool,
  /** function to get a custom component to add to settings card (optional) */
  getCustomComponent: PropTypes.func,
}

export default SettingsCard
