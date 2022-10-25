import { useState } from 'react'
import isEqual from 'deep-equal'
import useDeepCompareEffect from 'use-deep-compare-effect'
import {
  addGlQuotesTo,
  getGlAlignmentBibles,
  getGlAlignmentBiblesList,
} from '../core'

/**
 * hook for loading extra content to specific translation helps resources.
 *      Currently only twl list view needs extra data (GL quotes) to be added.
 * @param {number|string} verse
 * @param {string} owner
 * @param {string} server
 * @param {number|string} chapter
 * @param {string} filePath - optional file path, currently just seems to be a pass through value - not being used by useRsrc or useTsvItems
 * @param {string} projectId
 * @param {string} languageId
 * @param {string} resourceId
 * @param {function} onResourceError - optional callback if there is an error fetching resource, parameters are:
 *    ({string} errorMessage, {boolean} isAccessError, {object} resourceStatus, {Error} error)
 *      - isAccessError - is true if this was an error trying to access file
 *      - resourceStatus - is object containing details about problems fetching resource
 *      - error - Error object that has the specific error returned
 * @param {object} httpConfig - optional config settings for fetches (timeout, cache, etc.)
 * @param {string} viewMode - list or markdown view
 * @param {boolean} initialized
 * @param {boolean} loading
 * @param {array} items - list created by useTsvItems
 * @param {boolean} error - error fetching resource
 * @param {function} useUserLocalStorage
 * @param {object} reference
 */
const useExtraContent = ({
  verse = 1,
  owner,
  server,
  chapter = 1,
  filePath = '',
  projectId,
  languageId,
  resourceId,
  httpConfig = {},
  viewMode = 'markdown',
  useUserLocalStorage,
  initialized,
  loading,
  items,
  error,
  onResourceError,
  reference,
}) => {
  const twlListView = resourceId === 'twl' && viewMode === 'list'
  const [loadingGlData, setLoadingGlData] = useState(false)
  const [glBiblesList, setGlBiblesList] = useTwlListViewUserLocalStorage(
    'gl_bible_list',
    null
  )
  const [glBibles, setGlBibles] = useState(null)
  const [glLoadedProjectId, setGlLoadedProjectId] = useState(null)
  const [processedItems, setProcessedItems] = useState(null)

  useDeepCompareEffect(() => {
    // Fix for React 18 error message: useEffect must not return anything besides a function, which is used for clean-up.
    const loadGlBibles = async () => {
      // load GL bibles in resource manifest
      if (twlListView) {
        // we only need to load gl quotes if we are showing list view
        if (initialized && !loading && !error && !loadingGlData) {
          setLoadingGlData(true)
          const currentGlRepo = `${owner}/${languageId}`
          let glBibles_ = glBibles
          let glBiblesList_ = glBiblesList

          if (glBibles_ && glLoadedProjectId !== projectId) {
            // if we have changed books of the bible need to load new book of the bible
            setGlBibles(null)
            glBibles_ = null
            setProcessedItems(null)
          }

          if (glBiblesList_ && glBiblesList_.repo !== currentGlRepo) {
            // if we have don't have alignment bibles list for current GL
            setGlBiblesList(null)
            glBiblesList_ = null
            setProcessedItems(null)
          }

          if (!glBiblesList_) {
            // see if we have alignment bibles list for current GL
            setProcessedItems(null)
            setGlBibles(null)
            const newGlBiblesList = await getGlAlignmentBiblesList(
              languageId,
              httpConfig,
              server,
              owner
            )
            glBiblesList_ = {
              repo: currentGlRepo,
              bibles: newGlBiblesList,
            }
            setGlBiblesList(glBiblesList_)
            glBibles_ = null
          }

          if (!glBibles_ && glBiblesList_) {
            setProcessedItems(null)
            glBibles_ = await getGlAlignmentBibles(
              languageId,
              httpConfig,
              server,
              owner,
              reference,
              glBiblesList_.bibles
            )
            setGlBibles(glBibles_)
            setGlLoadedProjectId(projectId)
          }
          setLoadingGlData(false)
        }
      }
    }
    loadGlBibles()
  }, [
    {
      initialized,
      loading,
      error,
      loadingGlData,
      projectId,
      glBibles,
      glBiblesList,
      reference,
      languageId,
      owner,
    },
  ])

  useDeepCompareEffect(() => {
    // get gl quotes if we have aligned bibles
    if (twlListView) {
      // we only need to load gl quotes if we are showing list view
      if (initialized && !loading && !error && !loadingGlData) {
        if (glBibles && items?.length) {
          const newItems = addGlQuotesTo(chapter, verse, items, glBibles)
          if (!isEqual(processedItems, newItems)) {
            setProcessedItems(newItems)
          }
        } else if (processedItems) {
          setProcessedItems(null)
        }
      } else if (processedItems) {
        setProcessedItems(null)
      }
    }
  }, [{ initialized, loading, error, loadingGlData, glBibles, items }])

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
    processedItems,
  }
}

export default useExtraContent
