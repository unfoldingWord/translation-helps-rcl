# Merge Dialog

Merge Dialog.

```jsx
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// import Card from '../Card'

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
        onCancel={handleClickClose}
        open={showModal}
        handleClose={handleClickClose}
      />
    </div>
  )
}

<Component/>
```