import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'


export const Scrollable = ({ className, children, itemIndex, enableAutoScrollToTop = false }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (enableAutoScrollToTop) {
      setTimeout(() => {
        scrollRef.current?.scrollTo(0, 0);
      }, 100)
    }
  }, [itemIndex]);

  return <div ref={scrollRef} className={className}>
    {children}
  </div>
}

Scrollable.propTypes = {
  /** Current item index, used as trigger to scroll to top */
  itemIndex: PropTypes.number,
  /** Function called when menu is closed */
  className: PropTypes.string.isRequired,
  /** Content/jsx render in the body of the card */
  children: PropTypes.node.isRequired,
  /** if true then we auto scroll to top when itemIndex changes */
  enableAutoScrollToTop: PropTypes.bool,
}

export default Scrollable
