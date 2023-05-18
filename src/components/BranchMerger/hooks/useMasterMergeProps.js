import { useEffect, useState } from 'react'

export default function useMasterMergeProps({
  isLoading: _isLoading = false,
  isSaving = false,
  useBranchMerger,
} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading)

  const {
    state: { loadingMerge },
    actions: { mergeMasterBranch, checkMergeStatus, checkUpdateStatus },
  } = useBranchMerger

  useEffect(() => {
    if (isSaving & !isLoading) {
      setIsLoading(true)
    }
    if (!isSaving & isLoading) {
      // There is a race condition with server returning
      // a conflict while processing the last commit
      // the setTimeout tries to make sure we don't get a false conflict
      setTimeout(() => {
        checkMergeStatus().then(status => {
          if (status.conflict) checkMergeStatus()
        })
        setIsLoading(false)
      }, 1000)
    }
  }, [isSaving, isLoading, checkMergeStatus])

  const callMergeUserBranch = async description => {
    setIsLoading(true)
    mergeMasterBranch(description).then(response => {
      if (response.success && response.message === '') {
        checkUpdateStatus()
        return true
      } else {
        setIsLoading(false)
        return false
      }
    })
  }

  return {
    isLoading: isLoading || loadingMerge,
    callMergeUserBranch,
  }
}
