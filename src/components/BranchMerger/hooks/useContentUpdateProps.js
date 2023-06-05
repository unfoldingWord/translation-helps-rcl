import { useEffect, useMemo, useState } from 'react'

export default function useContentUpdateProps({
  isLoading: _isLoading = false,
  isSaving = false,
  useBranchMerger,
  onUpdate = null
} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading);
  const [isErrorDialogOpen,setIsErrorDialogOpen] = useState(false);

  const {
    state: { updateStatus, loadingUpdate }, actions: { updateUserBranch, checkUpdateStatus, checkMergeStatus }
  } = useBranchMerger;

  const loadingProps = { color: loadingUpdate ? "primary" : "secondary" };

  useEffect(() => {
    if(isSaving & !isLoading) {
      setIsLoading(true);
    }
    if (!isSaving & isLoading) {
      checkUpdateStatus().then(() => {
        checkMergeStatus()
      });
      setIsLoading(false);
    }
  },[isSaving, checkUpdateStatus])

  const { conflict, mergeNeeded, error, message, pullRequest } = updateStatus
  const pending = mergeNeeded || conflict
  const blocked = conflict || error;

  const {message: dialogMessage, title: dialogTitle, link: dialogLink} = useMemo(() => {
    if (conflict) return {
      title: "Conflict Error",
      message: "It appears that someone has merged changes that conflict with your current merge request. Please contact your administrator.",
      link: pullRequest
    };
    if (error && message) return {
      title: "Error",
      message,
      link: pullRequest
    };
    if (error && !message) return {
      title: "Unknown error.",
      message: "Contact your administrator.",
      link: pullRequest
    };
    if (!mergeNeeded) return  {
      title: "Up-to-date",
      message: "Your content is already up-to-date",
      link: ""
    };
    return {
      title: "Unknown state.",
      message: "Contact your administrator.",
      link: pullRequest
    };
  }, [message, conflict, mergeNeeded, error, pullRequest])

  const dialogLinkTooltip = "Pull-Request URL"

  const onCloseErrorDialog = () => {
    setIsErrorDialogOpen(false)
  }

  const callUpdateUserBranch = async () => {
    setIsLoading(true);
    const response = await updateUserBranch()
    if (response.success && response.message === "") {
      onUpdate?.()
      setTimeout(async () => {
        const status = await checkUpdateStatus()
        if (status.conflict) {
          await checkUpdateStatus();
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      },1000)
    }
    else {
      setIsErrorDialogOpen(true);
      setIsLoading(false)
    };
  }

  const onClick = () => {
    if (blocked || !pending) return setIsErrorDialogOpen(true)
    callUpdateUserBranch()
  }

  return {
    isLoading: (isLoading || loadingUpdate),
    onClick,
    callUpdateUserBranch,
    isErrorDialogOpen,
    onCloseErrorDialog,
    dialogMessage,
    dialogTitle,
    dialogLink,
    dialogLinkTooltip,
    pending,
    blocked,
    loadingProps
  }
}
