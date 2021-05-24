import { useState, useEffect } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import determineDiffTsvVersion from '../core/DetermineDiffTsvVersion'

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
    ? useUserLocalStorage(`filters_${id}`, null)
    : useState(null)
  const [markdownView, setMarkdownView] = useUserLocalStorage
    ? useUserLocalStorage(`markdownView${id}`, false)
    : useState(false)
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

  useDeepCompareEffect(() => {
    if (!filters && headers.length) {
      setFilters(headers)
    } else if (filters && filters.length && headers.length) {
      const isDifferentTsvVersion = determineDiffTsvVersion(filters, headers)

      if (isDifferentTsvVersion) {
        setFilters(headers)
      }
    }
  }, [headers])

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
      fontSize,
      itemIndex,
      markdownView,
      filters: filters || [],
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
