import { useState, useEffect } from 'react'
import { USER_BRANCH_EXTENSION } from "../common";
import {createUserBranch, getUsersWorkingBranch, processUnknownError} from "../core";

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
 * @param {function} onResourceError - callback function for error fetching resource
 * @return {{state: {editing: boolean}, actions: {startEdit: ((function(): Promise<void>)|*), saveEdit: ((function(*): Promise<void>)|*)}}}
 */
const useEditState = ({
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
  const [editing, setEditing] = useUserLocalStorage
    ? useUserLocalStorage(`editing_${cardId}_${languageId}`, false)
    : useState(false)

  function getUserEditBranch() {
    return `${loggedInUser}${USER_BRANCH_EXTENSION}`;
  }

  useEffect(async () => { // query to make sure we are loading the correct branch.  If userEdit branch exists load it, otherwise load master
    const repoName = `${languageId}_${cardResourceId}`
    try {
      const currentBranch = await getUsersWorkingBranch(server, owner, repoName, getUserEditBranch())
      console.log(`useEditState - get user branch SUCCESS ${JSON.stringify({ server, owner, repoName, loggedInUser })}`)
      if (currentBranch !== ref) {
        setRef(currentBranch)
      }
      if (currentBranch === 'master') {
        setEditing(currentBranch) // edit branch merged or deleted, no longer in edit mode
      }
    } catch (e) {
      // TODO - add error handling
      console.error(`useEditState - get user branch FAILED ${JSON.stringify({ server, owner, repoName, loggedInUser })}`, e)
    }
  }, [])

  async function startEdit() {
    if (!editing) {
      try {
        const repoName = `${languageId}_${cardResourceId}`
        const userBranch = getUserEditBranch()
        const config = authentication.config

        if (ref !== userBranch) {
          const response = await createUserBranch(server, owner, repoName, config, userBranch)
          console.log(`useEditState - startEdit user branch created ${JSON.stringify({
            server,
            owner,
            repoName,
            loggedInUser
          })}`, response)

          setEditing(true)
          setRef(userBranch)
        }

        // TODO: add other edit setup steps related to data
      } catch (e) {
        // TODO - add error handling
        console.error(`useEditState - startEdit FAILED`, e)
        processUnknownError(e, 'DCS API', 'create user branch', onResourceError)
      }
    }
  }

  async function saveEdit(data) {
    if (editing) {
      // TODO: add steps to make a commit
      setEditing(false) // TODO: remove after testing
    }
  }

  return {
    state: {
      editing,
    },
    actions: {
      startEdit,
      saveEdit,
    },
  }
}

export default useEditState
