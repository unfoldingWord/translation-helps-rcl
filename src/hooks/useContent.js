import { useEffect, useState } from 'react'
import { useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'
import {
  ERROR_STATE,
  LOADING_STATE,
  INITIALIZED_STATE,
  CONTENT_NOT_FOUND_ERROR,
  MANIFEST_NOT_LOADED_ERROR,
} from '../common/constants'
import useExtraContent from './useExtraContent'

/**
 * hook for loading content of translation helps resources
 * @param {number|string} chapter
 * @param {string} contentRef - points to specific branch or tag for tsv contents
 * @param {boolean} fetchMarkdown - flag that resource being fetched is in markdown
 * @param {string} filePath - optional file path, currently just seems to be a pass through value - not being used by useRsrc or useTsvItems
 * @param {object} httpConfig - optional config settings for fetches (timeout, cache, etc.)
 * @param {string} languageId
 * @param {string} listRef - points to specific branch or tag for tsv list
 * @param {function} onResourceError - optional callback if there is an error fetching resource, parameters are:
 *    ({string} errorMessage, {boolean} isAccessError, {object} resourceStatus, {Error} error)
 *      - isAccessError - is true if this was an error trying to access file
 *      - resourceStatus - is object containing details about problems fetching resource
 *      - error - Error object that has the specific error returned
 * @param {string} owner
 * @param {string} projectId
 * @param {boolean} readyToFetch - if true then ready to fetch
 * @param {string} resourceId
 * @param {string} server
 * @param {function} useUserLocalStorage
 * @param {number|string} verse
 * @param {string} viewMode - list or markdown view
 */
const useContent = ({
  chapter = 1,
  contentRef = 'master',
  fetchMarkdown = true,
  filePath = '',
  httpConfig = {},
  languageId,
  listRef = 'master',
  onResourceError,
  owner,
  projectId,
  readyToFetch = false,
  resourceId,
  server,
  useUserLocalStorage,
  verse = 1,
  viewMode = 'markdown',
}) => {
  const [initialized, setInitialized] = useState(false)

  const reference = {
    chapter,
    verse,
    filePath,
    projectId,
    ref: listRef,
  }
  const resourceLink = readyToFetch ? `${owner}/${languageId}/${resourceId}/${listRef}` : null
  const config = {
    server,
    ...httpConfig,
  }

  const {
    state: {
      content,
      resource,
      loadingResource,
      loadingContent,
      fetchResponse,
    },
    actions: { reloadResource },
  } = useRsrc({
    resourceLink,
    reference,
    config,
  })

  // items in a specific note within verse and tsvs includes the entire file
  const { items, tsvs, loading: loadingTSV } = useTsvItems({
    httpConfig: config,
    onResourceError,
    ref: contentRef,
    fetchMarkdown,
    languageId,
    resourceId,
    projectId,
    content,
    chapter,
    server,
    owner,
    verse,
  })

  const contentNotFoundError = !content
  const manifestNotFoundError = !resource?.manifest
  const loading = loadingResource || loadingContent || loadingTSV
  const error =
    initialized && !loading && (contentNotFoundError || manifestNotFoundError)
  const resourceStatus = {
    [LOADING_STATE]: loading,
    [CONTENT_NOT_FOUND_ERROR]: contentNotFoundError,
    [MANIFEST_NOT_LOADED_ERROR]: manifestNotFoundError,
    [ERROR_STATE]: error,
    [INITIALIZED_STATE]: initialized,
  }

  useEffect(() => {
    if (!initialized) {
      if (loading) {
        // once first load has begun, we are initialized
        setInitialized(true)
      }
    }
  }, [loading])

  const { processedItems } = useExtraContent({
    verse,
    owner,
    server,
    chapter,
    filePath,
    projectId,
    languageId,
    resourceId,
    httpConfig,
    viewMode,
    useUserLocalStorage,
    initialized,
    loading,
    items,
    onResourceError,
    reference,
  })

  return {
    tsvs,
    resource,
    fetchResponse,
    resourceStatus,
    reloadResource,
    loadingResource,
    items: processedItems || items, // processed items take priority
    markdown: Array.isArray(content) ? null : content,
    props: {
      verse,
      owner,
      server,
      chapter,
      filePath,
      projectId,
      languageId,
      resourceId,
    },
  }
}

export default useContent
