import {Collect, CollectPromise}  from '../common/promiseUtil'
import * as fc from 'fast-check'

const testMonoid_ = (property, monoid, arbitrary) =>
  describe('monoid', () => {

    it('unit is left identity', () => {
      fc.assert(property(arbitrary(), (i) => 
        monoid.equals
        ( monoid.concat(i, monoid.empty())
        , i
        )
      ))
    }) 

    it('unit is right identity', () => {
      fc.assert(property(arbitrary(), (i) => 
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
    fc.assert(fc.asyncProperty(fc.integer(), (i) => 
      CollectPromise.equals
        ( CollectPromise.lift(Promise.resolve(i))
        , Promise.resolve(Collect.value(i))
        )
      ))
  })

  it('rejects as Collect.error', () => {
    fc.assert(fc.asyncProperty(fc.integer(), (i) => 
      CollectPromise.equals
        ( CollectPromise.lift(Promise.reject(i))
        , Promise.resolve(Collect.error(i))
        )
      ))
  })
})
