import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Badge from '@material-ui/core/Badge'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SettingsCard from '../SettingsCard'

const useStyles = makeStyles(() => ({
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
    textAlign: 'start',
    padding: '4px 0px 0px 4px',
  },
  paddingRight: {
    padding: '0px 15px 0px 0px',
  },
}))

const Paper = styled.div`
  margin: 2.5px;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 14px 20px 2px rgba(0, 0, 0, 0.14),
    0 6px 26px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  margin-bottom: 50px;
  transition: all 0.2s ease-in-out;
`

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`

const FlexSpacedDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const Navigation = ({ items, classes, noteIndex, onPrevItem, onNextItem }) => (
  <FlexSpacedDiv>
    <ChevronLeftIcon className={classes.chevronIcon} onClick={onPrevItem} />
    <FlexDiv>{`${noteIndex + 1} of ${items.length}`}</FlexDiv>
    <ChevronRightIcon className={classes.chevronIcon} onClick={onNextItem} />
  </FlexSpacedDiv>
)

const Card = ({
  alert,
  title,
  items,
  dragRef,
  onClose,
  dragging,
  children,
  noteIndex,
  closeable,
  setNoteIndex,
  classes: { root, dragIndicator, header, children: childrenClassName },
}) => {
  const [fontSize, setFontSize] = useState(100)
  const [showMenu, setShowMenu] = useState(false)
  const [markdownView, setMarkdownView] = useState(false)
  const headers = [
    'Book',
    'Chapter',
    'Verse',
    'ID',
    'Support Reference',
    'Original Quote',
    'Occurrence',
    'Occurrence Note',
  ]
  const [filters, setFilters] = useState(headers)
  const classes = useStyles({ dragging })

  const onAlertClick = () => {
    console.log('onAlertClick')
  }

  const onMenuClick = () => {
    setShowMenu(!showMenu)
  }

  const onPrevItem = () => {
    const newIndex = noteIndex - 1
    if (newIndex < 0) {
      setNoteIndex(items.length - 1)
    } else {
      setNoteIndex(newIndex)
    }
  }

  const onNextItem = () => {
    const newIndex = noteIndex + 1
    if (newIndex > items.length - 1) {
      setNoteIndex(0)
    } else {
      setNoteIndex(newIndex)
    }
  }

  return (
    <Paper ref={dragRef} className={root}>
      <FlexSpacedDiv className={header}>
        <FlexDiv>
          <DragIndicatorIcon
            className={`${classes.dragIcon} ${dragIndicator}`}
          />
          <div>{title}</div>
        </FlexDiv>
        <FlexDiv>
          {items && items.length > 1 && (
            <Navigation
              items={items}
              classes={classes}
              noteIndex={noteIndex}
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
                <Badge
                  color='secondary'
                  variant='dot'
                  // invisible={invisible}
                >
                  <AnnouncementIcon />
                </Badge>
              </div>
            )}
            {showMenu && (
              <SettingsCard
                title={title}
                open={showMenu}
                headers={headers}
                filters={filters}
                fontSize={fontSize}
                onClose={onMenuClick}
                setFilters={setFilters}
                setFontSize={setFontSize}
                markdownView={markdownView}
                onShowMarkdown={setMarkdownView}
                onRemoveCard={() => console.log('onRemoveCard')}
              />
            )}
            <MoreHorizIcon
              className={classes.pointerIcon}
              onClick={onMenuClick}
            />
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
  alert: false,
  dragging: false,
  closeable: false,
}

Card.propTypes = {
  /** Current note index */
  noteIndex: PropTypes.number,
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
  /** Array of items (articles, tsv files) */
  items: PropTypes.array,
  /** JSX text for the title */
  title: PropTypes.node.isRequired,
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func,
  /** Content/jsx render in the body of the card */
  children: PropTypes.node.isRequired,
}

export default Card
