import { useState } from 'react'

/*
  TODO 547:
    This hook maintains loading state for merging from user branch to master.

    This hook is used for INDIVIDUAL resources (as opposed to gEdit app-level hooks)

    It also provides the function to merge an individual user resource to master.
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

  const callMergeUserBranch = async description => {
    setIsLoading(true)
    const response = await mergeMasterBranch(description)
    setIsLoading(false)
    if (response.success && response.message === '') {
      onMerge?.()
      await checkUpdateStatus()
    } else {
      console.warn(`callMergeUserBranch() - mergeMasterBranch failed ${response.message}`)
    }
    return response
  }

  return {
    isLoading: isLoading || loadingMerge,
    callMergeUserBranch,
  }
}
