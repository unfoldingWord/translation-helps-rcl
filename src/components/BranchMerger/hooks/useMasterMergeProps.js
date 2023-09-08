import { useState } from 'react'

export default function useMasterMergeProps({
  useBranchMerger,
  onMerge = null,
} = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    state: { loadingMerge },
    actions: { mergeMasterBranch, checkUpdateStatus },
  } = useBranchMerger

  const callMergeUserBranch = async description => {
    setIsLoading(true)
    const response = await mergeMasterBranch(description)
    setIsLoading(false)
    if (response.success && response.message === '') {
      onMerge?.()
      await checkUpdateStatus()
    }
    return response
  }

  return {
    isLoading: isLoading || loadingMerge,
    callMergeUserBranch,
  }
}
