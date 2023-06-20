/**
 * Promise utilities
 *
 */

/**
 * In this library errors thrown in promises are often caught ignored and `null` is instead returned.
 * This makes it difficult to find the origin of an error and breaks any callsites of these promises.
 *
 * This utility aims to be a patch to at least reject a promise if any of these
 * failure signalling methods are used.
 *
 * @warning This will reject any promise that would resolve to an intended `null` value; __USE WITH CAUTION__!
 *
 * @param {any} errorMsg an error to throw if a produced null is detected
 * @param {Promise<a>} the promise to inspect
 * @return {Promise<a>} a promise that is sure to fail if a null value is previously returned.
 *
 * @todo test
 *
 */
export const failIfNull = (anyError, promise) => promise.then(x => x === null ? Promise.reject(anyError) : Promise.resolve(x))

/**
 *
 * Map over an array and apply the given function (which returns a promise) and collect all resolves/rejets.
 *
 * @param {(f) : a -> Promise<b>}
 * @return {Promise<Collect e a>}
 *
 */
export const collectPromises = (array, f) => foldMap(CollectPromise, array, a => CollectPromise.lift(f(a)))

/**
 * Javascript doesn't provide a nice `reduceMap` function.
 *
 */
export const foldMap = (monoid, array, f) => 
  array.reduce
    ((m, a) => monoid.concat(m, f(a))
    , monoid.empty()
    )

/**
 * `Promise (Collect e a)` form a monoid
 */
export const CollectPromise =
  { empty: () => Promise.resolve(Collect.empty())
  , concat: (a,b) =>
      Promise
        .all([a,b])
        .then(v => Collect.concat(...v))
    // lift a `Promise a` to a `Promise (Collect e a)` where `e` is the type of
    // error the promise rejects with.
    // NOTE: the makes the input Promise __ALWAYS__ resolve
  , lift: promise =>
      promise
        .then(a => Collect.value(a))
        .catch(e => Collect.error(e))

    // promises are equivalent if they both resolve and have the same value
    // NOTE: technically this violates the Setoid type constraint as this 
    // return a `Promise Bool` not a `Bool`
  , equals: (a,b) => Promise.all([a,b]).then(v => Collect.equals(...v))
  }

/**
 * `Collect e a` represents a collection of errors and values.
 *
 * It supports the following properties:
 *
 * - Setoid: (supports equality)
 * - Semigroup: (supports concat)
 * - Monoid: (a Semigroup that supports an empty value)
 *
 */
export const Collect =
  { empty: () => ({errors: [], values: []})
  , concat: (a,b) => 
      ({ errors: a.errors.concat(b.errors)
      , values: a.values.concat(b.values)
      })
  , equals: (a,b) => arrayEquals(a.errors, b.errors) && arrayEquals(a.values, b.values)
  , error: e => ({errors: [e], values: []})
  , value: v => ({errors: [], values: [v]})
  }

/**
 * helper function for testing for array equality
 *
 */
const arrayEquals = (a,b) => a.length === b.length && a.every((e, i) => e === b[i])
