import { useMemo, useState } from 'react'

/*
  TODO 547:
    This hook keeps track of the merge needed from master state and updates
    props that are needed for the UpdateBranchButton, ErrorDialog, & LinkChip.

    This hook is used for INDIVIDUAL resources (as opposed to gEdit app-level hooks)

    It also handles the call to update the user branch with changes from master
    whenever a user clicks the update button.
*/
export default function useContentUpdateProps({
  //TODO: isLoading is no longer used here, please remove
  isLoading: _isLoading = false,
  useBranchMerger,
  onUpdate = null
} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading);
  const [isErrorDialogOpen,setIsErrorDialogOpen] = useState(false);

  const {
    state: { updateStatus, loadingUpdate }, actions: { updateUserBranch }
  } = useBranchMerger;

  const loadingProps = { color: loadingUpdate ? "primary" : "secondary" };

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

  /*
    TODO 547:
      We are separating this into a function and exporting it so that it can
      be called by the application. This is important in gatewayEdit so that
      the header button can update all necessary cards.
  */
  const callUpdateUserBranch = async () => {
    setIsLoading(true);
    const response = await updateUserBranch()
    setIsLoading(false);
    if (response.success && response.message === "") {
      onUpdate?.()
    }
    else {
      setIsErrorDialogOpen(true);
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
