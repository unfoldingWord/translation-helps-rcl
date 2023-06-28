# ErrorDialog

## Usage

A dialog component used to:
  - Display an error message
  - Provide a link to an error message if applicable

**Basic Example:**

In the following example, change the _editableProps_ object to see how the
dialog changes based on the props given.

```jsx
import React, { useState } from 'react'

const Component = () => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)

  const editableProps = {
    content: <div>ERROR CONTENT</div>,
    isLoading: false,
    link: "https://unsplash.com/s/photos/puppy",
    linkTooltip: "Puppy Error",
    onClose: () => setIsErrorDialogOpen(false),
    open: isErrorDialogOpen,
    title: "ERROR",
  }

  return (
    <span>
      <button onClick={() => setIsErrorDialogOpen(true)}>Open Dialog</button>
      <ErrorDialog {...editableProps} />
    </span>
  )
}

<Component/>
```
