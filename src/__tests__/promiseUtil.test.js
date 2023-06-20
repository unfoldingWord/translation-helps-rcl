import * as fc from 'fast-check'
import 
  { Collect
  , CollectPromise
  , failIfNull
  , collectPromises
  , ArrayMonoid
  , foldMap
  } from '../common/promiseUtil'

const testMonoid_ = (property, monoid, arbitrary) =>
  describe('monoid', () => {

    it('unit is left identity', () => {
      fc.assert(property(arbitrary(), i => 
        monoid.equals
        ( monoid.concat(i, monoid.empty())
        , i
        )
      ))
    }) 

    it('unit is right identity', () => {
      fc.assert(property(arbitrary(), i => 
        monoid.equals
        ( monoid.concat(monoid.empty(), i)
        , i
        )
      ))
    })

    it('concat is associative', () => {
      fc.assert(property(arbitrary(), arbitrary(), arbitrary(), (a,b,c) =>
        monoid.equals
          ( monoid.concat(a, monoid.concat(b,c))
          , monoid.concat(monoid.concat(a, b), c)
          )
        ))
    })

})

const testMonoid = (...args) => testMonoid_(fc.property, ...args)
const testAsyncMonoid = (...args) => testMonoid_(fc.asyncProperty, ...args)

describe('failIfNull', () => {
  it('should fail if exception in promise resolves to null', () => {
    fc.assert(fc.asyncProperty(fc.string(), anyError => 
      failIfNull
      ( anyError
      , new Promise((r, _) => { try { throw 'foo'; } catch(__) { r(null); } }) 
      )
      .then(_ => false)
      .catch(v => v === anyError)
    ))
  })
})


describe('foldMap', () => {
  const f = x => [x]

  it('foldMap f [] ≡ empty', () => { 
    expect(
      ArrayMonoid.equals
      ( foldMap(ArrayMonoid, [], _ => throw 'this should never be called')
      , ArrayMonoid.empty()
      )
    ).toBeTruthy()
  })

  it('foldMap f [a] ≡ f a', () => { 
    fc.assert(fc.property(fc.anything(), i =>
      ArrayMonoid.equals
      ( foldMap(ArrayMonoid, [i], f)
      , f(i)
      )
    ))
  })

  it('foldMap f [a,b] === f a <> f b | <> is not commutative', () => { 
    fc.assert(fc.property(fc.tuple(fc.anything(), fc.anything()), (a) =>
      ArrayMonoid.equals
      ( foldMap(ArrayMonoid, a, f)
      , ArrayMonoid.concat(f(a[0]), f(a[1]))
      )
    ))
  })
})

//Collect should be have as a monoid
describe('Collect', () => {
  testMonoid(Collect, () =>
    fc.oneof
    ( fc.integer().map(Collect.value)
    , fc.string().map(Collect.error)
    )
  )
})

//Nesting Collect under a promise should also behave as a monoid
//NOTE: we assume that CollectPromise.lift is working and will always resolve a
//rejected promise
describe('CollectPromise', () => {
  testAsyncMonoid(CollectPromise, () =>
    fc.oneof
    ( fc.integer().map(i => CollectPromise.lift(Promise.resolve(i)))
    , fc.string().map(i => CollectPromise.lift(Promise.reject(i)))
    )
  )

  it('resolves as Collect.value', () => {
    fc.assert(fc.asyncProperty(fc.integer(), i => 
      CollectPromise.equals
        ( CollectPromise.lift(Promise.resolve(i))
        , Promise.resolve(Collect.value(i))
        )
      ))
  })

  it('rejects as Collect.error', () => {
    fc.assert(fc.asyncProperty(fc.integer(), i => 
      CollectPromise.equals
        ( CollectPromise.lift(Promise.reject(i))
        , Promise.resolve(Collect.error(i))
        )
      ))
  })
})
