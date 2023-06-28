export const last = (list) => list ? list[list?.length - 1] || null : null;

export const nullMap = (x, f) => x ? f(x) : x

/**
 * Javascript's (||) operator is NOT a boolean binary operator! 
 *
 * For example: what is? `false || {a: 2}` one would expect `true` since `{a :
 * 2}` is truthy however this is not the case. Instead `false || {a: 2} ≡ {a:
 * 2}`! 
 *
 *
 */
export const orBool = (a, b) => (!! a) || (!! b);
