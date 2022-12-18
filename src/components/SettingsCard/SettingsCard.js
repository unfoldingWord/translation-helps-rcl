import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Extensible } from '@gwdevs/extensible-rcl'
import DraggableModal from '../DraggableModal'
import FontSizeSlider from '../FontSizeSlider'
import Card from '../Card'

const PREFIX = 'SettingsCard';

const classes = {
  switchBase: `${PREFIX}-switchBase`,
  checked: `${PREFIX}-checked`,
  track: `${PREFIX}-track`,
  root: `${PREFIX}-root`,
  checked2: `${PREFIX}-checked2`,
  root2: `${PREFIX}-root2`,
  card: `${PREFIX}-card`,
  switchLabel: `${PREFIX}-switchLabel`,
  fontSlider: `${PREFIX}-fontSlider`,
  section: `${PREFIX}-section`,
  typography: `${PREFIX}-typography`,
  formGroup: `${PREFIX}-formGroup`,
  columns: `${PREFIX}-columns`,
  label: `${PREFIX}-label`,
  checkboxes: `${PREFIX}-checkboxes`,
  cardRemovalSection: `${PREFIX}-cardRemovalSection`,
  removeText: `${PREFIX}-removeText`,
  formControl: `${PREFIX}-formControl`
};

const StyledDraggableModal = styled(DraggableModal)((
  {
    theme
  }
) => ({
  [`& .${classes.root2}`]: {
    width: '100%',
  },

  [`& .${classes.card}`]: {
    margin: '35px !important',
    minWidth: '400px',
    backgroundColor: '#ffffff',
  },

  [`& .${classes.switchLabel}`]: {
    color: '#666666',
    fontSize: '14px',
  },

  [`& .${classes.fontSlider}`]: {
    padding: '15px 15px',
  },

  [`& .${classes.section}`]: {
    padding: '15px 0px',
  },

  [`& .${classes.typography}`]: {
    color: '#666666',
  },

  [`& .${classes.formGroup}`]: {
    padding: '15px 0px',
  },

  [`& .${classes.columns}`]: {
    padding: '0px 15px 0px',
  },

  [`& .${classes.label}`]: {
    color: '#424242',
  },

  [`& .${classes.checkboxes}`]: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 5px 0px',
  },

  [`& .${classes.cardRemovalSection}`]: {
    display: 'flex',
    padding: '15px 5px 4px 0px',
    justifyContent: 'flex-end',
  },

  [`& .${classes.removeText}`]: {
    color: '#FF4444',
    cursor: 'pointer',
  },

  [`& .${classes.formControl}`]: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

const BlueSwitch = Switch

const BlueCheckbox = (props => <Checkbox color='default' {...props} />)

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
  onRenderSettings,
  hideMarkdownToggle,
  getCustomComponent,
}) => {


  const handleCheckboxClick = event => {
    event.preventDefault()
    let newFilters = []

    if (filters.includes(event.target.name)) {
      newFilters = filters.filter(item => item !== event.target.name)
    } else {
      newFilters = [...filters, event.target.name]
    }

    setFilters(newFilters)
  }

  return (
    <StyledDraggableModal
      id='settings_card'
      open={open}
      title={title}
      handleClose={onClose}
    >
      <Card
        closeable
        title={title}
        onClose={onClose}
        classes={{
          root: classes.card,
          dragIndicator: 'draggable-dialog-title',
        }}
      >
        <Extensible onRenderItems={onRenderSettings}>
          <FormGroup
            row
            key='markdown-view-setting'
            classes={{ row: classes.formGroup }}
          >
            {!hideMarkdownToggle && (
              <FormControlLabel
                control={
                  <BlueSwitch
                    name='markdownView'
                    checked={markdownView}
                    onClick={() => onShowMarkdown(!markdownView)}
                    classes={{
                      switchBase: classes.switchBase,
                      checked: classes.checked,
                      track: classes.track
                    }} />
                }
                classes={{ label: classes.switchLabel }}
                label='Markdown View'
                labelPlacement='bottom'
              />
            )}
            {!!getCustomComponent && getCustomComponent()}
          </FormGroup>
          <Divider key='divider' />
          <div className={classes.fontSlider} key='font-slider-setting'>
            <FontSizeSlider value={fontSize} onChange={setFontSize} />
          </div>
          {!disableFilters && headers && headers.length > 0 && (
            <Fragment key='filters-setting'>
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
                    {headers.map((header, i) => (
                      <FormControlLabel
                        key={`${i}-${header}`}
                        label={header}
                        classes={{ root: classes.label }}
                        control={
                          <BlueCheckbox
                            name={header}
                            color='primary'
                            onClick={handleCheckboxClick}
                            checked={filters.includes(header)}
                            classes={{
                              root: classes.root,
                              checked: classes.checked2
                            }} />
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Fragment>
          )}
          {!!onRemoveCard && (
            <Fragment key='remove-resource-setting'>
              <Divider />
              <div className={classes.cardRemovalSection}>
                <div className={classes.removeText} onClick={onRemoveCard}>
                  Remove Resource Card
                </div>
              </div>
            </Fragment>
          )}
        </Extensible>
      </Card>
    </StyledDraggableModal>
  );
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
  /** Event handler to Remove Card. (optional - if not defined then remove card is not shown) */
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
