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
  const twlListView = (resourceId === 'twl') && (viewMode === 'list')
  const [initialized, setInitialized] = useState(false)
  const [loadingGlData, setLoadingGlData] = useState(false)
  const [glBiblesList, setGlBiblesList] = useTwlListViewUserLocalStorage('gl_bible_list', null)
  const [glBibles, setGlBibles] = useState(null)
  const [glLoadedProjectId, setGlLoadedProjectId] = useState(null)
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

  useDeepCompareEffect(async () => { // load GL bibles in resource manifest
    if (twlListView) { // we only need to load gl quotes if we are showing list view
      if (initialized && !loading && !error && !loadingGlData) {
        setLoadingGlData(true)
        const currentGlRepo = `${owner}/${languageId}`;
        let glBibles_ = glBibles
        let glBiblesList_ = glBiblesList

        if (glBibles_ && (glLoadedProjectId !== projectId)) { // if we have changed books of the bible need to load new book of the bible
          setGlBibles(null)
          glBibles_ = null
          setProcessedItems(null)
        }

        if (glBiblesList_ && (glBiblesList_.repo !== currentGlRepo)) { // if we have don't have alignment bibles list for current GL
          setGlBiblesList(null)
          glBiblesList_ = null
          setProcessedItems(null)
        }

        if (!glBiblesList_) { // see if we have alignment bibles list for current GL
          setProcessedItems(null)
          setGlBibles(null)
          const newGlBiblesList = await getGlAlignmentBiblesList(languageId, httpConfig, server, owner);
          console.log('useContent - GL bibles list loaded')
          glBiblesList_ = {
            repo: currentGlRepo,
            bibles: newGlBiblesList
          };
          setGlBiblesList(glBiblesList_)
          glBibles_ = null
        }

        if (!glBibles_ && glBiblesList_) {
          setProcessedItems(null)
          glBibles_ = await getGlAlignmentBibles(languageId, httpConfig, server, owner, reference, glBiblesList_.bibles)
          setGlBibles(glBibles_)
          setGlLoadedProjectId(projectId)
          console.log('useContent - GL bibles loaded')
        }
        setLoadingGlData(false)
      }
    }
  }, [{initialized, loading, error, loadingGlData, projectId, glBibles, glBiblesList, languageId, owner}])

  useDeepCompareEffect(async () => { // get gl quotes if we have aligned bibles
    if (twlListView) { // we only need to load gl quotes if we are showing list view
      if (initialized && !loading && !error && !loadingGlData) {
        if (glBibles && items?.length) {
          const newItems = addGlQuotesTo(chapter, verse, items, glBibles);
          if (!isEqual(processedItems, newItems)) {
            console.log('useContent - GL quotes added')
            setProcessedItems(newItems)
          }
        } else if (processedItems) {
          setProcessedItems(null)
        }
      } else if (processedItems) {
        setProcessedItems(null)
      }
    }
  }, [{initialized, loading, error, loadingGlData, glBibles, items}])

  /**
   * persist user state only for twl list view
   * @param {string} key
   * @param {any} value
   * @return {[any, function]|*} - array [currentValue, setValue]
   */
  function useTwlListViewUserLocalStorage(key, value) {
    if (twlListView && useUserLocalStorage) {
      return useUserLocalStorage('twl_list_view_' + key, value)
    } else {
      return useState(value)
    }
  }

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
