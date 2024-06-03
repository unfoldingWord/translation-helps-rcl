import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Chip, Snackbar, Tooltip } from '@mui/material'
import { FileCopy as FileCopyIcon, Link as LinkIcon } from '@mui/icons-material'

const openLink = link => window.open(link, '_blank')

export default function LinkChip({
  link,
  style,
  onClick: _onClick = () => true,
  linkTooltip,
}) {
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  const icon = <LinkIcon />

  const label = (
    <Tooltip title={linkTooltip} arrow>
      <span>{link}</span>
    </Tooltip>
  )

  const endIcon = (
    <Tooltip title={'copy link'} arrow>
      <FileCopyIcon />
    </Tooltip>
  )

  const onCopy = () => {
    setOpen(true)
    navigator.clipboard.writeText(link)
  }

  const onClick = e => {
    const go = _onClick(e)
    if (go) openLink(link)
  }

  const dataTestId = `link-chip-${label}`

  const props = {
    onClick,
    icon,
    label,
    onDelete: onCopy,
    deleteIcon: endIcon,
    variant: 'outlined',
    className: classes.header,
    style,
  }

  return (
    <>
      <Chip {...props} data-test-id={dataTestId} />
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message='Copied to clipboard'
      />
    </>
  )
}

const useStyles = makeStyles(theme => ({
  header: {
    cursor: 'pointer',
    justifyContent: 'space-between',
    width: '100%',
  },
}))
