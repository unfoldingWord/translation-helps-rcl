import { useEffect, useState } from 'react'

export default function useMasterMergeProps({
  isLoading: _isLoading = false,
  useBranchMerger,
  content = null,
  reloadContent = null,
} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading)

  const {
    state: { loadingMerge },
    actions: { mergeMasterBranch, checkMergeStatus, checkUpdateStatus },
  } = useBranchMerger

  useEffect(() => {
    setIsLoading(false);
    checkMergeStatus();
  }, [content, checkMergeStatus])

  const callMergeUserBranch = async description => {
    setIsLoading(true)
    mergeMasterBranch(description).then(response => {
      if (response.success && response.message === '') {
        reloadContent?.()
        checkUpdateStatus()
        return response
      } else {
        setIsLoading(false)
        return response
      }
    })
  }

  return {
    isLoading: isLoading || loadingMerge,
    callMergeUserBranch,
  }
}
