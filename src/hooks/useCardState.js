import { useState, useEffect } from 'react'

const useCardState = ({
  id,
  items,
  verse,
  chapter,
  setQuote,
  projectId,
  selectedQuote = {},
  useUserLocalStorage,
}) => {
  const [itemIndex, setItemIndex] = useState(0)
  const item = items ? items[itemIndex] : null
  const [headers, setHeaders] = useState([])
  const [filters, setFilters] = useUserLocalStorage
    ? useUserLocalStorage(`filters_${id}`, [...headers])
    : useState([])
  const [markdownView, setMarkdownView] = useState(false)
  const [fontSize, setFontSize] = useUserLocalStorage
    ? useUserLocalStorage(`fontSize_${id}`, 100)
    : useState(100)
  const { SupportReference, quote, occurrence } = selectedQuote || {}

  useEffect(() => {
    setItemIndex(0)
  }, [verse, chapter, projectId])

  useEffect(() => {
    if (items && typeof SupportReference === 'string') {
      const index = items.findIndex(
        ({
          Quote,
          TWLink,
          OrigWords,
          Occurrence,
          SupportReference: itemSupportReference,
        }) => {
          // Support new TWL column headers (OrigWords & TWLink)
          itemSupportReference = itemSupportReference || TWLink
          Quote = Quote || OrigWords

          return (
            itemSupportReference?.includes(SupportReference) &&
            quote === Quote &&
            occurrence === Occurrence
          )
        }
      )

      if (index >= 0 && index !== itemIndex) {
        setItemIndex(index)
      }
    }
  }, [items, SupportReference, quote, occurrence])

  useEffect(() => {
    let initialHeaders = Object.keys(item || {})
    initialHeaders = initialHeaders.filter(item => item !== 'markdown')
    setHeaders(initialHeaders)
  }, [item])

  function setItem(index) {
    setItemIndex(index)

    if (items) {
      let {
        Quote,
        OrigQuote,
        OrigWords,
        Occurrence,
        SupportReference,
        TWLink,
      } = items[index] || {}
      // Support new TWL column headers (OrigWords & TWLink)
      Quote = !Quote && OrigWords ? OrigWords : Quote
      SupportReference = !SupportReference && TWLink ? TWLink : SupportReference
      Quote = !Quote && OrigQuote ? OrigQuote : Quote

      if (
        setQuote &&
        (Quote || OrigQuote) &&
        Occurrence &&
        typeof SupportReference === 'string'
      ) {
        setQuote({
          quote: Quote || OrigQuote,
          occurrence: Occurrence,
          SupportReference,
        })
      } else if (setQuote) {
        setQuote(null)
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
