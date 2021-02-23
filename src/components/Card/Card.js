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
import Paper from '../Paper'
import SettingsCard from '../SettingsCard'

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    fontWeight: '700',
  },
  dragIcon: {
    color: '#ECECEC',
    margin: '0px 10px 0px 0px',
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
    padding: '4px 0px 0px 4px',
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

const Navigation = ({ items, classes, itemIndex, onPrevItem, onNextItem }) => (
  <FlexSpacedDiv>
    <ChevronLeftIcon className={classes.chevronIcon} onClick={onPrevItem} />
    <FlexDiv>{`${itemIndex + 1} of ${items.length}`}</FlexDiv>
    <ChevronRightIcon className={classes.chevronIcon} onClick={onNextItem} />
  </FlexSpacedDiv>
)

const Card = ({
  alert,
  title,
  items,
  dragRef,
  onClose,
  headers,
  filters,
  fontSize,
  dragging,
  children,
  itemIndex,
  closeable,
  setFilters,
  setFontSize,
  markdownView,
  setItemIndex,
  onRemoveCard,
  disableFilters,
  setMarkdownView,
  disableNavigation,
  disableSettingsButton,
  hideMarkdownToggle,
  getCustomComponent,
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
    console.log('onAlertClick')
  }

  const onMenuClick = () => {
    setShowMenu(!showMenu)
  }

  const onPrevItem = () => {
    const newIndex = itemIndex - 1
    if (newIndex < 0) {
      setItemIndex(items.length - 1)
    } else {
      setItemIndex(newIndex)
    }
  }

  const onNextItem = () => {
    const newIndex = itemIndex + 1
    if (newIndex > items.length - 1) {
      setItemIndex(0)
    } else {
      setItemIndex(newIndex)
    }
  }

  return (
    <Paper ref={dragRef} className={root}>
      <FlexSpacedDiv className={header}>
        <FlexDiv>
          <DragIndicatorIcon
            className={`${classes.dragIcon} ${dragIndicator}`}
          />
          <div className={classes.title}>{title}</div>
        </FlexDiv>
        <FlexDiv>
          {!disableNavigation && items && items.length > 1 && (
            <Navigation
              items={items}
              classes={classes}
              itemIndex={itemIndex}
              onPrevItem={onPrevItem}
              onNextItem={onNextItem}
            />
          )}
        </FlexDiv>
        {closeable ? (
          <CloseIcon className={classes.pointerIcon} onClick={onClose} />
        ) : (
          <FlexDiv>
            {alert && (
              <div
                className={`${classes.pointerIcon} ${classes.paddingRight}`}
                onClick={onAlertClick}
              >
                <Badge color='secondary' variant='dot'>
                  <AnnouncementIcon />
                </Badge>
              </div>
            )}
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
                className={classes.pointerIcon}
                onClick={onMenuClick}
              />
            )}
          </FlexDiv>
        )}
      </FlexSpacedDiv>
      <div className={`${classes.children} ${childrenClassName}`}>
        {children}
      </div>
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
  filters: [],
  headers: [],
  alert: false,
  fontSize: 100,
  dragging: false,
  closeable: false,
  disableFilters: false,
  disableNavigation: false,
  disableSettingsButton: false,
  hideMarkdownToggle: false,
}

Card.propTypes = {
  /** Array of items (articles, tsv files) */
  items: PropTypes.array,
  /** Array of TSV header labels */
  headers: PropTypes.array.isRequired,
  /** Current item index */
  itemIndex: PropTypes.number,
  /** Root ref, used as reference for drag action */
  dragRef: PropTypes.node,
  /** Show alert icon */
  alert: PropTypes.bool,
  /** Show dragging icon when card is dragged */
  dragging: PropTypes.bool,
  /** Show close (x) icon instead of three dot menu icon */
  closeable: PropTypes.bool,
  /** Class names to modify the root, header and children */
  classes: PropTypes.object,
  /** The title of the card*/
  title: PropTypes.string.isRequired,
  /** The title settings popup.  Optional, if not given, it will be created from title */
  settingsTitle: PropTypes.string,
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func,
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
