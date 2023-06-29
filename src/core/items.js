/**
 * This module exists to make the `items` in `useContent` and `processedItems`
 * in `useExtraContent` an opaque type. 
 *
 */

/**
 * Alternative interface for Items.
 *
 * Alternative encodes the idea of "or" logic. 
 *
 * Following properties hold given `a,b,c : Items`
 *
 * (left-identity): or(empty(), a)  ≡ a
 * (right-identity): or(a, empty()) ≡ a
 * (associative): or(a,or(b,c)) ≡ or(or(a,b),c)
 *
 *
 * given (p : Predicate a) form a Monoid over (a)
 *
 */
export const empty = () => null

export const or = (a,b) => a?.length ? a : b
