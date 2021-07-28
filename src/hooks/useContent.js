import { useEffect, useState } from 'react'
import { useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'
import {
  CONTENT_NOT_FOUND_ERROR,
  ERROR_STATE,
  INITIALIZED_STATE,
  LOADING_STATE,
  MANIFEST_NOT_LOADED_ERROR,
} from '../common/constants'
import useExtraContent from "./useExtraContent";

/**
 * hook for loading content of translation helps resources
 * @param {number|string} verse
 * @param {string} owner
 * @param {string} listRef - points to specific branch or tag for tsv list
 * @param {string} contentRef - points to specific branch or tag for tsv contents
 * @param {string} server
 * @param {number|string} chapter
 * @param {string} filePath - optional file path, currently just seems to be a pass through value - not being used by useRsrc or useTsvItems
 * @param {string} projectId
 * @param {string} languageId
 * @param {string} resourceId
 * @param {boolean} fetchMarkdown - flag that resource being fetched is in markdown
 * @param {function} onResourceError - optional callback if there is an error fetching resource, parameters are:
 *    ({string} errorMessage, {boolean} isAccessError, {object} resourceStatus, {Error} error)
 *      - isAccessError - is true if this was an error trying to access file
 *      - resourceStatus - is object containing details about problems fetching resource
 *      - error - Error object that has the specific error returned
 * @param {object} httpConfig - optional config settings for fetches (timeout, cache, etc.)
 * @param {string} viewMode - list or markdown view
 * @param {function} useUserLocalStorage
 */
const useContent = ({
  listRef = 'master',
  contentRef = 'master',
  verse = 1,
  owner,
  server,
  chapter= 1,
  filePath = '',
  projectId,
  languageId,
  resourceId,
  fetchMarkdown = true,
  onResourceError,
  httpConfig = {},
  viewMode = 'markdown',
  useUserLocalStorage,
}) => {
  const [initialized, setInitialized] = useState(false)
  const [processedItems, setProcessedItems] = useState(null)

  const reference = {
    verse,
    chapter,
    filePath,
    projectId,
    ref: listRef,
  }
  const resourceLink = `${owner}/${languageId}/${resourceId}/${listRef}`
  const config = {
    server,
    ...httpConfig,
  }

  const {
    state: { resource, content, loadingResource, loadingContent },
  } = useRsrc({
    resourceLink,
    reference,
    config,
  })

  const { items, loading: loadingTSV } = useTsvItems({
    fetchMarkdown,
    languageId,
    resourceId,
    projectId,
    content,
    chapter,
    server,
    owner,
    ref: contentRef,
    verse,
    onResourceError,
    httpConfig: config,
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

  useExtraContent({
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
    processedItems,
    setProcessedItems,
    items,
    onResourceError,
    reference,
  })

  return {
    items: processedItems || items, // processed items take priority
    resource,
    markdown: Array.isArray(content) ? null : content,
    resourceStatus,
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
