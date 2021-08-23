import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import BlockEditable from 'markdown-translatable/dist/components/block-editable'
import styled from 'styled-components'
import DraggableModal from '../DraggableModal'
import Card from '../Card'
import useBoundsUpdater from '../../hooks/useBoundsUpdater'
import stripReferenceLinksFromMarkdown from '../../core/stripReferenceLinksFromMarkdown'

const useStyles = makeStyles(() => ({
  card: {
    margin: '0px !important',
    minWidth: '400px',
    backgroundColor: '#ffffff',
  },
}))

const Message = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 35px 0px;
  font-weight: bold;
  word-break: break-word;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '100%')};
`

export default function DraggableCard({
  open,
  error,
  title,
  content,
  onClose,
  loading,
  fontSize,
  id,
  showRawContent,
  workspaceRef,
  initialPosition,
  updateBounds,
}) {
  const classes = useStyles()
  const cardRef = useRef(null)
  const displayState = {
    content,
    loading,
    error,
    showRawContent,
    updateBounds,
  }

  const {
    state: { bounds },
    actions: { doUpdateBounds },
  } = useBoundsUpdater({
    workspaceRef,
    cardRef,
    open,
    displayState,
  })

  function getCardContent() {
    if (showRawContent) {
      return content
    } else if (error) {
      return (
        <Message fontSize={fontSize}>
          Sorry, there was a problem loading the content.
        </Message>
      )
    } else if (loading) {
      return <Message fontSize={fontSize}>Loading...</Message>
    } else if (content) {
      return (
        <BlockEditable
          preview
          editable={false}
          fontSize={fontSize}
          markdown={stripReferenceLinksFromMarkdown(content)}
        />
      )
    } else {
      return <Message fontSize={fontSize}>No content available.</Message>
    }
  }

  function onStartDrag() {
    // drag started, do check to see if drag bounds need to be updated
    if (workspaceRef?.current) {
      const updated = doUpdateBounds()
      if (updated) {
        return false
      }
    }
    return true
  }

  title = error ? 'Error' : title

  return (
    <DraggableModal
      id={id}
      open={open}
      title={title || ''}
      handleClose={onClose}
      bounds={bounds}
      initialPosition={initialPosition}
      onStartDrag={onStartDrag}
    >
      <Card
        closeable
        title={title || ''}
        onClose={onClose}
        classes={{
          root: classes.card,
          dragIndicator: 'draggable-dialog-title',
        }}
        dragRef={cardRef}
      >
        {getCardContent()}
      </Card>
    </DraggableModal>
  )
}

DraggableCard.defaultProps = {
  id: 'draggable_article_card',
  title: '',
  content: '',
  fontSize: '100%',
  showRawContent: false,
  workspaceRef: null,
  updateBounds: 0,
}

DraggableCard.propTypes = {
  /** Determines whether the DraggableCard is opened or not */
  open: PropTypes.bool.isRequired,
  /** if true then content is not processed */
  showRawContent: PropTypes.bool,
  /** The title of the card */
  title: PropTypes.string,
  /** identifier for the card */
  id: PropTypes.string,
  /** DraggableCard content */
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]),
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func.isRequired,
  /** Current text font size prettier-ignore */
  fontSize: PropTypes.oneOfType([
    // prettier-ignore
    PropTypes.string,
    PropTypes.number,
  ]),
  /** Optional, used to make sure draggable card is contained within workspace */
  workspaceRef: PropTypes.object,
  /** override default initial position */
  initialPosition: PropTypes.object,
  /** trigger to update drag bounds */
  updateBounds: PropTypes.number,
}
