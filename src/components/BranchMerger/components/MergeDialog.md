# Merge Dialog

Merge Dialog.

```jsx
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// import Card from '../Card'
import BranchMergerProvider, { useBranchMergerContext } from '../context/BranchMergerProvider'

const mergeStatusForCards={
    "ult": {
        "mergeFromMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": "https://qa.door43.org/unfoldingWord/en_ult/pulls/3410"
        },
        "mergeToMaster": {
            "mergeNeeded": true,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": "https://qa.door43.org/unfoldingWord/en_ult/pulls/3410"
        }
    },
    "uhb": {
        "mergeFromMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": ""
        },
        "mergeToMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": ""
        }
    },
    "ust": {
        "mergeFromMaster": {
            "mergeNeeded": true,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": "https://qa.door43.org/unfoldingWord/en_ust/pulls/1359"
        },
        "mergeToMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": "https://qa.door43.org/unfoldingWord/en_ust/pulls/1359"
        }
    },
    "tn": {
        "mergeFromMaster": {
            "mergeNeeded": true,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": "https://qa.door43.org/unfoldingWord/en_tn/pulls/3329"
        },
        "mergeToMaster": {
            "mergeNeeded": true,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": false,
            "message": "",
            "pullRequest": "https://qa.door43.org/unfoldingWord/en_tn/pulls/3329"
        }
    },
    "ta": {
        "mergeFromMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        },
        "mergeToMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        }
    },
    "twl": {
        "mergeFromMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        },
        "mergeToMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        }
    },
    "tw": {
        "mergeFromMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        },
        "mergeToMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        }
    },
    "tq": {
        "mergeFromMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        },
        "mergeToMaster": {
            "mergeNeeded": false,
            "conflict": false,
            "success": false,
            "userBranchDeleted": false,
            "error": true,
            "message": "branch Jincypjose-tc-create-1 does not exist",
            "pullRequest": ""
        }
    }
}

const Component = () => {
  const [showModal, setShowModal] = useState(false)
  const [value, setValue] = useState('')

  const handleClickClose = () => setShowModal(false)
  const handleClickOpen = () => setShowModal(true)

  const onChangeHandler = event => {
	  setValue(event.target.value)
  }
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Merge Dialog
      </Button>
      <MergeDialog 
        mergeStatusForCards={mergeStatusForCards}
        onCancel={handleClickClose}
        open={showModal}
        handleClose={handleClickClose}
        onSubmit={(args) => console.log({args})}
      />
    </>
  )
}
<BranchMergerProvider>
<Component/>
</BranchMergerProvider>
```