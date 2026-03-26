import { useState } from 'react'

/**
 * useMasterMergeProps
 *
 * A small convenience hook that wraps the "merge master into user branch" flow
 * exposed by the branch merger state/actions object.
 *
 * Responsibilities:
 * - track local loading state while a merge request is in flight
 * - call the merge action with the provided description
 * - notify consumers when the merge succeeds
 * - refresh update status after a successful merge so dependent UI stays in sync
 *
 * This hook is intended to provide a simple props-like interface for merge UI
 * components without forcing those components to know the details of the
 * branch-merger implementation.
 *
 * @param {Object} [params={}] Hook configuration.
 * @param {Object} params.useBranchMerger Branch merger hook result containing
 * state and actions used to perform the merge.
 * @param {Function|null} [params.onMerge=null] Optional callback invoked after
 * a successful merge.
 * @returns {{
 *   isLoading: boolean,
 *   callMergeUserBranch: (description: string) => Promise<Object>
 * }} Props and actions for merge-related UI.
 */
export default function useMasterMergeProps({
  useBranchMerger,
  onMerge = null,
} = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    state: { loadingMerge },
    actions: { mergeMasterBranch, checkUpdateStatus },
  } = useBranchMerger

  /**
   * Attempts to merge the master branch into the current user branch.
   *
   * The loading state is managed locally so consuming components can disable
   * interactions immediately, while `loadingMerge` still reflects branch-merger
   * state managed elsewhere.
   *
   * On success:
   * - the optional `onMerge` callback is fired
   * - update status is refreshed so the UI reflects the latest branch state
   *
   * On failure:
   * - a warning is logged
   * - the raw response is still returned so callers can handle it if needed
   *
   * @param {string} description Optional merge description/message passed to the
   * merge action.
   * @returns {Promise<Object>} The response returned by `mergeMasterBranch`.
   */
  const callMergeUserBranch = async description => {
    setIsLoading(true)
    const response = await mergeMasterBranch(description)
    setIsLoading(false)

    if (response.success && response.message === '') {
      onMerge?.()

      // Refresh status after a successful merge so dependent controls reflect
      // the updated repository state.
      await checkUpdateStatus()
    } else {
      // Failures are not surfaced here beyond logging; the caller receives the
      // response and can decide how to present the error.
      console.warn(`callMergeUserBranch() - mergeMasterBranch failed ${response.message}`)
    }

    return response
  }

  return {
    // Combines local request state with branch-merger state so consumers only
    // need to check a single loading flag.
    isLoading: isLoading || loadingMerge,
    callMergeUserBranch,
  }
}
