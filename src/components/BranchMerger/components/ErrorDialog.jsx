import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import LinkChip from './LinkChip'

export default function ErrorDialog({
  onClose,
  title,
  open,
  isLoading = false,
  content,
  link,
  linkTooltip = '',
}) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        {link ? <LinkChip link={link} linkTooltip={linkTooltip} /> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' disabled={isLoading}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}
