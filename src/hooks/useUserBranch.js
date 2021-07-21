import { useState, useEffect } from 'react'
import {
  createUserBranch,
  getBranchMetaData,
  getUserEditBranch,
  getUsersWorkingBranch, processHttpErrors,
  processUnknownError,
} from "../core"

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
  languageId,
  server,
  owner,
  ref,
  setRef,
  useUserLocalStorage,
  loggedInUser,
  authentication,
  cardResourceId,
  cardId,
  onResourceError,
}) => {
  const [usingUserBranch, setUsingUserBranch] = useUserLocalStorage
    ? useUserLocalStorage(`editing_${cardId}_${languageId}`, false)
    : useState(false)
  const repoName = `${languageId}_${cardResourceId}`

  useEffect(async () => { // query to make sure we are loading the correct branch.  If userEdit branch exists load it, otherwise load master
    try {
      const userEditBranch = getUserEditBranch(loggedInUser);
      const currentBranch = await getUsersWorkingBranch(server, owner, repoName, userEditBranch)
      if (currentBranch !== ref) {
        setRef(currentBranch)
      }
      setUsingUserBranch(currentBranch === userEditBranch) // if edit branch may have been merged or deleted, we are no longer using edit branch
    } catch (e) {
      console.error(`useEditState - get user branch FAILED ${JSON.stringify({ server, owner, repoName, loggedInUser })}`, e)
      processHttpErrors(e?.response || null, `${repoName} user edit branch`, e?.url, onResourceError)
    }
  }, [])

  /**
   * makes sure that we are using the user's edit branch, if not it creates one for user
   * @return {Promise<boolean>} returns true if user branch already exists or created
   */
  async function ensureUserEditBranch() {
    const userBranch = getUserEditBranch(loggedInUser)
    const config = authentication.config

    try {
      if (ref !== userBranch) {
        const response = await createUserBranch(server, owner, repoName, config, userBranch)
        console.log(`useEditState - startEdit user branch created ${JSON.stringify({
          server,
          owner,
          repoName,
          loggedInUser
        })}`, response)

        setRef(userBranch) // switch current branch to user edit branch
      }
      return true
    } catch (e) {
      console.error(`useEditState - startEdit FAILED`, e)
      processUnknownError(e, 'DCS API', `create user branch ${userBranch} on ${repoName}`, onResourceError)
    }
    return false
  }

  /**
   * called to make sure user edit branch exists and that we are switched to that branch
   * @return {Promise<void>}
   */
  async function startEdit() {
    if (!usingUserBranch) {
      const success = await ensureUserEditBranch()
      setUsingUserBranch(true)
    }
  }

  return {
    state: { usingUserBranch },
    actions: { startEdit },
  }
}

export default useUserBranch
