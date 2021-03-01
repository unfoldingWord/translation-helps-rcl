import { useState, useEffect } from 'react'

const useCardState = ({ items, selectedQuote = {}, setQuote }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const item = items ? items[itemIndex] : null
  const [markdownView, setMarkdownView] = useState(true)
  const [fontSize, setFontSize] = useState(100)
  const [headers, setHeaders] = useState([])
  const [filters, setFilters] = useState([])
  const { SupportReference, quote, occurrence } = selectedQuote || {}

  useEffect(() => {
    if (items && typeof SupportReference === 'string') {
      const index = items.findIndex(
        ({ SupportReference: itemSupportReference, Quote, Occurrence }) => {
          return (
            itemSupportReference.includes(SupportReference) &&
            quote === Quote &&
            occurrence === Occurrence
          )
        }
      )

      if (index >= 0) {
        setItemIndex(index)
      }
    } else {
      setItemIndex(0)
    }
  }, [items, SupportReference])

  useEffect(() => {
    let initialHeaders = Object.keys(item || {})
    initialHeaders = initialHeaders.filter(item => item !== 'markdown')
    setHeaders(initialHeaders)
  }, [item])

  useEffect(() => {
    setFilters(headers)
  }, [headers])

  function setItem(index) {
    setItemIndex(index)

    if (items) {
      const { Quote, Occurrence, SupportReference } = items[index] || {}
      if (Quote && Occurrence && typeof SupportReference === 'string') {
        setQuote({
          quote: Quote,
          occurrence: Occurrence,
          SupportReference,
        })
      }
    }
  }

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
      setItemIndex: setItem,
      setMarkdownView,
    },
  }
}

export default useCardState
