import useDeepCompareEffect from 'use-deep-compare-effect'
import { useState } from 'react'
import * as Items from '../core/items'
import { collectPromises } from '../common/promiseUtil'
import {
  addGlQuotesTo,
  getGlAlignmentBiblesList,
  loadResourceLink,
} from "../core"


/**
 * hook for loading extra content to specific translation helps resources.
 *      Currently only twl list view needs extra data (GL quotes) to be added.
 * @param {number|string} verse
 * @param {string} owner
 * @param {string} server
 * @param {number|string} chapter
 * @param {string} filePath - optional file path, currently just seems to be a pass through value - not being used by useRsrc or useTsvItems
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
 * @param {object} reference
 * 
 * @return {null | List<item>} no items (null) or a non-empty list of items
 *
 */
export const useExtraContent = ({
  verse = 1,
  owner,
  server,
  chapter = 1,
  languageId,
  resourceId,
  httpConfig = {},
  viewMode = 'markdown',
  initialized,
  loading,
  error,
  reference,
}) => {
  const [processedItems, setProcessedItems] = useState(Items.empty());

  const config = { ...httpConfig, server };

  useDeepCompareEffect
    (() => {
      const shouldLoadResource = 
        resourceId === 'twl' 
        && viewMode === 'list' 
        && initialized 
        && !loading 
        && !error 

      if(shouldLoadResource) 
        getGlAlignmentBiblesList(languageId, config, owner)
          .then(repoNames => collectPromises(repoNames, repoName => 
            loadResourceLink(
              { resourceLink: `${owner}/${languageId}/${repoName}/master`
              , config
              , reference: toWholeBibleReference(reference) 
              }
            )
            .catch(e => { throw {repoName, error: e} })
          ))
          .then(({errors, values}) => {
            console.log('useExtraContext Errors', errors)
            return values
          })
          .then(items => addGlQuotesTo(chapter, verse, items))
          .then(newItems => setProcessedItems(newItems))
          .catch(e => { setProcessedItems(Items.empty()); throw e })
    }
    , [resourceId, viewMode, initialized, loading, error, languageId, config, owner, reference]
    )

  return { processedItems }
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
