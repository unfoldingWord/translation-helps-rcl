import { get, post } from 'gitea-react-toolkit';

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
    },
    noCache: true,
  });

  return response;
}

/**
 * query server for list of branches on repo.  Will return user edit branch name `${branchUser}${userExtension}` if exists or 'master'
 * @param {string} server such as https://git.door43.org
 * @param {string} repoOwner
 * @param {string} repoName
 * @param {string} userBranch - branch name to match
 * @return {Promise<string>} returns name of userBranch if found, otherwise returns master
 */
export async function getUsersWorkingBranch(server, repoOwner, repoName, userBranch) {
  const response = await getBranchesForRepo(server, repoOwner, repoName);
  const found = response.find(branch => (branch.name === userBranch));
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
