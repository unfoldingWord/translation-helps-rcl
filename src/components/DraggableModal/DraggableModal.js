import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import Draggable from 'react-draggable'

export default function DraggableModal({
  open,
  handleClose,
  children,
  id,
  onStartDrag,
  bounds,
  initialPosition,
 }) {

  const PaperComponent = useCallback( (props) => {
    function onStart(e) {
      if (onStartDrag) {
        return onStartDrag(e)
      }
      return true
    }

    return (
      <Draggable
        handle='.draggable-dialog-title'
        cancel={'[class*="MuiDialogContent-root"]'}
        onStart={onStart}
        bounds={bounds}
        defaultPosition={initialPosition}
      >
        <div {...props} />
      </Draggable>
    )
  }, [onStartDrag, bounds, initialPosition])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-describedby={id}
      aria-labelledby='draggable-dialog-title'
      BackdropProps={{
        style: {
          backgroundColor: 'transparent',
        },
      }}
    >
      {children}
    </Dialog>
  )
}

DraggableModal.propTypes = {
  /** Determines whether the DraggableModal is opened or not */
  open: PropTypes.bool.isRequired,
  /** On close event handler */
  handleClose: PropTypes.func.isRequired,
  /** Modal Content */
  children: PropTypes.element.isRequired,
  /** optional callback for drag start */
  onStartDrag: PropTypes.func,
  /** optional drag limits */
  bounds: PropTypes.object,
  /** override default initial position */
  initialPosition: PropTypes.object,
}
