import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import LinkChip from './LinkChip'
import PropTypes from 'prop-types'

const ErrorDialog = ({
  content,
  isLoading = false,
  link,
  linkTooltip = '',
  onClose,
  open,
  title,
}) => {
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

ErrorDialog.propTypes = {
  /** String or JSX representing main content of the dialog */
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Boolean indicating whether or not data that the error depends on is loading */
  isLoading: PropTypes.bool,
  /** String representing a url that the ErrorDialog LinkChip should link to */
  link: PropTypes.string,
  /** String representing text to display on LinkChip hover */
  linkTooltip: PropTypes.string,
  /** Function to be called when the user closes this error dialog */
  onClose: PropTypes.func,
  /** Boolean indicating whether or not the error dialog should be open */
  open: PropTypes.bool,
  /** String representing the title the error dialog should display */
  title: PropTypes.string,
}

export default ErrorDialog
