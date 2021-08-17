import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import Draggable from 'react-draggable'

export default function DraggableModal({
  open,
  handleClose,
  children,
  id,
  onStopDrag,
  bounds,
 }) {

  function PaperComponent(props) {
    function onStop_(e) {
      console.log('PaperComponent.onStop_', e)
      onStopDrag && onStopDrag(e)
    }

    return (
      <Draggable
        handle='.draggable-dialog-title'
        cancel={'[class*="MuiDialogContent-root"]'}
        onStop={onStop_}
        bounds={bounds}
      >
        <div {...props} />
      </Draggable>
    )
  }

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
  /** callback for drag stop */
  onStopDrag: PropTypes.func,
  /** optional drag limits */
  bounds: PropTypes.object,
}
