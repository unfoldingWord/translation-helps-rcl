import { useEffect, useState } from 'react'
import isEqual from 'deep-equal'

/**
 * monitors for changes in changes in draggable bounds.  Provides updateBounds() so that it can be updated by external events.
 * @param parentRef
 * @param cardRef
 * @param displayState
 * @return {{state: {headers: *, item: *, itemIndex: *, fontSize: (string|*), filters: (*|*[]), markdownView: *}, actions: {setMarkdownView: *, setItemIndex: *, setFilters: *, setFontSize: *}}}
 */
const useBoundsUpdater = ({
  parentRef,
  cardRef,
  displayState
}) => {
  const [ bounds, setBounds ] = useState(null)

  /**
   * determines if bounds have changed for dragging
   * @return {boolean} returns true if bounds changed
   */
  function updateBounds() {
    if (parentRef?.current?.clientWidth && parentRef?.current?.clientHeight && cardRef?.current) {
      const {clientLeft, clientWidth, clientTop, clientHeight} = parentRef.current
      const {offsetLeft: cardOffsetLeft, offsetTop: cardOffsetTop} = cardRef.current
      let offsetLeft = cardOffsetLeft
      let offsetTop = cardOffsetTop

      if (cardRef.current.offsetParent) { // add card parent offset if present
        offsetLeft += cardRef.current.offsetParent.offsetLeft
        offsetTop += cardRef.current.offsetParent.offsetTop
      }

      let right = clientLeft + clientWidth - offsetLeft;
      let bottom = clientTop + clientHeight - offsetTop;

      // tweak right and bottom so draggable handle stays on screen
      const scrollBarFactor = 1.25 // in case workspace scroll bar is visible (browser dependent)
      right -= Math.round(cardOffsetLeft * scrollBarFactor)
      bottom -= Math.round(cardOffsetTop * scrollBarFactor)

      const newBounds = {
        left: clientLeft - offsetLeft,
        top: clientTop - offsetTop,
        right,
        bottom,
      }
      if (!isEqual(bounds, newBounds)) { // update if changed
        setBounds(newBounds)
        return true
      }
    } else if (bounds !== null) {
      setBounds(null)
      return true
    }
    return false
  }

  useEffect(() => {
    updateBounds()
  }, [
    {
      parentCurrent: parentRef?.current,
      cardCurrent: cardRef?.current,
      displayState,
    }
  ])

  return {
    state: { bounds },
    actions: { updateBounds },
  }
}

export default useBoundsUpdater
