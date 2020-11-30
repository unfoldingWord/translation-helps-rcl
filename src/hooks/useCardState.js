import { useState, useEffect } from 'react'

const useCardState = ({ items }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const item = items ? items[itemIndex] : null
  const [markdownView, setMarkdownView] = useState(true)
  const [fontSize, setFontSize] = useState(100)
  const [headers, setHeaders] = useState([])
  const [filters, setFilters] = useState([])

  useEffect(() => {
    const initialHeaders = Object.keys(item || {})
    setHeaders(initialHeaders)
  }, [item])

  useEffect(() => {
    setFilters(headers)
  }, [headers])

  return {
    state: {
      item,
      headers,
      filters,
      fontSize,
      itemIndex,
      markdownView,
    },
    actions: {
      setFilters,
      setFontSize,
      setItemIndex,
      setMarkdownView,
    },
  }
}

export default useCardState
