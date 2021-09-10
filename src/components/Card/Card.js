import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Badge from '@material-ui/core/Badge'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SaveIcon from '@material-ui/icons/Save'
import IconButton from '@material-ui/core/IconButton'
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import Paper from '../Paper'
import SettingsCard from '../SettingsCard'
import Scrollable from '../Scrollable'

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: `Noto Sans`,
    maxWidth: '100%',
    color: '#424242',
    lineHeight: '14px',
    wordBreak: 'break-word',
  },
  dragIcon: {
    color: '#ECECEC',
    margin: '0px',
    cursor: props => (props.dragging ? 'grabbing' : 'grab'),
  },
  chevronIcon: {
    margin: '0px 12px',
    cursor: 'pointer',
  },
  pointerIcon: {
    cursor: 'pointer',
  },
  children: {
    height: '100%',
    overflow: 'auto',
    textAlign: 'start',
    padding: '0px 6px',
  },
  paddingRight: {
    padding: '0px 15px 0px 0px',
  },
}))

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`

const FlexSpacedDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const NavigationFlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const Navigation = ({
  items,
  classes,
  itemIndex,
  onPrevItem,
  onNextItem,
  baseId,
}) => (
  <FlexSpacedDiv>
    <ChevronLeftIcon
      className={classes.chevronIcon}
      id={`${baseId}_prev`}
      onClick={onPrevItem}
    />
    <FlexDiv id={`${baseId}_nav`}>{`${itemIndex + 1} of ${
      items.length
    }`}</FlexDiv>
    <ChevronRightIcon
      className={classes.chevronIcon}
      id={`${baseId}_next`}
      onClick={onNextItem}
    />
  </FlexSpacedDiv>
)

const Card = ({
  id,
  alert,
  title,
  items,
  saved,
  dragRef,
  onClose,
  headers,
  filters,
  fontSize,
  dragging,
  children,
  editable,
  itemIndex,
  closeable,
  setFilters,
  onSaveEdit,
  setContent,
  setFontSize,
  onMenuClose,
  markdownView,
  setItemIndex,
  onRemoveCard,
  disableFilters,
  cardResourceId,
  setMarkdownView,
  disableNavigation,
  hideMarkdownToggle,
  getCustomComponent,
  disableSettingsButton,
  showSaveChangesPrompt,
  settingsTitle: settingsTitle_,
  classes: { root, dragIndicator, header, children: childrenClassName },
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const classes = useStyles({ dragging })

  let settingsTitle = settingsTitle_
  if (!settingsTitle) {
    // if settingsTitle not given, generate from title
    if (typeof title === 'string') {
      // handle the easy case where title is a string
      settingsTitle = `${title} Settings`
    } else {
      // Fall back to basic prompt
      settingsTitle = 'Settings'
    }
  }

  const onAlertClick = () => {
    console.info('onAlertClick')
  }

  const onMenuClick = () => {
    setShowMenu(!showMenu)
    onMenuClose && onMenuClose()
  }

  const onPrevItem = () => {
    console.log('hello')
    showSaveChangesPrompt(cardResourceId, setContent)
      .then(() => {
        const newIndex = itemIndex - 1
        if (newIndex < 0) {
          setItemIndex(items.length - 1)
        } else {
          setItemIndex(newIndex)
        }
      })
      .catch(() => {
        // User won't navigate to new item in order to save changes
      })
  }

  const onNextItem = () => {
    showSaveChangesPrompt(cardResourceId, setContent)
      .then(() => {
        const newIndex = itemIndex + 1
        if (newIndex > items.length - 1) {
          setItemIndex(0)
        } else {
          setItemIndex(newIndex)
        }
      })
      .catch(() => {
        // User won't navigate to new item in order to save changes
      })
  }

  const cardMenuId = id ? `${id}_card_menu` : 'card_menu'

  // TODO: In future we might want to add scroll into view support for list view, but for now
  // we don't want list views scrolling to top each time the itemIndex changes
  const enableAutoScrollToTop = children?.props?.viewMode !== 'list'

  return (
    <Paper id={id} ref={dragRef} className={root}>
      <FlexSpacedDiv className={header}>
        <FlexDiv>
          <DragIndicatorIcon
            id={`${id}_drag_indicator`}
            className={`${classes.dragIcon} ${dragIndicator}`}
          />
          <div id={`${id}_title`} className={classes.title}>
            {title}
          </div>
        </FlexDiv>
        {closeable ? (
          <CloseIcon
            id='settings_card_close'
            className={classes.pointerIcon}
            onClick={onClose}
          />
        ) : (
          <FlexDiv>
            {alert && (
              <IconButton
                aria-label='save'
                onClick={onAlertClick}
                className={classes.margin}
              >
                <Badge color='secondary' variant='dot'>
                  <AnnouncementIcon htmlColor='#000' />
                </Badge>
              </IconButton>
            )}
            {!hideMarkdownToggle ? (
              <IconButton
                title={markdownView ? 'Preview' : 'Markdown'}
                aria-label={markdownView ? 'Preview' : 'Markdown'}
                onClick={() => setMarkdownView(!markdownView)}
                className={classes.margin}
              >
                {markdownView ? (
                  <VisibilityOffIcon id='visibility_icon' htmlColor='#000' />
                ) : (
                  <VisibilityIcon id='visibility_icon' htmlColor='#000' />
                )}
              </IconButton>
            ) : null}
            {editable ? (
              <IconButton
                disabled={saved}
                className={classes.margin}
                onClick={() => onSaveEdit()}
                title={saved ? 'Saved' : 'Save'}
                aria-label={saved ? 'Saved' : 'Save'}
                style={{ cursor: saved ? 'none' : 'pointer ' }}
              >
                {saved ? (
                  <SaveOutlinedIcon id='saved_icon' />
                ) : (
                  <SaveIcon id='save_icon' htmlColor='#000' />
                )}
              </IconButton>
            ) : null}
            {showMenu && (
              <SettingsCard
                title={settingsTitle}
                open={showMenu}
                headers={headers}
                filters={filters}
                fontSize={fontSize}
                onClose={onMenuClick}
                setFilters={setFilters}
                setFontSize={setFontSize}
                markdownView={markdownView}
                onRemoveCard={onRemoveCard}
                disableFilters={disableFilters}
                onShowMarkdown={setMarkdownView}
                hideMarkdownToggle={hideMarkdownToggle}
                getCustomComponent={getCustomComponent}
              />
            )}
            {!disableSettingsButton && (
              <MoreVertIcon
                id={cardMenuId}
                className={classes.pointerIcon}
                onClick={onMenuClick}
              />
            )}
          </FlexDiv>
        )}
      </FlexSpacedDiv>
      <FlexSpacedDiv className={header}>
        <NavigationFlexDiv>
          {!disableNavigation && items && items.length > 1 && (
            <Navigation
              baseId={id}
              items={items}
              classes={classes}
              itemIndex={itemIndex}
              onPrevItem={onPrevItem}
              onNextItem={onNextItem}
            />
          )}
        </NavigationFlexDiv>
      </FlexSpacedDiv>
      <Scrollable
        className={`${classes.children} ${childrenClassName}`}
        children={children}
        itemIndex={itemIndex}
        enableAutoScrollToTop={enableAutoScrollToTop}
      />
    </Paper>
  )
}

Card.defaultProps = {
  classes: {
    root: '',
    header: '',
    children: '',
    dragIndicator: '',
  },
  title: '',
  filters: [],
  headers: [],
  alert: false,
  fontSize: 100,
  editable: false,
  saved: false,
  dragging: false,
  closeable: false,
  disableFilters: false,
  disableNavigation: false,
  hideMarkdownToggle: false,
  disableSettingsButton: false,
  onSaveEdit: () => console.info('onSaveEdit() funct not passed'),
}

Card.propTypes = {
  /** Array of items (articles, tsv files) */
  items: PropTypes.array,
  /** identifier to use for card */
  id: PropTypes.string,
  /** Array of TSV header labels */
  headers: PropTypes.array.isRequired,
  /** Current item index */
  itemIndex: PropTypes.number,
  /** Root ref, used as reference for drag action */
  dragRef: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  /** Show alert icon */
  alert: PropTypes.bool,
  /** Show dragging icon when card is dragged */
  dragging: PropTypes.bool,
  /** Show close (x) icon instead of three dot menu icon */
  closeable: PropTypes.bool,
  /** Class names to modify the root, header and children */
  classes: PropTypes.object,
  /** The title of the card*/
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  /** The title settings popup.  Optional, if not given, it will be created from title */
  settingsTitle: PropTypes.string,
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func,
  /** Function called when menu is closed */
  onMenuClose: PropTypes.func,
  /** Content/jsx render in the body of the card */
  children: PropTypes.node.isRequired,
  /** Array of TSV header filters (this is array of header items that are currently selected) */
  filters: PropTypes.array.isRequired,
  /** Updates the filters list */
  setFilters: PropTypes.func,
  /** Text font size */
  fontSize: PropTypes.number,
  /** Updates the font size */
  setFontSize: PropTypes.func,
  /** Event handler to Remove Card */
  onRemoveCard: PropTypes.func,
  /** Disables the filters checkboxes in the settings card. */
  disableFilters: PropTypes.bool,
  /** Disables the item navigation. */
  disableNavigation: PropTypes.bool,
  /** Disables the settings button */
  disableSettingsButton: PropTypes.bool,
  /** when true markdown toggle is hidden in settings (optional - default is visible) */
  hideMarkdownToggle: PropTypes.bool,
  /** current state for markdown toggle in settings */
  markdownView: PropTypes.bool,
  /** updates state for markdown toggle in settings */
  setMarkdownView: PropTypes.func,
  /** function to get a custom component to add to settings card (optional) */
  getCustomComponent: PropTypes.func,
}

export default Card
