# Merge Dialog
This is a dialog to 
Merge Dialog.

```jsx
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// import Card from '../Card'
import { mergeStatusData as mergeStatusForCards } from '../../../Data/mergeStatusData';


const Component = () => {
  const [showModal, setShowModal] = useState(false)
  const [value, setValue] = useState('')

  const handleClickClose = () => setShowModal(false)
  const handleClickOpen = () => setShowModal(true)

  const onChangeHandler = event => {
	  setValue(event.target.value)
  }
  return (
    <div>
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
    </div>
  )
}

<Component/>
```