import { useEffect, useState, useMemo } from 'react'

export default function useMasterMergeProps({
  isLoading: _isLoading = false,
  useBranchMerger,
  reloadContent = null,
} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading);
  const [isErrorDialogOpen,setIsErrorDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const {
    state: { mergeStatus, loadingMerge }, actions: { mergeMasterBranch, checkMergeStatus, checkUpdateStatus }
  } = useBranchMerger;

  const loadingProps = { color: loadingMerge ? "primary" : "secondary" };

  useEffect(() => {
    setIsLoading(false);
    setIsMessageDialogOpen(false);
  }, [targetFileHook.state])

  // const { load: loadTargetFile } = targetFileHook.actions || {};
  // const { content: targetContent } = targetFileHook.state || {};

  // useEffect(() => {
  //   checkMergeStatus();
  // }, [targetContent,checkMergeStatus]);

  const  { conflict, mergeNeeded, error, message, pullRequest } = mergeStatus
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

  const onClick = () => {
    if (blocked | !pending) return setIsErrorDialogOpen(true)
    setIsMessageDialogOpen(true);
  }

  const onCloseErrorDialog = () => {
    setIsErrorDialogOpen(false)
  }

  const onCancel = () => {
    setIsMessageDialogOpen(false);
  }

  const onSubmit = (description) => {
    setIsLoading(true);
    mergeMasterBranch(description).then((response) => {
      if (response.success && response.message === "") {
        reloadContent && reloadContent()
        checkUpdateStatus()
      }
      else {
        setIsErrorDialogOpen(true);
        setIsLoading(false)
        setIsMessageDialogOpen(false);
      };
    })
  }

  return {
    isLoading: (isLoading | loadingMerge),
    onClick,
    onSubmit,
    onCancel,
    onCloseErrorDialog,
    isMessageDialogOpen,
    isErrorDialogOpen,
    dialogMessage,
    dialogTitle,
    dialogLink,
    dialogLinkTooltip,
    pending,
    blocked,
    loadingProps
  }
}
