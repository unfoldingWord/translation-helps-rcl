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

const useStyles = makeStyles(() => ({
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
  disableFilters,
  disableMarkdownToggle,
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
        {!disableMarkdownToggle && (
          <FormGroup row classes={{ row: classes.formGroup }}>
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
          </FormGroup>
        )}
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
  disableFilters: false,
  disableMarkdownToggle: false,
}

SettingsCard.propTypes = {
  filters: PropTypes.array,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  fontSize: PropTypes.number.isRequired,
  setFilters: PropTypes.func.isRequired,
  setFontSize: PropTypes.func.isRequired,
  onRemoveCard: PropTypes.func.isRequired,
  markdownView: PropTypes.bool.isRequired,
  onShowMarkdown: PropTypes.func.isRequired,
  /** Disables the filters checkboxes. */
  disableFilters: PropTypes.bool,
  /** Disables the Markdown Toggle. */
  disableMarkdownToggle: PropTypes.bool,
}

export default SettingsCard
