import { get, post } from 'gitea-react-toolkit';
import { USER_BRANCH_EXTENSION } from "../common";
import axios from "axios";

/**
 * query server for list of branches on repo
 * @param {string} server such as https://git.door43.org
 * @param {string} repoOwner
 * @param {string} repoName
 * @return {Promise<array>} returns list of branches for repo
 */
export async function getBranchesForRepo(server, repoOwner, repoName, ) {
  const response = await get({
    url: `${server}/api/v1/repos/${repoOwner}/${repoName}/branches`,
    config: {
      server,
      skipNetworkCheck: true,
    },
    noCache: true,
  });

  return response;
}

/**
 * generate user branch name based on logged in user
 * @param {string} loggedInUser
 * @return {string} name for user edit branch
 */
export function getUserEditBranch(loggedInUser) {
  return `${loggedInUser}${USER_BRANCH_EXTENSION}`;
}

/**
 * gets the metadata for branch
 * @param {string} server such as https://git.door43.org
 * @param {string} repoOwner
 * @param {string} repoName
 * @param {string} branch - branch name to match
 * @return {Promise<object>} returns the metadata response and flag if branch exists
 */
export async function getBranchMetaData(server, repoOwner, repoName, branch) {
  const url = `${server}/api/v1/repos/${repoOwner}/${repoName}/branches/${branch}`
  let error = true
  let response
  try {
    response = await get({
      url,
      config: {
        server,
        skipNetworkCheck: true,
      },
      noCache: true,
      fullResponse: true,
    });

    switch (response?.status) {
      case 200:
      case 404:
        error = false
        break

      default:
        // any other response is an unexpected error
        error = new Error(`Error getting repo status '${url}'`)
        error.response = response
        error.url = url
    }
  } catch (e) {
    response = e?.response
    if (response?.status === 404) { // branch missing is a known error we can handle
      error = false
    } else {
      error = e
    }
  }

  if (error) {
    throw error
  }

  return {
    isBranchPresent: response?.status === 200,
    response,
  }
}

/**
 * Checks to see if user edit branch name `${branchUser}${userExtension}` exists. If so, it returns the name of the user branch, Otherwise returns 'master'
 * @param {string} server such as https://git.door43.org
 * @param {string} repoOwner
 * @param {string} repoName
 * @param {string} userBranch - user branch name to find
 * @return {Promise<string>} returns name of userBranch if found, otherwise returns master
 */
export async function getUsersWorkingBranch(server, repoOwner, repoName, userBranch) {
  const response = await getBranchMetaData(server, repoOwner, repoName, userBranch);
  const found = response?.isBranchPresent;
  return found ? userBranch : 'master';
}

/**
 * creates a user edit branch based off master
 * @param {string} server such as https://git.door43.org
 * @param {string} repoOwner
 * @param {string} repoName
 * @param {object} config - includes authentication, etc
 * @param {string} userBranch - branch name to create
 * @return {Promise<string>} working extension for branch
 */
export async function createUserBranch(server, repoOwner, repoName, config, userBranch) {
  const response = await post({
    url: `${server}/api/v1/repos/${repoOwner}/${repoName}/branches`,
    config: {
      ...config,
      server,
    },
    payload: {
      new_branch_name: userBranch,
      old_branch_name: 'master',
    }
  });

  return response;
}
