# DraggableModal

Draggable Modal.

```jsx
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Card from '../Card'

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
        Open Draggable Modal Card
      </Button>
      <DraggableModal
        open={showModal}
        handleClose={handleClickClose}
      >
        <Card
          closeable
          title={'Draggable Modal'}
          onClose={handleClickClose}
          classes={{
            dragIndicator: 'draggable-dialog-title',
          }}
        >
          <div style={{ padding: '45px', fontWeight: 'bold' }}>
            Hello! You can drag me by holding on the drag icon.
          </div>
          <TextField label="TextField should not loose focus" type="url" value={value} onChange={onChangeHandler} />
        </Card>
      </DraggableModal>
    </div>
  )
}

<Component/>
```
