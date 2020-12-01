# DraggableModal

Draggable Modal.

```jsx
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Card from '../Card'

const Component = () => {
  const [showModal, setShowModal] = useState(false)

  const handleClickClose = () => setShowModal(false)
  const handleClickOpen = () => setShowModal(true)

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
        </Card>
      </DraggableModal>
    </div>
  )
}

<Component/>
```
