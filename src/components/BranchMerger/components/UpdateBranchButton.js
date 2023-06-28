import React from 'react'
import { MdUpdate, MdUpdateDisabled } from 'react-icons/md'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Tooltip } from '@material-ui/core'
import PropTypes from 'prop-types'

const UpdateBranchButton = ({
  onClick = () => undefined,
  isLoading = false,
  blocked = false,
  pending = false,
  loadingProps,
  title = 'Update my content',
  ...props
}) => {
  const Icon = blocked ? MdUpdateDisabled : MdUpdate
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          key='update-from-master'
          onClick={onClick}
          aria-label={title}
          style={{
            cursor: 'pointer',
            ...props.style,
            ...(!pending | blocked ? { color: 'rgba(0, 0, 0, 0.26)' } : {}),
          }}
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
            <Badge
              color='error'
              variant='dot'
              overlap='circular'
              invisible={!pending}
            >
              <Icon id='update-from-master-icon' />
            </Badge>
          )}
        </IconButton>
      </span>
    </Tooltip>
  )
}

UpdateBranchButton.propTypes = {
  /** Function to be called when the user clicks on the update branch button */
  onClick: PropTypes.func,
  /** Boolean indicating whether or not update is currently loading */
  isLoading: PropTypes.bool,
  /** Boolean indicating if merging is blocked (unable to update) */
  blocked: PropTypes.bool,
  /** Boolean indicating if update is currently needed  */
  pending: PropTypes.bool,
  /** Props object to pass into the CircularProgress MUI Component */
  loadingProps: PropTypes.object,
  /** String representing the title shown when hovering update branch button */
  title: PropTypes.string,
}

export default UpdateBranchButton
