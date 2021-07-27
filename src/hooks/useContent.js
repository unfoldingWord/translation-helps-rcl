import { useEffect, useState } from 'react'
import isEqual from 'deep-equal'
import { useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'
import {
  CONTENT_NOT_FOUND_ERROR,
  ERROR_STATE,
  INITIALIZED_STATE,
  LOADING_STATE,
  MANIFEST_NOT_LOADED_ERROR,
} from '../common/constants'
import useDeepCompareEffect from "use-deep-compare-effect"
import {
  addGlQuotesTo,
  getGlAlignmentBibles,
  getGlAlignmentBiblesList,
} from "../core"

/**
 * hook for loading content of translation helps resources
 * @param {string} verse
 * @param {string} owner
 * @param {string} listRef - points to specific branch or tag for tsv list
 * @param {string} contentRef - points to specific branch or tag for tsv contents
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
 * @param {object} httpConfig - optional config settings for fetches (timeout, cache, etc.)
 * @param {string} viewMode - list or markdown view
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
}) => {
  const [initialized, setInitialized] = useState(false)
  const [loadingGlBible, setLoadingGlBible] = useState(false)
  const [loadedGlRepo, setLoadedGlRepo] = useState(null)
  const [glBibles, setGlBibles] = useState(null)
  const [glBiblesList, setGlBiblesList] = useState(null)
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

  useEffect(async () => {
    if (!initialized) {
      if (loading) {
        // once first load has begun, we are initialized
        setInitialized(true)
      }
    }
  }, [loading])

  useDeepCompareEffect(async () => {
    if ((resourceId === 'twl') && (viewMode === 'list')) { // we only need to load gl quotes if we are showing list view
      if (initialized && !loading && !error && !loadingGlBible) {
        const currentGlRepo = `${owner}/${languageId}`;
        if (loadedGlRepo !== currentGlRepo) { // see if we have alignment bibles list for current GL
          setLoadingGlBible(true)
          setGlBibles(null)
          const glBibleList_ = await getGlAlignmentBiblesList(languageId, httpConfig, server, owner);
          console.log('useContent - GL bibles list loaded')
          setLoadedGlRepo(currentGlRepo)
          setGlBiblesList(glBibleList_)
          setGlBibles(null)
          setLoadingGlBible(false)
        } else if (!glBibles && glBiblesList) {
          setLoadingGlBible(true)
          const glBibles_ = await getGlAlignmentBibles(languageId, httpConfig, server, owner, reference, glBiblesList)
          setGlBibles(glBibles_)
          console.log('useContent - GL bibles loaded')
          setProcessedItems(null)
          setLoadingGlBible(false)
        } else if (glBibles && items?.length) {
          const newItems = addGlQuotesTo(chapter, verse, items, glBibles);
          if (!isEqual(processedItems, newItems)) {
            console.log('useContent - GL quotes added')
            setProcessedItems(newItems)
          }
        }
      } else if (initialized && loading) {
        setProcessedItems(null)
      }
    }
  }, [{initialized, loading, error, loadingGlBible, loadedGlRepo, glBibles, glBiblesList, languageId, owner, items}])

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
