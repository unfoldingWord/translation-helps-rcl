import {
  decodeBase64ToUtf8,
  get,
} from "gitea-react-toolkit";

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
 * @return (string|null} returns error message
 */
export function processHttpErrors(response, resourceDescr, url, onResourceError) {
  if (response?.status !== 200) {
    const message = `Error code ${response?.status} fetching '${url}' for '${resourceDescr}'`
    onResourceError && onResourceError(message, isPossibleDisconnectError(response?.status))
    return message
  }
  return null
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

/**
 * get data from http response and decode data in base64 format
 * @param {object} response - http response
 * @return {*} - response data decoded
 */
export function getResponseData(response) {
  let data = response?.data;
  data = (data?.encoding === 'base64') ? decodeBase64ToUtf8(data.content) : data;
  return data;
}

/**
 * iterate through params converting arrays to strings
 * @param {object} params
 * @return {object} new params object with arrays replaced
 */
function cleanUpParams(params) {
  const params_ = {...params}
  const keys = Object.keys(params_);
  for (const key of keys) {
    if (Array.isArray(params_[key])) {
      params_[key] = params_[key].join(',')
    }
  }
  return params_;
}

/**
 * searches catalog for repos that match params (low level function)
 * @param {APIConfig} config - http request configuration
 * @param {object} params - optional search parameters
 * @return {Promise<object>} http response
 */
async function searchCatalog(config, params) {
  const params_ = cleanUpParams(params);
  const response = await get({
    url: `${config.server}/api/v1/repos/search`,
    config,
    params: params_,
    fullResponse: config.fullResponse,
  });

  return response;
}

/**
 * searches catalog for repos that match params
 * @param {string} server such as https://git.door43.org
 * @param {object} config - http request configuration
 * @param {object} params - optional search parameters
 * @return {Promise<object>} object containing repos by name
 */
export async function searchCatalogForRepos(config, params) {
  const config_ = {
    ...config,
    fullResponse: true,
    skipNetworkCheck: true,
  };

  const results = await searchCatalog(config_, params)

  let repos = null
  if (results?.status === 200) {
    repos = {}
    const foundRepos = results.data?.data || []
    for (const repo of foundRepos) {
      if (repo?.name) {
        repos[repo.name] = repo
      }
    }
  }
  return repos
}

/**
 * gets the metadata for branch
 * @param {string} url
 * @param {object} config - http request configuration
 * @param {boolean} noCache
 * @param {boolean} skipNetworkCheck
 * @param {boolean} throwException - if true then unexpected errors will result in exception
 * @return {Promise<object>} returns the metadata response and flag if branch exists
 */
export async function queryUrl({
  url,
  config= {},
  noCache = true,
  skipNetworkCheck = true,
  throwException = false,
}) {
  let error = true
  let response
  try {
    response = await get({
      url,
      config: {
        ...config,
        skipNetworkCheck,
      },
      noCache,
      fullResponse: true,
    });

    switch (response?.status) {
      case 200:
      case 404:
        error = false
        break

      default:
        // any other response is an unexpected error
        error = new Error(`Error getting repo status '${url}'`)
        error.response = response
        error.url = url
    }
  } catch (e) {
    response = e?.response
    if (response?.status === 404) { // branch missing is a known error we can handle
      error = false
    } else {
      error = e
    }
  }

  return {
    success: response?.status === 200,
    status: response?.status,
    error,
    response,
  }
}

/**
 * read file
 * @param {string} server such as https://git.door43.org
 * @param {object} config - http request configuration
 * @param {string} repoOwner
 * @param {string} repoName
 * @param {string} filePath
 * @param {string} ref - branch name or tag to find
 * @return {Promise<string>} returns name of userBranch if found, otherwise returns master
 */
export async function getFileFromRepo(server, config, repoOwner, repoName,
                                      filePath, ref = 'master') {
  const url = `${server}/api/v1/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${ref}`
  const response = await queryUrl({
    url,
    throwException: false,
    config,
  })

  if (response?.error) {
    console.warn(`getFileFromRepo - failed to get ${url}`, response?.error)
  }

  return response;
}

