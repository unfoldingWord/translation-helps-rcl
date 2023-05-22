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
      const oldTsvItem = { ...newTsvs[chapter][verse][itemIndex] }
      let newTsvItem = { ...oldTsvItem, ...newItem };
      newTsvs[chapter][verse][itemIndex] = newTsvItem

      let refRangeTag = newTsvItem?._referenceRange;
      if (refRangeTag) { // make sure we update every instance of a reference range
        for (const chapter_ of Object.keys(newTsvs)) {
          const tsvChapter = newTsvs[chapter_]
          for (const verse_ of Object.keys(tsvChapter)) {
            const tsvVerse = tsvChapter[verse_] || []
            for (let i = 0, l = tsvVerse.length; i < l; i++) {
              const note = tsvVerse[i]
              if (note?._referenceRange === refRangeTag) {
                // if in current reference range, make sure it has latest data
                newTsvs[chapter_][verse_][i] = newTsvItem
              }
            }
          }
        }
      }

      setTsvsState(newTsvs)
      const tsvItems = flattenObject(newTsvs)

      // Check if it uses the Reference value, then remove Chapter, Verse and book that were added
      if (tsvItems[0] && tsvItems[0].Reference) {
        // TRICKY - prevent Book/Chapter/Verse columns from being generated by removing from first element
        delete tsvItems[0].Chapter
        delete tsvItems[0].Verse
        delete tsvItems[0].Book
      }

      if (tsvItems[0] && tsvItems[0].markdown) {
        // TRICKY - prevent markdown column from being generated by removing from first element
        delete tsvItems[0].markdown
      }

      const _tsvItems = []
      const usedRefRanges = {} // keeps track if we have already saved this reference range
      for (let tsvItem of tsvItems) {
        let saveItem = true

        // if this note is a reference range, remove any duplicates
        let tag = tsvItem?._referenceRange;
        if (tag) {
          if (!usedRefRanges[tag]) { // reference range not yet saved
            usedRefRanges[tag] = true
          } else { // this reference range was already saved, so skip
            saveItem = false
          }
        }

        if (saveItem) {
          _tsvItems.push(tsvItem)
        }
      }

      if (_tsvItems?.[0]?._referenceRange) { // TRICKY - prevent referenceRange column from being generated by removing from first element
        const newItem = { ..._tsvItems?.[0] }
        delete newItem._referenceRange
        _tsvItems[0] = newItem
      }

      const tsvFile = parser.TSV.stringify(_tsvItems)
      setContent(tsvFile)
    }
  }

  return { onTsvEdit }
}
