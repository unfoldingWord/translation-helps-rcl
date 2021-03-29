import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import BlockEditable from 'markdown-translatable/dist/components/block-editable'
import DraggableModal from '../DraggableModal'
import Card from '../Card'

const useStyles = makeStyles(() => ({
  card: {
    margin: '35px !important',
    minWidth: '400px',
    backgroundColor: '#ffffff',
  },
}))

export default function DraggableCard({
  open,
  title,
  content,
  onClose,
  fontSize,
}) {
  const classes = useStyles()

  return (
    <DraggableModal
      id='draggable_article_card'
      open={open}
      title={title}
      handleClose={onClose}
    >
      <Card
        closeable
        title={title}
        onClose={onClose}
        classes={{
          root: classes.card,
          dragIndicator: 'draggable-dialog-title',
        }}
      >
        <BlockEditable
          preview
          markdown={content}
          editable={false}
          style={{
            fontSize,
          }}
        />
      </Card>
    </DraggableModal>
  )
}

DraggableCard.propTypes = {
  /** Determines whether the DraggableCard is opened or not */
  open: PropTypes.bool.isRequired,
  /** The title of the card */
  title: PropTypes.string.isRequired,
  /** DraggableCard content */
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]).isRequired,
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func.isRequired,
  /** Current text font size */
  fontSize: PropTypes.number.isRequired,
}
