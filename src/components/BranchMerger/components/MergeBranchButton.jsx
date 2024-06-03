import React from 'react'
import { IconButton, Badge, CircularProgress, Tooltip } from '@mui/material'
import { PublishOutlined, Publish } from '@mui/icons-material'

export default function MergeBranchButton({
  onClick = () => undefined,
  isLoading = false,
  blocked = false,
  pending = false,
  loadingProps,
  title = 'Merge my work',
  ...props
}) {
  const Icon = blocked ? PublishOutlined : Publish
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          key='merge-to-master'
          onClick={onClick}
          aria-label={title}
          style={{ cursor: 'pointer', ...props.style }}
          // disabled={!pending | blocked}
        >
          {isLoading ? (
            <CircularProgress
              size={18}
              style={{
                margin: '3px 0px',
              }}
              {...loadingProps}
            />
          ) : (
            <Badge color='error' variant='dot' invisible={!pending}>
              <Icon id='merge-to-master-icon' />
            </Badge>
          )}
        </IconButton>
      </span>
    </Tooltip>
  )
}
