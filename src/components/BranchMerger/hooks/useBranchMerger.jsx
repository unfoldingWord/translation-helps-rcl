import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { defaultStatus, DEFAULT_AUTO_CHECK_INTERVAL } from '../constants'
import { branchOperations } from '../branchOperations'
import { createQueuedOperation } from '../utils/queuedOperation'
import { withRetry } from '../utils/withRetry'

/**
 * Hook for managing git branch operations between user branch and default/master branch.
 * Handles merging, updating, and checking status of branches with rate limiting and retries.
 *
 * @param {Object} params
 * @param {string} params.server - Server URL
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {string} params.userBranch - User branch name
 * @param {string} params.tokenid - Authentication token
 * @param {Object} [options]
 * @param {boolean} [options.autoCheck=false] - Enable automatic status checking
 * @param {number} [options.autoCheckInterval=30000] - Interval for auto checking in ms
 * @param {Function} [options.onUpdateError] - Callback when update operations fail
 * @param {Function} [options.onMergeError] - Callback when merge operations fail
 * @param {Function} [options.onCheckError] - Callback when status check operations fail
 */

// Create a single shared queue for all hook instances
const globalQueuedOperation = createQueuedOperation()

export function useBranchMerger(
  { server, owner, repo, userBranch, tokenid },
  {
    autoCheck = false,
    autoCheckInterval = DEFAULT_AUTO_CHECK_INTERVAL,
    onUpdateError,
    onMergeError,
    onCheckError,
  } = {}
) {
  const [mergeStatus, setMergeStatus] = useState(defaultStatus)
  const [updateStatus, setUpdateStatus] = useState(defaultStatus)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [loadingMerge, setLoadingMerge] = useState(false)
  const [isAutoChecking, setIsAutoChecking] = useState(autoCheck)

  // Store interval ID for cleanup
  const autoCheckIntervalId = useRef(null)

  // Remove the queuedOperation from useMemo
  const params = useMemo(
    () => ({
      server,
      owner,
      repo,
      userBranch,
      tokenid,
    }),
    [server, owner, repo, userBranch, tokenid]
  )

  // Validate all required parameters are present
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

  // Create operations with consistent error handling and loading states
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
        onCheckError?.(error, 'update')
        return errorStatus
      } finally {
        setLoadingUpdate(false)
      }
    },
    [params, validateParams, onCheckError]
  )

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
        onUpdateError?.(error)
        return errorStatus
      } finally {
        setLoadingUpdate(false)
      }
    },
    [params, validateParams, onUpdateError]
  )

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
        onCheckError?.(error, 'merge')
        return errorStatus
      } finally {
        setLoadingMerge(false)
      }
    },
    [params, validateParams, onCheckError]
  )

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
        onMergeError?.(error)
        return errorStatus
      } finally {
        setLoadingMerge(false)
      }
    },
    [params, validateParams, onMergeError]
  )

  /**
   * Start automatic status checking at specified interval
   */
  const startAutoCheck = useCallback(() => {
    if (autoCheckIntervalId.current) return // Already running

    setIsAutoChecking(true)
    checkUpdateStatus() // Initial check
    autoCheckIntervalId.current = setInterval(
      checkUpdateStatus,
      autoCheckInterval
    )
  }, [checkUpdateStatus, autoCheckInterval])

  /**
   * Stop automatic status checking
   */
  const stopAutoCheck = useCallback(() => {
    if (autoCheckIntervalId.current) {
      clearInterval(autoCheckIntervalId.current)
      autoCheckIntervalId.current = null
    }
    setIsAutoChecking(false)
  }, [])

  // Handle auto-check initialization and cleanup
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

  // Handle changes to autoCheckInterval
  useEffect(() => {
    if (isAutoChecking) {
      stopAutoCheck()
      startAutoCheck()
    }
  }, [autoCheckInterval, isAutoChecking, startAutoCheck, stopAutoCheck])

  // Initial status check
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
