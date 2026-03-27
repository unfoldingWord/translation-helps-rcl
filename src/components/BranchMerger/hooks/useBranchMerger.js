import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { defaultStatus, DEFAULT_AUTO_CHECK_INTERVAL } from '../constants'
import { branchOperations } from '../branchOperations'
import { createQueuedOperation } from '../utils/queuedOperation'
import { withRetry } from '../utils/withRetry'

/**
 * useBranchMerger
 *
 * Central hook for managing branch-merger state and actions between a user's
 * working branch and the repository default branch.
 *
 * It provides a small state machine around common branch operations:
 * - checking whether the user branch needs updates from the default branch
 * - pulling default-branch changes into the user branch
 * - checking whether the user branch is ready to merge back to default
 * - pushing the user branch to default
 *
 * The hook also adds a few operational guarantees around those requests:
 * - required parameter validation before network operations begin
 * - retry behavior for transient failures
 * - queued execution so branch operations do not overlap in unsafe ways
 * - optional automatic polling for update status
 *
 * This keeps UI components simple: they can consume one hook for state,
 * loading flags, and actions rather than coordinating branch operations
 * themselves.
 */

// A single shared queue is used across all instances of the hook so branch
// operations are executed sequentially instead of competing with each other.
const globalQueuedOperation = createQueuedOperation()

/**
 * Hook for managing git branch operations between a user branch and the
 * repository default branch.
 *
 * @param {Object} params Required repository and authentication parameters.
 * @param {string} params.server Base server URL.
 * @param {string} params.owner Repository owner or organization name.
 * @param {string} params.repo Repository name.
 * @param {string} params.userBranch Name of the user's working branch.
 * @param {string} params.tokenid Authentication token identifier.
 * @param {Object} [options={}] Optional hook behavior.
 * @param {boolean} [options.autoCheck=false] When true, periodically checks
 * whether the user branch needs updates from the default branch.
 * @param {number} [options.autoCheckInterval=DEFAULT_AUTO_CHECK_INTERVAL]
 * Polling interval in milliseconds for automatic update checks.
 * @returns {{
 *   state: {
 *     mergeStatus: Object,
 *     updateStatus: Object,
 *     loadingUpdate: boolean,
 *     loadingMerge: boolean,
 *     isAutoChecking: boolean
 *   },
 *   actions: {
 *     checkUpdateStatus: (additionalParams?: Object) => Promise<Object>,
 *     checkMergeStatus: (additionalParams?: Object) => Promise<Object>,
 *     updateUserBranch: (additionalParams?: Object) => Promise<Object>,
 *     mergeMasterBranch: (prDescription?: string) => Promise<Object>,
 *     startAutoCheck: () => void,
 *     stopAutoCheck: () => void
 *   }
 * }}
 */
