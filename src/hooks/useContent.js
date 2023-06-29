import { useState } from 'react'
import { useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'
import * as Items from '../core/items'
import {
  ERROR_STATE,
  LOADING_STATE,
  INITIALIZED_STATE,
  CONTENT_NOT_FOUND_ERROR,
  MANIFEST_NOT_LOADED_ERROR,
} from '../common/constants'
import {useExtraContent} from './useExtraContent'
import {orBool} from '../core/util'


/**
 * hook for loading content of translation helps resources
 *
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
 *
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
  resourceId,
  server,
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

  const resourceLink = `${owner}/${languageId}/${resourceId}/${listRef}`

  const config = { server, ...httpConfig, }

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
  const loading = orBool(loadingResource, orBool(loadingContent, loadingTSV))
  const error = initialized && !loading && orBool(contentNotFoundError, manifestNotFoundError)
  const resourceStatus = {
    [LOADING_STATE]: loading,
    [CONTENT_NOT_FOUND_ERROR]: contentNotFoundError,
    [MANIFEST_NOT_LOADED_ERROR]: manifestNotFoundError,
    [ERROR_STATE]: error,
    [INITIALIZED_STATE]: initialized,
  }

  const _initialized = orBool(initialized, loading);

  const { processedItems } = useExtraContent(
    { verse,
      owner,
      server,
      chapter,
      languageId,
      resourceId,
      httpConfig,
      viewMode,
      initialized: _initialized,
      loading,
      error,
      reference,
    })

  //remember if we've initialized at least once.
  if(!initialized && _initialized)
    setInitialized(_initialized)

  return {
    tsvs,
    resource,
    fetchResponse,
    resourceStatus,
    reloadResource,
    items: Items.or(processedItems, items), // processed items take priority
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
