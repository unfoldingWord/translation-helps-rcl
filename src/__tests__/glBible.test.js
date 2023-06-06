import * as GlBible from '../core/glBible'

const testBibleName = 'uw'
const testLangId = 'en'
const testGlBible = GlBible.glBible(testLangId, testBibleName)

//TODO: eliminate this test if we can prove that the only way to construct a GlBible is via the glBible function
const invalidGlBible = '_'

describe('glBible', () => {
  it('should contain langId', () => {
    expect(GlBible.langId(testGlBible)).toBe(testLangId)
    expect(GlBible.langId(invalidGlBible)).toBeUndefined()
  }) 

  it('should contain a bible name', () => {
    expect(GlBible.bibleName(testGlBible)).toBe(testBibleName)
    expect(GlBible.bibleName(invalidGlBible)).toBeUndefined()
  })
})