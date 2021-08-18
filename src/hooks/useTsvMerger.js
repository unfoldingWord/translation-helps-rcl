import parser from 'tsv'

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
  setContent,
  itemIndex,
  chapter,
  verse,
  tsvs,
}) {
  function onTsvEdit(newItem) {
    if (tsvs) {
      const newTsvs = Object.assign({}, { ...tsvs })
      // Updating item reference with edited item.
      newTsvs[chapter][verse][itemIndex] = newItem
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

      const tsvFile = parser.TSV.stringify(tsvItems)
      setContent(tsvFile)
    }
  }

  return { onTsvEdit }
}
