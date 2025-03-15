import { useEffect, useState } from 'react'
import isEqual from 'deep-equal'

/**
 * monitors for changes in changes in draggable bounds.  Provides updateBounds() so that it can be updated by external events.
 * @param {object} workspaceRef - reference for workspace to get size of the workspace
 * @param {object} cardRef - reference of draggable card content
 * @param {object} displayState - object that contains the values that control displayed size
 * @param {boolean} open - true when card is open
 * @return {{state: {headers: *, item: *, itemIndex: *, fontSize: (string|*), filters: (*|*[]), markdownView: *}, actions: {setMarkdownView: *, setItemIndex: *, setFilters: *, setFontSize: *}}}
 */
const useBoundsUpdater = ({
  workspaceRef,
  cardRef,
  displayState,
  open,
}) => {
  const [ bounds, setBounds ] = useState(null)

  /**
   * determines if bounds have changed for dragging
   * @return {boolean} returns true if bounds changed
   */
  function doUpdateBounds() {
    if (open &&
      workspaceRef?.current?.clientWidth &&
      workspaceRef?.current?.clientHeight &&
      cardRef?.current) {
      const {clientLeft, clientWidth, clientTop, clientHeight} = workspaceRef.current
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
      const safetyMargin = 35
      right -= safetyMargin
      bottom -= safetyMargin

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
    doUpdateBounds()
  }, [
    workspaceRef?.current,
    cardRef?.current,
    displayState
  ])

  return {
    state: { bounds },
    actions: { doUpdateBounds },
  }
}

export default useBoundsUpdater
