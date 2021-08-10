import parser from 'tsv'

function flattenObject(obj) {
  let flatten = []

  if (obj) {
    const chapters = Object.keys(obj)

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i]
      const verses = Object.keys(obj[chapter])
      const lastVerse = verses[verses.length - 1]

      if (lastVerse == 'intro') {
        const lastItem = verses.pop()

        if (lastItem) {
          verses.unshift(lastItem)
        }
      }

      flatten = verses.reduce(
        (accumulator, currentValue) =>
          accumulator.concat(obj[chapter][currentValue]),
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
      console.log({ newItem })
      const newTsvs = Object.assign({}, { ...tsvs })
      // Updating item reference with edited item.
      newTsvs[chapter][verse][itemIndex] = newItem
      const tsvItems = flattenObject(newTsvs)
      // Front is always at end of array thus move to beginning of array.
      const lastItem = tsvItems.pop()

      if (lastItem) {
        tsvItems.unshift(lastItem)
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
