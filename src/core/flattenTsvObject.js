export default function flattenObject(obj) {
  let flatten = []

  if (obj) {
    const chapters = Object.keys(obj)

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i]
      const verses = Object.keys(obj[chapter])

      // Sorting to rearrange verse spans in correct order.
      verses.sort((a, b) => {
        let _a = a.includes('-')
          ? parseInt(a.split('-')[0], 10)
          : parseInt(a, 10)
        let _b = b.includes('-')
          ? parseInt(b.split('-')[0], 10)
          : parseInt(b, 10)

        if (isNaN(_a)) {
          _a = 0
        }

        if (isNaN(_b)) {
          _b = 0
        }

        return _a - _b
      })

      const lastVerse = verses[verses.length - 1]
      const INTRO = 'intro'

      if (lastVerse == INTRO) {
        const lastItem = verses.pop()

        if (lastItem) {
          verses.unshift(lastItem)
        }
      } else if (verses.includes(INTRO)) {
        // if intro is in verses array
        const index = verses.indexOf(INTRO)
        verses.splice(index, 1)
        verses.unshift(INTRO)
      }

      flatten = verses.reduce(
        (accumulator, verse) => accumulator.concat(obj[chapter][verse]),
        flatten
      )
    }
  }

  const lastTsvItem = flatten[flatten.length - 1]

  // Front always ends up at the end of array thus move to front.
  if (
    lastTsvItem.Chapter == 'front' ||
    lastTsvItem.Reference == 'front:intro'
  ) {
    const lastItem = flatten.pop()

    if (lastItem) {
      flatten.unshift(lastItem)
    }
  }

  return flatten
}
