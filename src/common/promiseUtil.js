/**
 * Runs a list of promises in parallel and returns a list of the ones that succeeded 
 * 
 * @param {Promise<any|null>[]} promises list of promises 
 * @returns {Promise<any[]>} a promise containing a list of all successful Promises that produce non-null values
 * @todo TEST!
 */
export const allSettledTruthy = promises => 
  Promise
  .allSettled(promises)
  .then(values => 
    values
    .filter(({status, value}) => status === 'fulfilled' && value != null)
    .map(({value}) => value)
  )