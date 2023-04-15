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
 * manage edit branch for card
 * @param {string} appRef
 * @param {object} authentication
 * @param {string} bookId - optional for book branch (such as `php`), otherwise we just use a user edit branch
 * @param {string} cardResourceId - resource id for this card such as `ult`
 * @param {string} cardId - id for the card such as `scripture_card_Literal_Translation`
 * @param {string} languageId
 * @param {string} loggedInUser
 * @param {function} onResourceError - callback function for error fetching resource
 * @param {string} owner
 * @param {string} server
 * @param {function} useUserLocalStorage
 * @return {{state: {editing: boolean}, actions: {startEdit: ((function(): Promise<void>)|*), saveEdit: ((function(*): Promise<void>)|*)}}}
 */
const useUserBranch = ({
    appRef,
    authentication,
    bookId,
    cardId,
    cardResourceId,
    languageId,
    loggedInUser,
    onResourceError,
    owner,
    server,
    useUserLocalStorage,
}) => {
  // initialize to default for app
  const [ref, setRef] = useUserLocalStorage(`${cardId}_ref`, appRef)
  const [usingUserBranch, setUsingUserBranch] = useUserLocalStorage
    ? useUserLocalStorage(`editing_${cardId}_${languageId}`, false)
    : useState(false)
  const [listRef, setListRef] = useState(ref)
  const [contentRef, setContentRef] = useState(ref)
  const userEditBranchName = loggedInUser ? getUserEditBranch(loggedInUser, bookId) : null;
  const [fetchingBranch, setFetchingBranch] = useState(false)
  const [lastFetch, setLastFetch] = useState(null)

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

    if (authentication) {
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
      if (branch) {
        setUsingUserBranch(true)
        return branch
      }
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
      const fetching = JSON.stringify( {
        bookId,
        cardResourceId,
        languageId,
        loggedInUser,
        owner,
        appRef,
        server,
      })
      if (fetching !== lastFetch) {
        setFetchingBranch(true)
        const currentResourceRef = await getWorkingBranchForResource(cardResourceId)
        // console.log(`updateStatus() - `, {
        //   owner,
        //   cardResourceId,
        //   languageId,
        //   loggedInUser,
        //   appRef,
        //   currentResourceRef,
        // })

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
          console.log(`updateStatus() - changing ref`, { cardResourceId, ref, currentResourceRef })
          setRef(currentResourceRef)
        }

        const newUsingUserBranch = currentResourceRef === userEditBranchName;
        if (newUsingUserBranch !== usingUserBranch) {
          setUsingUserBranch(newUsingUserBranch) // if edit branch may have been merged or deleted, we are no longer using edit branch
        }
        updateRef(listRef, newListRef, setListRef)
        updateRef(contentRef, newContentRef, setContentRef)
        setFetchingBranch(false)
        setLastFetch(fetching);
      }
    }
    if (loggedInUser && !fetchingBranch) {
      updateStatus().catch(console.error)
    }
  }, [
    {
      appRef,
      bookId,
      cardResourceId,
      languageId,
      loggedInUser,
      owner,
      server,
    }
  ])

  return {
    state: {
      contentRef,
      listRef,
      userEditBranchName,
      usingUserBranch,
      workingResourceBranch: ref,
    },
    actions: { startEdit },
  }
}

export default useUserBranch
