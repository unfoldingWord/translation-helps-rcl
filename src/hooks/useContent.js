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
import useDeepCompareEffect from "use-deep-compare-effect";
import { getUserEditBranch, getUsersWorkingBranch } from "../core";

/**
 * hook for loading content of translation helps resources
 * @param {string} verse
 * @param {string} owner
 * @param {string} ref - points to specific ref that could be a branch or tag
 * @param {function} setRef
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
  verse,
  owner,
  ref,
  server,
  chapter,
  filePath,
  projectId,
  languageId,
  resourceId,
  fetchMarkdown,
  onResourceError,
  httpConfig = {},
  loggedInUser,
}) => {
  const [initialized, setInitialized] = useState(false)
  const [listRef, setListRef] = useState(ref)
  const [contentRef, setContentRef] = useState(ref)

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

  /**
   * update state value if different
   * @param {any} state
   * @param {any} newState
   * @param {function} setState
   */
  function updateState(state, newState, setState) {
    if (state !== newState) {
      setState(newState)
    }
  }

  useDeepCompareEffect(async () => {
    // TRICKY: in the case of tWords there are two repos (tw for articles and twl for word list) and each one may have different branch
    const isTwType = (resourceId === 'tw') || (resourceId === 'twl')

    if (isTwType) {
      const userEditBranch = getUserEditBranch(loggedInUser);
      const listRepoName = `${languageId}_${resourceId}`
      const currentListBranch = await getUsersWorkingBranch(server, owner, listRepoName, userEditBranch)
      const contentRepoName = `${languageId}_tw`
      const currentContentBranch = await getUsersWorkingBranch(server, owner, contentRepoName, userEditBranch)
      updateState(listRef, currentListBranch, setListRef)
      updateState(contentRef, currentContentBranch, setContentRef)
    } else {
      updateState(listRef, ref, setListRef)
      updateState(contentRef, ref, setContentRef)
    }
  }, [{
    ref,
    resourceId,
    resourceLink,
    reference,
    config
  }])

  return {
    items,
    resource,
    markdown: Array.isArray(content) ? null : content,
    resourceStatus,
    props: {
      verse,
      owner,
      ref,
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
  ref: 'master',
  fetchMarkdown: true,
}

export default useContent
