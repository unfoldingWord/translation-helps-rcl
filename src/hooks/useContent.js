import { useEffect, useState } from 'react'
import { core, useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'
import {
  CONTENT_NOT_FOUND_ERROR, DOOR43_CATALOG,
  ERROR_STATE,
  INITIALIZED_STATE,
  LOADING_STATE,
  MANIFEST_NOT_LOADED_ERROR,
} from '../common/constants'
import { searchCatalogForRepos } from "../core";

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
}) => {
  const [initialized, setInitialized] = useState(false)
  const [loadingGlBible, setLoadingGlBible] = useState(false)
  const [glBibles, setGlBibles] = useState(null)

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

  useEffect(async () => {
    if ((resourceId === 'twl') && initialized && !loading && !error && !loadingGlBible && !glBibles) {
      setLoadingGlBible(true)
      const glBibles_ = await getGlAlignmentBibles(languageId, httpConfig, server, owner)
      console.log('useContent - GL bibles loaded')
      setGlBibles(glBibles_)
      setLoadingGlBible(false)
    }
  }, [initialized, loading, error, loadingGlBible, glBibles])

  async function getGlAlignmentBibles(languageId, httpConfig, server, owner) {
    const glBibles_ = []
    const glBibleList = await getGlAlignmentBiblesList(languageId, httpConfig, server, owner);
    for (const glBible of glBibleList) {
      const bible = await loadGlBible(glBible)
      if (bible) {
        glBibles_.push(bible)
      }
    }
    return glBibles_
  }

  async function loadGlBible(glBible) {
    console.log(`loadGlBible() - loading ${glBible}`)

    // get GL bible
    const [langId, bible] = glBible.split('_')
    const resourceLink = `${DOOR43_CATALOG}/${langId}/${bible}/${listRef}`
    const config_ = {
      server,
      ...httpConfig,
    };
    try {
      const resource = await core.resourceFromResourceLink({
        resourceLink,
        reference,
        config: config_,
      })
      let loaded = false
      if (resource?.manifest && resource?.project?.parseUsfm) { // we have manifest and parse USFM function
        console.log(`loadGlBible() - loaded ${glBible} from ${resourceLink}`, resource)
        const fileResults = await resource?.project?.parseUsfm()

        if (fileResults?.response?.status === 200) {
          const json = fileResults?.json;

          if (json) {
            console.log(`loadGlBible() - loaded ${glBible} json`)
            return {
              resource,
              json,
            }
          } else {
            console.log(`useContent - skipping ${glBible} - not a bible`)
          }

          const contextId = {
            reference: {
              chapter,
              verse,
            }
          }
        }
      }
      console.warn(`useContent - ${glBible} is not a valid bible at ${resourceLink}`)
    } catch (e) {
      console.warn(`useContent - error loading ${resourceLink}`, e)
    }
    return null
  }

  async function getGlAlignmentBiblesList(languageId, httpConfig, server, owner) {
    const params = {
      owner: DOOR43_CATALOG,
      lang: languageId,
      subject: ['Aligned Bible', 'Bible']
    }
    const config_ = {
      server,
      ...httpConfig,
    };
    let results

    try {
      results = await core.getResourceManifest({
        username: owner,
        languageId,
        resourceId: 'tw',
        config: config_,
        fullResponse: true,
      })
    } catch (e) {
      console.warn('tw manifest', e)
    }

    console.log('tw manifest', results)

    if (!results?.manifest) {
      return null
    }

    const bibleRepos = await searchCatalogForRepos(server, httpConfig, params)
    console.log('twl bibles found', bibleRepos)

    let alignmentBibles = []
    if (bibleRepos) {
      const tsv_relations = results?.manifest?.dublin_core?.relation
      if (tsv_relations) {
        for (const repo of tsv_relations) {
          const [langId, bible] = repo.split('/')
          const repoName = `${langId}_${bible}`
          if ((langId === languageId) && (bible !== 'obs')) { // if GL bible
            console.log(`getGlAlignmentBibles - found GL bible ${repoName}`)
            alignmentBibles.push(repoName)
          } else {
            console.log(`getGlAlignmentBibles - skipping - not GL bible ${repoName}`)
          }
        }
      }
    }

    return alignmentBibles
  }

  return {
    items,
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
