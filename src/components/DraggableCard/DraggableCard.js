import React, { useEffect, useRef, useState } from 'react'
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
  parentRef,
}) {
  const classes = useStyles()
  const cardRef = useRef(null)
  const [ bounds, setBounds ] = useState(null)

  useEffect(() => {
    if (parentRef?.current?.clientWidth && parentRef?.current?.clientHeight && cardRef?.current) {
      const { clientLeft, clientWidth, clientTop, clientHeight } = parentRef.current
      const { offsetLeft: cardOffsetLeft, offsetTop: cardOffsetTop } = cardRef.current
      let offsetLeft = cardOffsetLeft
      let offsetTop = cardOffsetTop

      if (cardRef.current.offsetParent) { // add parent offset if present
        offsetLeft += cardRef.current.offsetParent.offsetLeft
        offsetTop += cardRef.current.offsetParent.offsetTop
      }

      let right = clientLeft + clientWidth - offsetLeft;
      let bottom = clientTop + clientHeight - offsetTop;

      // tweak right and bottom so draggable handle stays on screen
      right -= cardOffsetLeft
      bottom -= cardOffsetTop

      const newBounds = {
        left: clientLeft - offsetLeft,
        top: clientTop - offsetTop,
        right,
        bottom,
      }
      setBounds(newBounds)
    } else {
      setBounds(null)
    }
  }, [
    parentRef?.current,
    cardRef?.current?.offsetLeft,
    cardRef?.current?.offsetTop,
    cardRef?.current?.offsetParent?.offsetLeft,
    cardRef?.current?.offsetParent?.offsetTop,
    content,
    loading
  ])

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

  function onStopDrag(e) {
    console.log('DraggableCard.onStopDrag', e)
    const { clientX, clientY } = e
    const { clientHeight, clientWidth } = parentRef?.current || {}
    console.log({ clientX, clientY, clientHeight, clientWidth })
    const min = 0
    if (parentRef?.current) {
      if ((clientX < min) || (clientY < min)
        || (clientX > clientWidth - min) || (clientY > clientHeight - min)) {
        console.log('outside of range')
      }
    }
  }

  title = error ? 'Error' : title

  return (
    <DraggableModal
      id={id}
      open={open}
      title={title || ''}
      handleClose={onClose}
      onStopDrag={onStopDrag}
      bounds={bounds}
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
  parentRef: null,
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
  /** Optional, used to make sure draggable card is contained within parent */
  parentRef: PropTypes.object,
  // /** optional drag limits */
  // bounds: PropTypes.object,
}
