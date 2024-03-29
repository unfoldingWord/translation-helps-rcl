import {useState} from 'react'
import {
  createUserBranch,
  getUserEditBranch,
  getUsersWorkingBranch,
  processHttpErrors,
  processUnknownError,
  updateResourceIdIfObs,
} from '../core'
import useDeepCompareEffect from 'use-deep-compare-effect'

/**
 * manage edit branch for card
 * @param {string} appRef - branch or version
 * @param {object} authentication
 * @param {string} bookId - optional for book branch (such as `php`), otherwise we just use a user edit branch
 * @param {string} cardResourceId - resource id for this card such as `ult`
 * @param {number} checkForEditBranch for every change of value, re-check for edit branch
 * @param boolean} isObs - if true then this is an OBS resource
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
    cardResourceId,
    checkForEditBranch,
    isObs = false,
    languageId,
    loggedInUser,
    onResourceError,
    owner,
    server,
}) => {
  // initialize to default for app
  const [state, _setState] = useState({
    branchDetermined: false,
    contentRef: appRef,
    fetchingBranch: false,
    lastFetch: null,
    listRef: appRef,
    ref: appRef,
    usingUserBranch: false,
  })
  const {
    branchDetermined,
    contentRef,
    fetchingBranch,
    lastFetch,
    listRef,
    ref,
    usingUserBranch,
  } = state
  const userEditBranchName = loggedInUser ? getUserEditBranch(loggedInUser, bookId) : null;
  const { resourceId: _resourceId } = updateResourceIdIfObs(cardResourceId, isObs)

  function setState(newState) {
    _setState(prevState => ({ ...prevState, ...newState }))
  }

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
    const repoName = `${languageId}_${_resourceId}`

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
          console.log(
            `useUserBranch - user branch created ${JSON.stringify({
              server,
              owner,
              repoName,
              loggedInUser,
            })}`,
            response
          )

          setState( { ref: userEditBranchName }) // switch current branch to user edit branch
        } else {
          console.log(
            `useUserBranch - already using user branch ${JSON.stringify({
              server,
              owner,
              repoName,
              loggedInUser,
            })}`
          )
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
        let newListRef = listRef, newContentRef = contentRef
        switch (cardResourceId) {
          case 'tw':
            newContentRef = branch
            break

          case 'twl':
            newListRef = branch
            break

          default:
            newListRef = newContentRef = branch
        }

        setState( {
          contentRef: newContentRef,
          listRef: newListRef,
          ref: branch,
          usingUserBranch: true,
        })
        return branch
      } else {
        console.warn(`useUserBranch.startEdit - failed to create user branch`)
        return null
      }
    }
  }

  function finishEdit() {
    setState({
      usingUserBranch: false,
      ref: appRef,
      listRef: appRef,
      contentRef: appRef
    })
  }

  useDeepCompareEffect(() => {
    const updateStatus = async () => {
      let newListRef, newContentRef
      const fetching = JSON.stringify( {
        bookId,
        cardResourceId,
        checkForEditBranch,
        languageId,
        loggedInUser,
        owner,
        appRef,
        server,
      })
      if (fetchingBranch && (fetching === lastFetch)) {
        console.log(`updateStatus() - already fetching`, fetching)
      } else if (fetching !== lastFetch) {
        setState( {
          fetchingBranch: true,
          lastFetch: fetching,
          usingUserBranch: false,
          branchDetermined: false,
        })
        const currentResourceRef = await getWorkingBranchForResource(_resourceId)
        console.log(`updateStatus() - `, fetching)

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
          console.log(`updateStatus() - changing ref`, { _resourceId, ref, currentResourceRef })
        }
        setState( {
          branchDetermined: true,
          contentRef: newContentRef,
          fetchingBranch: false,
          listRef: newListRef,
          ref: currentResourceRef,
          usingUserBranch: currentResourceRef === userEditBranchName,
        })
        console.log(`updateStatus() - branch determined`, { _resourceId, ref, currentResourceRef })
      } else {
        console.log(`updateStatus() - already fetched`, fetching)
        setState( {
          branchDetermined: true,
          fetchingBranch: false,
        })
      }
    }
    if (loggedInUser) {
      updateStatus().catch(console.error)
    }
  }, [
    {
      appRef,
      cardResourceId,
      checkForEditBranch,
      languageId,
      loggedInUser,
      owner,
      server,
    }
  ])

    return {
        state: {
            branchDetermined,
            contentRef,
            listRef,
            usingUserBranch,
            userEditBranchName,
            workingResourceBranch: ref,
        },
        actions: {
          finishEdit,
          startEdit,
        },
    }
}

export default useUserBranch
