import { useState } from 'react'

export default function useMasterMergeProps({
  useBranchMerger,
  onMerge = null,
} = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    state: { loadingMerge },
    actions: { mergeMasterBranch, checkMergeStatus, checkUpdateStatus },
  } = useBranchMerger

  const callMergeUserBranch = async description => {
    setIsLoading(true)
    const response = await mergeMasterBranch(description)
    if (response.success && response.message === '') {
      onMerge?.()
      await checkMergeStatus()
      await checkUpdateStatus()
      setIsLoading(false)
      return response
    } else {
      setIsLoading(false)
      return response
    }
  }

  return {
    isLoading: isLoading || loadingMerge,
    callMergeUserBranch,
  }
}
