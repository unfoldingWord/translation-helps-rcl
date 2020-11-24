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

export default function DraggableCard({ open, handleClose, children }) {
  return (
    <Dialog
      open={open}
      disableBackdropClick
      onClose={handleClose}
      BackdropProps={{
        style: {
          backgroundColor: 'transparent',
        },
      }}
      PaperComponent={PaperComponent}
      aria-labelledby='draggable-dialog-title'
    >
      {children}
    </Dialog>
  )
}
