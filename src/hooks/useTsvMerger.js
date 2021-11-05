import { useState } from 'react'
import parser from 'tsv'
import useDeepCompareEffect from 'use-deep-compare-effect'
import flattenObject from '../core/flattenTsvObject'

export default function useTsvMerger({
  itemIndex: defaultItemIndex,
  setContent,
  chapter,
  verse,
  tsvs,
}) {
  const [tsvsState, setTsvsState] = useState(null)

  useDeepCompareEffect(() => {
    if (tsvs) {
      setTsvsState(Object.assign({}, { ...tsvs }))
    }
  }, [{ ...tsvs }, chapter, verse])

  function onTsvEdit(newItem, itemIndex) {
    if (tsvsState) {
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      const newTsvs = Object.assign({}, { ...tsvsState })
      // Updating item reference with edited item.
      const oldItem = { ...newTsvs[chapter][verse][itemIndex] }
      console.log('onTsvEdit newItem', newItem)
      newTsvs[chapter][verse][itemIndex] = { ...oldItem, ...newItem }
      setTsvsState(newTsvs)
      const tsvItems = flattenObject(newTsvs)

      // Check if it uses the Reference value, then remove Chapter, Verse and book that were added
      if (tsvItems[0] && tsvItems[0].Reference) {
        delete tsvItems[0].Chapter
        delete tsvItems[0].Verse
        delete tsvItems[0].Book
      }

      if (tsvItems[0] && tsvItems[0].markdown) {
        delete tsvItems[0].markdown
      }

      const tsvFile = parser.TSV.stringify(tsvItems)
      setContent(tsvFile)
    }
  }

  return { onTsvEdit }
}
