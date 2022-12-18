import { useState } from 'react'
import {
  createUserBranch,
  getUserEditBranch,
  getUsersWorkingBranch,
  processHttpErrors,
  processUnknownError,
} from '../core'
import useDeepCompareEffect from 'use-deep-compare-effect'

/**
 * manage edit state for card
 * @param {string} languageId
 * @param {string} server
 * @param {string} owner
 * @param {string} ref
 * @param {function} setRef
 * @param {function} useUserLocalStorage
 * @param {string} loggedInUser
 * @param {object} authentication
 * @param {string} cardResourceId - resource id for this card
 * @param {string} cardId - id for the card
 * @param {string} projectId
 * @param {function} onResourceError - callback function for error fetching resource
 * @return {{state: {editing: boolean}, actions: {startEdit: ((function(): Promise<void>)|*), saveEdit: ((function(*): Promise<void>)|*)}}}
 */
const useUserBranch = ({
  owner,
  server,
  appRef,
  cardId,
  languageId,
  loggedInUser,
  authentication,
  cardResourceId,
  onResourceError,
  useUserLocalStorage,
}) => {
  // initialize to default for app
  const [ref, setRef] = useUserLocalStorage(`${cardId}_ref`, appRef)
  const [usingUserBranch, setUsingUserBranch] = useUserLocalStorage
    ? useUserLocalStorage(`editing_${cardId}_${languageId}`, false)
    : useState(false)
  const [listRef, setListRef] = useState(ref)
  const [contentRef, setContentRef] = useState(ref)
  const userEditBranchName = getUserEditBranch(loggedInUser)

  async function getWorkingBranchForResource(resourceId) {
    const repoName = `${languageId}_${resourceId}`
    let currentBranch

    try {
      currentBranch = await getUsersWorkingBranch(
        server,
        owner,
        repoName,
        userEditBranchName
      )
    } catch (e) {
      console.error(
        `useUserBranch - get user branch FAILED ${JSON.stringify({
          server,
          owner,
          repoName,
          loggedInUser,
        })}`,
        e
      )
      processHttpErrors(
        e?.response || null,
        `${repoName} user edit branch`,
        e?.url,
        onResourceError
      )
    }
    return currentBranch
  }

  /**
   * makes sure that we are using the user's edit branch, if not it creates one for user
   * @return {Promise<boolean>} returns true if user branch already exists or created
   */
  async function ensureUserEditBranch() {
    const repoName = `${languageId}_${cardResourceId}`
    const config = authentication.config

    try {
      if (ref !== userEditBranchName) {
        const response = await createUserBranch(
          server,
          owner,
          repoName,
          config,
          userEditBranchName
        )
        console.info(
          `useUserBranch - user branch created ${JSON.stringify({
            server,
            owner,
            repoName,
            loggedInUser,
          })}`,
          response
        )

        setRef(userEditBranchName) // switch current branch to user edit branch
      }
      return userEditBranchName
    } catch (e) {
      console.error(`useUserBranch - ensureUserEditBranch FAILED`, e)
      processUnknownError(
        e,
        'DCS API',
        `create user branch ${userEditBranchName} on ${repoName}`,
        onResourceError
      )
    }
    return false
  }

  /**
   * called to make sure user edit branch exists and that we are switched to that branch
   * @return {Promise<void>}
   */
  async function startEdit() {
    if (!usingUserBranch) {
      const branch = await ensureUserEditBranch()
      setUsingUserBranch(true)
      return branch
    }

    return false
  }

  /**
   * update ref value if different
   * @param {any} ref
   * @param {any} newRef
   * @param {function} setRefState
   */
  function updateRef(ref, newRef, setRefState) {
    newRef = newRef || 'master' // default to master in case error fetching branch name
    if (ref !== newRef) {
      setRefState(newRef)
    }
  }

  useDeepCompareEffect(() => {
    const updateStatus = async () => {
      let newListRef, newContentRef
      const currentResourceRef = await getWorkingBranchForResource(cardResourceId)

      // TRICKY: in the case of tWords there are two repos (tw for articles and twl for word list) and each one may have different branch
      switch (cardResourceId) {
        case 'tw':
          newContentRef = currentResourceRef
          newListRef = await getWorkingBranchForResource('twl')
          break

        case 'twl':
          newListRef = currentResourceRef
          newContentRef = await getWorkingBranchForResource('tw')
          break

        default:
          newListRef = newContentRef = currentResourceRef
      }

      // update states
      if (currentResourceRef !== ref) {
        setRef(currentResourceRef)
      }

      setUsingUserBranch(currentResourceRef === userEditBranchName) // if edit branch may have been merged or deleted, we are no longer using edit branch
      updateRef(listRef, newListRef, setListRef)
      updateRef(contentRef, newContentRef, setContentRef)
    }
    updateStatus().catch(console.error)
  }, [
    {
      ref,
      languageId,
      server,
      owner,
    }
  ])

  return {
    state: {
      listRef,
      contentRef,
      usingUserBranch,
      workingResourceBranch: ref,
    },
    actions: { startEdit },
  }
}

export default useUserBranch
