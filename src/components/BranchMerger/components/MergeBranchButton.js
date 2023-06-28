import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Tooltip } from '@material-ui/core'
import { MdOutlinePublish, MdPublish } from 'react-icons/md'
import PropTypes from 'prop-types'

const MergeBranchButton = ({
  onClick = () => undefined,
  isLoading = false,
  blocked = false,
  pending = false,
  loadingProps = {},
  title = 'Merge my work',
  ...props
}) => {
  const Icon = blocked ? MdOutlinePublish : MdPublish
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

MergeBranchButton.propTypes = {
  /** Function to be called when the user clicks on the merge branch button */
  onClick: PropTypes.func,
  /** Boolean indicating whether or not merge is currently loading */
  isLoading: PropTypes.bool,
  /** Boolean indicating if merging is blocked (unable to merge) */
  blocked: PropTypes.bool,
  /** Boolean indicating if merge is currently needed  */
  pending: PropTypes.bool,
  /** Props object to pass into the CircularProgress MUI Component */
  loadingProps: PropTypes.object,
  /** String representing the title shown when hovering merge branch button */
  title: PropTypes.string,
}

export default MergeBranchButton
