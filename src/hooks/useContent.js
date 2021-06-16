import { useEffect, useState } from 'react'
import { useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'
import {
  CONTENT_NOT_FOUND_ERROR,
  ERROR_STATE, INITIALIZED_STATE,
  LOADING_STATE,
  MANIFEST_NOT_LOADED_ERROR,
} from '../common/constants'

/**
 * hook for loading content of translation helps resources
 * @param {string} verse
 * @param {string} owner
 * @param {string} subResourceLink - points to specific branch (e.g. 'branch/master') or tag (e.g. 'tag/v9')
 * @param {string} server
 * @param {string} chapter
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
 * @param {number} timeout - optional http timeout in milliseconds for fetching resources, default is 0 (very long wait)
 */
const useContent = ({
  verse,
  owner,
  subResourceLink,
  server,
  chapter,
  filePath,
  projectId,
  languageId,
  resourceId,
  fetchMarkdown,
  onResourceError,
  timeout = 0,
}) => {
  const [initialized, setInitialized] = useState(false)

  const reference = {
    verse,
    chapter,
    filePath,
    projectId,
  }
  const resourceLink = `${owner}/${languageId}/${resourceId}/${subResourceLink}`
  const config = {
    server,
    cache: {
      maxAge: 1 * 60 * 60 * 1000, // override cache to 1 hour
      timeout,
    },
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
    verse,
    onResourceError,
    timeout,
  })

  const contentNotFoundError = !content
  const manifestNotFoundError = !resource?.manifest
  const loading = loadingResource || loadingContent || loadingTSV
  const error = initialized && !loading && (contentNotFoundError || manifestNotFoundError)
  const resourceStatus = {
    [LOADING_STATE]: loading,
    [CONTENT_NOT_FOUND_ERROR]: contentNotFoundError,
    [MANIFEST_NOT_LOADED_ERROR]: manifestNotFoundError,
    [ERROR_STATE]: error,
    [INITIALIZED_STATE]: initialized,
  }

  useEffect(() => {
    if (!initialized) {
      if (loading) { // once first load has begun, we are initialized
        setInitialized(true)
      }
    }
  }, [loading])

  return {
    items,
    resource,
    markdown: Array.isArray(content) ? null : content,
    resourceStatus,
    props: {
      verse,
      owner,
      subResourceLink,
      server,
      chapter,
      filePath,
      projectId,
      languageId,
      resourceId,
    },
  }
}

useContent.defaultProps = {
  verse: 1,
  chapter: 1,
  filePath: '',
  branch: 'master',
  fetchMarkdown: true,
}

export default useContent
