import flattenTsvObject from '../core/flattenTsvObject'
// Fixtures
import tsvsObject from './fixtures/tsvsObject.json'
import tsvsObjectWithVerseSpan from './fixtures/tsvsObjectWithVerseSpan.json'

describe('flattenTsvObject', () => {
  let result
  let resultWithVerseSpans

  beforeAll(() => {
    result = flattenTsvObject(tsvsObject)
    resultWithVerseSpans = flattenTsvObject(tsvsObjectWithVerseSpan)
  })

  it('front reference should go at the very top of the array', () => {
    expect(result[0].Reference).toBe('front:intro')
    expect(resultWithVerseSpans[0].Reference).toBe('front:intro')
  })

  it('The first item at the biginning of each chapter should have intro as a verse reference', () => {
    const chapter1VerseValue = result.find(
      ({ Reference }) => Reference.split(':')[0] == '1'
    )
    const chapter2VerseValue = result.find(
      ({ Reference }) => Reference.split(':')[0] == '2'
    )
    const chapter3VerseValue = result.find(
      ({ Reference }) => Reference.split(':')[0] == '3'
    )

    expect(chapter1VerseValue.Reference).toBe('1:intro')
    expect(chapter2VerseValue.Reference).toBe('2:intro')
    expect(chapter3VerseValue.Reference).toBe('3:intro')
  })

  // it('verse spans should not affect tsvs order', () => {
  //   const result = flattenTsvObject(tsvsObject)

  //   expect(result[0].Reference).toBe('front:intro')
  // })
})
