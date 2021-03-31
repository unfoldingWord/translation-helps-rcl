import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import BlockEditable from 'markdown-translatable/dist/components/block-editable'
import styled from 'styled-components'
import DraggableModal from '../DraggableModal'
import Card from '../Card'
import stripReferenceLinksFromMarkdown from '../../core/stripReferenceLinksFromMarkdown'

const useStyles = makeStyles(() => ({
  card: {
    margin: '35px !important',
    minWidth: '400px',
    backgroundColor: '#ffffff',
  },
}))

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 35px 0px;
  font-weight: bold;
  height: 100%;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '100%')};
`

export default function DraggableCard({
  open,
  title,
  content,
  onClose,
  loading,
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
        {loading ? (
          <Message fontSize={fontSize}>Loading...</Message>
        ) : content ? (
          <BlockEditable
            preview
            markdown={stripReferenceLinksFromMarkdown(content)}
            editable={false}
            style={{
              fontSize,
            }}
          />
        ) : (
          <Message fontSize={fontSize}>No content available.</Message>
        )}
      </Card>
    </DraggableModal>
  )
}

DraggableCard.defaultProps = {
  title: '',
  content: '',
  fontSize: '100%',
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
  /** Current text font size prettier-ignore */
  fontSize: PropTypes.oneOfType([
    // prettier-ignore
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
}
