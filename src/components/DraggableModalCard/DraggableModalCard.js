import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Draggable from 'react-draggable'

function PaperComponent(props) {
  return (
    <Draggable
      handle='.draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div {...props} />
    </Draggable>
  )
}

export default function DraggableModalCard({ open, handleClose, children }) {
  return (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      onClose={handleClose}
      PaperComponent={PaperComponent}
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
