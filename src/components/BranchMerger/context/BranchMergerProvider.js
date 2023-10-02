import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const BranchMergerContext = createContext();
export const useBranchMergerContext = () => {
    return useContext(BranchMergerContext)
}

/*
  TODO 547:
    So I'm less familiar with this, but I think someone took out the app-level
    merge/update state and put it here. I think it should be in gateway edit.

    This handles app-level merge/update state. It provides function to get/set
    app level update/merge state.

    The getMergeFromMasterStatus & callMergeFromMaster functions are not used
    and need to be deleted. We also don't need to export setMergeStatusForCards

    mergeStatusForCards like:
     {
        [cardId: string like 'tn', 'tq', ...]: {
          mergeFromMaster: (see object in useBranchMerger),
          mergeToMaster: ^,
          mergeFromMasterToUserBranch: function
          mergeToMasterFromUserBranch: function
        }, ...
     }
*/
const BranchMergerProvider = ({ children }) => {

    const [mergeStatusForCards, setMergeStatusForCards] = useState({})

    function updateMergeState(
        cardId,
        mergeFromMaster,
        mergeToMaster,
        mergeFromMasterIntoUserBranch,
        mergeToMasterFromUserBranch,
    ) {
        console.log('updateMergeState', { cardId, mergeFromMaster, mergeToMaster })
        setMergeStatusForCards((oldMergeStatusForCards) => ({
            ...oldMergeStatusForCards,
            [cardId]: {
                mergeFromMaster,
                mergeToMaster,
                mergeFromMasterIntoUserBranch,
                mergeToMasterFromUserBranch,
            },
        }))
    }

    function getMergeFromMasterStatus(_mergeStatusForCards = mergeStatusForCards) {
        const cardIds = Object.keys(_mergeStatusForCards)
        let mergeConflict = false
        let mergeNeeded = false
        let foundMergeStatusCard = false

        for (const cardId of cardIds) {
            const { mergeFromMaster } = _mergeStatusForCards[cardId]

            if (mergeFromMaster && !mergeFromMaster.error) {
                foundMergeStatusCard = true

                if (mergeFromMaster.mergeNeeded) {
                    mergeNeeded = true
                }

                if (mergeFromMaster.conflict) {
                    mergeConflict = true
                }
            }
        }
        return {
            mergeConflict,
            mergeNeeded,
            foundMergeStatusCard,
        }
    }

    function callMergeFromMasterForCards(_mergeStatusForCards = mergeStatusForCards) {
        const cardIds = Object.keys(_mergeStatusForCards)

        for (const cardId of cardIds) {
            const { mergeFromMasterIntoUserBranch } = _mergeStatusForCards[cardId]
            mergeFromMasterIntoUserBranch && mergeFromMasterIntoUserBranch()
        }
    }

    const value = {
        state: {
            mergeStatusForCards
        },
        actions: {
            updateMergeState,
            setMergeStatusForCards,
            getMergeFromMasterStatus,
            callMergeFromMasterForCards,
        }
    }

    return (
        <BranchMergerContext.Provider value={value}>
            {children}
        </BranchMergerContext.Provider>
    );
};

BranchMergerProvider.propTypes = {
    children: PropTypes.element,
    server: PropTypes.string,
    owner: PropTypes.string,
    repo: PropTypes.string,
    userBranch: PropTypes.string,
    tokenid: PropTypes.string,
};

export default BranchMergerProvider;
