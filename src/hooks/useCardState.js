import { useState, useEffect } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import determineDiffTsvVersion from '../core/determineDiffTsvVersion'

const useCardState = ({
  chapter,
  id,
  initialFilters = null,
  items,
  projectId,
  resourceId,
  selectedQuote = {},
  setCurrentCheck,
  useUserLocalStorage,
  verse,
}) => {
  const [itemIndex, setItemIndex] = useState(0)
  const item = items ? items[itemIndex] : null
  let initialHeaders = Object.keys(item || {})
  initialHeaders = initialHeaders.filter(
    item =>
      item !== 'markdown' && item !== 'filePath' && item !== 'fetchResponse'
  )
  const [headers, setHeaders] = useUserLocalStorage
    ? useUserLocalStorage(`headers_${id}`, [])
    : useState([])
  const [filters, setFilters] = useUserLocalStorage
    ? useUserLocalStorage(`filters_${id}`, null)
    : useState(initialFilters)
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
      let index = items.findIndex(
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

      // When the quote or occurrence is changed in the twl we want to find the item index using the TWLink field
      if (index == -1 && resourceId == 'tw') {
        index = items.findIndex(
          ({ TWLink, SupportReference: itemSupportReference }) => {
            // Support new TWL column headers (TWLink)
            itemSupportReference = itemSupportReference || TWLink

            return itemSupportReference?.includes(SupportReference)
          }
        )
      }

      if (index >= 0 && index !== itemIndex) {
        setItemIndex(index)
      }
    }
  }, [items, SupportReference, quote, occurrence])

  useDeepCompareEffect(() => {
    if (headers?.length === 0) {
      setHeaders(initialHeaders)
    }
  }, [item, headers])

  /**
   * Initializes filters based on the provided initial filters or headers.
   * If initialFilters are available, they are set as the filters. Otherwise,
   * headers are used as the filters if they are available.
   *
   * @param {Array} initialFilters - An array containing the initial filter values.
   * @param {Array} headers - An array containing header values to fall back on if initialFilters are not provided.
   * @return {void} This function does not return any value.
   */
  function initializeFilters(initialFilters, headers) {
    if (initialFilters?.length > 0) {
      setFilters(initialFilters)
    } else if (headers?.length > 0) {
      setFilters(headers)
    }
  }

  useDeepCompareEffect(() => {
    if (!filters) {
      initializeFilters(initialFilters, headers);
    }
  }, [headers])

  useDeepCompareEffect(() => {
    if (
      initialHeaders?.length &&
      headers?.length &&
      determineDiffTsvVersion(initialHeaders, headers)
    ) {
      // If different Tsv Version reset headers & filters.
      setHeaders(initialHeaders)
      initializeFilters(initialFilters, initialHeaders)
    }
  }, [item, headers])

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
        Reference,
      } = items[index] || {}
      // Support new TWL column headers (OrigWords & TWLink)
      Quote = !Quote && OrigWords ? OrigWords : Quote
      SupportReference = !SupportReference && TWLink ? TWLink : SupportReference
      Quote = !Quote && OrigQuote ? OrigQuote : Quote

      if (
        setCurrentCheck &&
        (typeof Quote === 'string' || typeof OrigQuote === 'string') &&
        typeof Occurrence === 'string' &&
        typeof SupportReference === 'string'
      ) {
        setCurrentCheck({
          quote: Quote || OrigQuote,
          occurrence: Occurrence,
          SupportReference,
          reference: Reference,
        })
      } else if (setCurrentCheck) {
        setCurrentCheck(null)
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
      setItemIndexPure: setItemIndex,
      setMarkdownView,
    },
  }
}

export default useCardState
