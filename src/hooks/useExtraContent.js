import { useState } from 'react'
import isEqual from 'deep-equal'
import useDeepCompareEffect from "use-deep-compare-effect"
import { allSettledTruthy } from '../common/promiseUtil'
import {
  addGlQuotesTo,
  getGlAlignmentBiblesList,
  glBibleToResourceLink,
  loadResourceLink,
} from "../core"
import { resourceLink } from '../core/glBible'

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
 * 
 * @todo the business logic for this function is occluded by the ReactJS
 * scafolding (state management code, def of effects, etc.). I would recommend
 * that we extract the business logic as a non-ReactJS function.
 */
const useExtraContent = ({
  verse = 1,
  owner,
  server,
  chapter = 1,
  projectId,
  languageId,
  resourceId,
  httpConfig = {},
  viewMode = 'markdown',
  initialized,
  loading,
  items,
  error,
  reference,
}) => {
  const twlListView = (resourceId === 'twl') && (viewMode === 'list')
  const [loadingGlData, setLoadingGlData] = useState(false)
  const [glBiblesList, setGlBiblesList] = useState(null)
  const [glBibles, setGlBibles] = useState(null)
  const [glLoadedProjectId, setGlLoadedProjectId] = useState(null)
  const [processedItems, setProcessedItems] = useState(null)

  const config = { ...httpConfig, server };
  const wholeBibleReference = toWholeBibleReference(reference);

  useDeepCompareEffect(() => {
    const loadGLBibles = async () => { // load GL bibles in resource manifest
      if (twlListView) { // we only need to load gl quotes if we are showing list view
        if (initialized && !loading && !error && !loadingGlData) {
          setLoadingGlData(true)
          const currentGlRepo = `${owner}/${languageId}`;
          let glBibles_ = glBibles
          let glBiblesList_ = glBiblesList


          //TODO: it appears this check is unnecessary given the nature of React. This function will be called whenever a parameter passed in changes.
          if (glBibles_ && (glLoadedProjectId !== projectId)) { // if we have changed books of the bible need to load new book of the bible
            setGlBibles(null)
            glBibles_ = null
            setProcessedItems(null)
          }

          if (glBiblesList_ && glBiblesList_!== currentGlRepo) { // if we have don't have alignment bibles list for current GL
            setGlBiblesList(null)
            glBiblesList_ = null
            setProcessedItems(null)
          }

          if (!glBiblesList_) { // see if we have alignment bibles list for current GL
            setProcessedItems(null)
            setGlBibles(null)

            const glBibles_ = await allSettledTruthy(getGlAlignmentBiblesList(languageId, config, owner)
              .then(repoNames => 
                repoNames.map(repoName => loadResourceLink(
                  { resourceLink: `${owner}/${languageId}/${repoName}/master`
                  , config
                  , reference: wholeBibleReference 
                  }
                ))
              )
            )

            glBiblesList_ = currentGlRepo;
            setGlBiblesList(glBiblesList_)
            setGlBibles(glBibles_)
            setGlLoadedProjectId(projectId)
          }

          setLoadingGlData(false)
        }
      }
    }
    loadGLBibles().catch(console.error)
  }, [{initialized, loading, error, loadingGlData, projectId, glBibles, glBiblesList, reference, languageId, owner}])

  useDeepCompareEffect(() => { // get gl quotes if we have aligned bibles
    if (twlListView) { // we only need to load gl quotes if we are showing list view
      if (initialized && !loading && !error && !loadingGlData) {
        if (glBibles && items?.length) {
          const newItems = addGlQuotesTo(chapter, verse, items, glBibles);
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
  }, [{initialized, loading, error, loadingGlData, glBibles, items}])


  return {
    processedItems
  }
}

/**
 * WARNING: This is a hack! 
 * Creates a new reference that points a whole Bible
 *
 * @typedef {object} Reference
 * @param {Reference} reference 
 * @return {Reference}
 * @todo document an example
 * @todo consider moving this to the scripture-resources-rcl repo
*/
export const toWholeBibleReference = (reference) => {
  const reference_ = { ...reference };
  // remove chapter and verse so we get back whole book of the bible
  delete reference_.chapter;
  delete reference_.verse;
  return reference_;
}

export default useExtraContent
