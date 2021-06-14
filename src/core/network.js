/**
 * determine if http code is could be due to possible network disconnect
 * @param {number} httpCode
 * @return {boolean} true if this code could be from a network disconnect
 */
export function isPossibleDisconnectError(httpCode) {
  let disconnectError
  switch (httpCode) {
    case 200:
      disconnectError = false
      break
    case 404:
      disconnectError = true // this may be due to network disconnect
      break
    case 401:
    case 403:
      disconnectError = false // authentication errors are not network disconnect errors
      break
    case 0:
      disconnectError = true // if http code could not be determined, this may be due to network disconnect
      break
    default:
      disconnectError = false // other errors are not likely network disconnect errors
      break
  }
  return disconnectError
}

/**
 * process the http code to see if error, if error call onResourceError
 * @param {object} response - from fetch or axios
 * @param {string} resourceDescr - description of resource being fetched
 * @param {string} url - path to resource
 * @param {function} onResourceError - callback for reporting fetch errors
 */
export function processHttpErrors(response, resourceDescr, url, onResourceError) {
  if (response?.status !== 200) {
    const message = `Error code ${response?.status} fetching '${url}' for '${resourceDescr}'`
    onResourceError && onResourceError(message, isPossibleDisconnectError(response?.status))
  }
}

/**
 * process the http code to see if error, if error call onResourceError
 * @param {object} error - from catch statement
 * @param {string} resourceDescr - description of resource being fetched
 * @param {string} url - path to resource
 * @param {function} onResourceError - callback for reporting fetch errors
 */
export function processUnknownError(error, resourceDescr, url, onResourceError) {
    const message = `Unexpected error ${error?.toString()} fetching '${url}' for '${resourceDescr}'`
    onResourceError && onResourceError(message, true, null, error)
}
