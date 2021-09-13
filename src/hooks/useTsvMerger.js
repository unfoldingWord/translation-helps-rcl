import { useState, useEffect } from 'react'
import parser from 'tsv'
import useDeepCompareEffect from 'use-deep-compare-effect'

function flattenObject(obj) {
  let flatten = []

  if (obj) {
    const chapters = Object.keys(obj)

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i]
      const verses = Object.keys(obj[chapter])

      // Sorting to rearrange verse ranges in correct order.
      verses.sort((a, b) => {
        const _a = a.includes('-')
          ? parseInt(a.split('-')[0], 10)
          : parseInt(a, 10)
        const _b = b.includes('-')
          ? parseInt(b.split('-')[0], 10)
          : parseInt(b, 10)

        return _a - _b
      })

      const lastVerse = verses[verses.length - 1]

      if (lastVerse == 'intro') {
        const lastItem = verses.pop()

        if (lastItem) {
          verses.unshift(lastItem)
        }
      }

      flatten = verses.reduce(
        (accumulator, verse) => accumulator.concat(obj[chapter][verse]),
        flatten
      )
    }
  }

  return flatten
}

export default function useTsvMerger({
  itemIndex: defaultItemIndex,
  setContent,
  chapter,
  verse,
  tsvs,
  cardResourceId, // TODO
}) {
  const [tsvsState, setTsvsState] = useState(null)

  console.log('useTsvMerger tsvsState', tsvsState)

  useDeepCompareEffect(() => {
    console.log('useDeepCompareEffect tsvs', tsvs)
    console.log('useDeepCompareEffect cardResourceId changed', cardResourceId)
    if (tsvs) {
      setTsvsState(Object.assign({}, { ...tsvs }))
    }
  }, [tsvs, chapter, verse])

  function onTsvEdit(newItem, itemIndex) {
    console.log('onTsvEdit')
    console.log('tsvsState', tsvsState)
    console.log('cardResourceId', cardResourceId)

    if (tsvsState) {
      console.log('tsvsState = true')
      console.log('newItem', newItem)
      console.log('tsvsState', tsvsState)
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      const newTsvs = Object.assign({}, { ...tsvsState })
      // Updating item reference with edited item.
      const oldItem = { ...newTsvs[chapter][verse][itemIndex] }
      console.log('oldItem', oldItem)
      newTsvs[chapter][verse][itemIndex] = { ...oldItem, ...newItem }
      console.log('newTsvs', newTsvs)
      setTsvsState(newTsvs)
      console.log(newTsvs[chapter][verse][itemIndex])
      const tsvItems = flattenObject(newTsvs)
      const lastTsvItem = tsvItems[tsvItems.length - 1]
      // Front is always at end of array thus move to beginning of array.
      if (lastTsvItem.Chapter == 'front') {
        const lastItem = tsvItems.pop()

        if (lastItem) {
          tsvItems.unshift(lastItem)
        }
      }

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
