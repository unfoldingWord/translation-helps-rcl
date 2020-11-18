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
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.15);
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

const Navigation = ({ notes, classes, noteIndex, onPrevItem, onNextItem }) => (
  <FlexSpacedDiv>
    <ChevronLeftIcon className={classes.chevronIcon} onClick={onPrevItem} />
    <FlexDiv>{`${noteIndex + 1} of ${notes.length}`}</FlexDiv>
    <ChevronRightIcon className={classes.chevronIcon} onClick={onNextItem} />
  </FlexSpacedDiv>
)

const Card = ({
  alert,
  title,
  notes,
  dragRef,
  onClose,
  dragging,
  children,
  noteIndex,
  closeable,
  setNoteIndex,
  classes: { root, dragIndicator, header, children: childrenClassName },
}) => {
  const classes = useStyles({ dragging })

  const onAlertClick = () => {
    console.log('onAlertClick')
  }

  const onMenuClick = () => {
    console.log('onMenuClick')
  }

  const onPrevItem = () => {
    const newIndex = noteIndex - 1
    if (newIndex < 0) {
      setNoteIndex(notes.length - 1)
    } else {
      setNoteIndex(newIndex)
    }
  }

  const onNextItem = () => {
    const newIndex = noteIndex + 1
    if (newIndex > notes.length - 1) {
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
          {notes && notes.length > 1 && (
            <Navigation
              notes={notes}
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
  /** Array of notes (articles, tsv files) */
  notes: PropTypes.array,
  /** JSX text for the title */
  title: PropTypes.node.isRequired,
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func,
  /** Content/jsx render in the body of the card */
  children: PropTypes.node.isRequired,
}

export default Card