export function useBranchMerger(
  { server, owner, repo, userBranch, tokenid, userId },
  { autoCheck = false, autoCheckInterval = DEFAULT_AUTO_CHECK_INTERVAL } = {}
) {
  const [mergeStatus, setMergeStatus] = useState(defaultStatus)
  const [updateStatus, setUpdateStatus] = useState(defaultStatus)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [loadingMerge, setLoadingMerge] = useState(false)
  const [isAutoChecking, setIsAutoChecking] = useState(autoCheck)

  // Holds the active polling interval so it can be restarted or cleaned up
  // safely when options change or the component unmounts.
  const autoCheckIntervalId = useRef(null)

  // Memoize the operation parameters so callbacks can depend on one stable
  // object rather than individual values.
  const params = useMemo(
    () => ({
      server,
      owner,
      repo,
      userBranch,
      tokenid,
      userId
    }),
    [server, owner, repo, userBranch, tokenid, userId]
  )

  /**
   * Validates that all required branch-operation parameters are present.
   *
   * Instead of throwing, this returns a status-like error object that matches
   * the rest of the hook API. That makes it easier for consumers to handle
   * validation failures the same way they handle remote operation failures.
   *
   * @returns {Object|undefined} A status-shaped error object when validation
   * fails; otherwise `undefined`.
   */
  const validateParams = useCallback(() => {
    const missingParams = Object.entries(params)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingParams.length > 0) {
      return {
        ...defaultStatus,
        error: true,
        message: `Missing required parameters: ${missingParams.join(', ')}`,
      }
    }
  }, [params])

  /**
   * Checks whether the user branch needs to pull changes from the default
   * branch.
   *
   * The request is queued and retried so overlapping branch operations are
   * avoided and transient failures have a chance to recover.
   *
   * @param {Object} [additionalParams={}] Optional overrides merged into the
   * request parameters.
   * @returns {Promise<Object>} The resulting update-status object.
   */
  const checkUpdateStatus = useCallback(
    async (additionalParams = {}) => {
      const validationError = validateParams()
      if (validationError) return validationError

      setLoadingUpdate(true)
      try {
        const result = await withRetry(() =>
          globalQueuedOperation(() =>
            branchOperations.checkPullFromDefault({
              ...params,
              ...additionalParams,
            })
          )
        )
        setUpdateStatus(result)
        return result
      } catch (error) {
        const errorStatus = {
          ...defaultStatus,
          error: true,
          message: error.message,
        }
        setUpdateStatus(errorStatus)
        return errorStatus
      } finally {
        setLoadingUpdate(false)
      }
    },
    [params, validateParams]
  )

  /**
   * Pulls changes from the default branch into the user branch.
   *
   * The returned status is written back into `updateStatus` so consumers can
   * immediately reflect the latest update result in the UI.
   *
   * @param {Object} [additionalParams={}] Optional overrides merged into the
   * request parameters.
   * @returns {Promise<Object>} The resulting update-status object.
   */
  const updateUserBranch = useCallback(
    async (additionalParams = {}) => {
      const validationError = validateParams()
      if (validationError) return validationError

      setLoadingUpdate(true)
      try {
        const result = await withRetry(() =>
          globalQueuedOperation(() =>
            branchOperations.pullFromDefault({ ...params, ...additionalParams })
          )
        )
        setUpdateStatus(result)
        return result
      } catch (error) {
        const errorStatus = {
          ...defaultStatus,
          error: true,
          message: error.message,
        }
        setUpdateStatus(errorStatus)
        return errorStatus
      } finally {
        setLoadingUpdate(false)
      }
    },
    [params, validateParams]
  )

  /**
   * Checks whether the user branch is ready to merge into the default branch.
   *
   * This is tracked separately from update status because "can I merge?" and
   * "do I need to update first?" are related but distinct repository states.
   *
   * @param {Object} [additionalParams={}] Optional overrides merged into the
   * request parameters.
   * @returns {Promise<Object>} The resulting merge-status object.
   */
  const checkMergeStatus = useCallback(
    async (additionalParams = {}) => {
      const validationError = validateParams()
      if (validationError) return validationError

      setLoadingMerge(true)
      try {
        const result = await withRetry(() =>
          globalQueuedOperation(() =>
            branchOperations.checkPushToDefault({
              ...params,
              ...additionalParams,
            })
          )
        )
        setMergeStatus(result)
        return result
      } catch (error) {
        const errorStatus = {
          ...defaultStatus,
          error: true,
          message: error.message,
        }
        setMergeStatus(errorStatus)
        return errorStatus
      } finally {
        setLoadingMerge(false)
      }
    },
    [params, validateParams]
  )

  /**
   * Merges the user branch into the default branch.
   *
   * @param {string} [prDescription] Optional pull-request or merge description
   * passed through to the branch operation.
   * @returns {Promise<Object>} The resulting merge-status object.
   */
  const mergeMasterBranch = useCallback(
    async prDescription => {
      const validationError = validateParams()
      if (validationError) return validationError

      setLoadingMerge(true)
      try {
        const result = await withRetry(() =>
          globalQueuedOperation(() =>
            branchOperations.pushToDefault({ ...params, prDescription })
          )
        )
        setMergeStatus(result)
        return result
      } catch (error) {
        const errorStatus = {
          ...defaultStatus,
          error: true,
          message: error.message,
        }
        setMergeStatus(errorStatus)
        return errorStatus
      } finally {
        setLoadingMerge(false)
      }
    },
    [params, validateParams]
  )

  /**
   * Starts periodic update-status polling.
   *
   * If polling is already active, this function exits early to avoid creating
   * duplicate intervals.
   */
  const startAutoCheck = useCallback(() => {
    if (autoCheckIntervalId.current) return

    setIsAutoChecking(true)

    // Run one check immediately so the UI does not wait for the first interval
    // tick before showing current update state.
    checkUpdateStatus()

    autoCheckIntervalId.current = setInterval(
      checkUpdateStatus,
      autoCheckInterval
    )
  }, [checkUpdateStatus, autoCheckInterval])

  /**
   * Stops periodic update-status polling and clears the active interval.
   */
  const stopAutoCheck = useCallback(() => {
    if (autoCheckIntervalId.current) {
      clearInterval(autoCheckIntervalId.current)
      autoCheckIntervalId.current = null
    }
    setIsAutoChecking(false)
  }, [])

  // Start polling automatically when requested, and always clean up the active
  // interval when the component using this hook unmounts.
  useEffect(() => {
    if (autoCheck) {
      startAutoCheck()
    }

    return () => {
      if (autoCheckIntervalId.current) {
        clearInterval(autoCheckIntervalId.current)
      }
    }
  }, [autoCheck, startAutoCheck])

  // If the polling interval changes while auto-checking is active, restart the
  // timer so the new interval takes effect immediately.
  useEffect(() => {
    if (isAutoChecking) {
      stopAutoCheck()
      startAutoCheck()
    }
  }, [autoCheckInterval, isAutoChecking, startAutoCheck, stopAutoCheck])

  // Run initial status checks on mount:
  // - merge status is always checked
  // - update status is checked here only when polling is disabled, because the
  //   polling startup path already performs an immediate update check
  useEffect(() => {
    checkMergeStatus()
    if (!autoCheck) {
      checkUpdateStatus() // Only check if not auto-checking
    }
  }, [checkMergeStatus, checkUpdateStatus, autoCheck])

  return {
    state: {
      mergeStatus,
      updateStatus,
      loadingUpdate,
      loadingMerge,
      isAutoChecking,
    },
    actions: {
      checkUpdateStatus,
      checkMergeStatus,
      updateUserBranch,
      mergeMasterBranch,
      startAutoCheck,
      stopAutoCheck,
    },
  }
}

export default useBranchMerger
