# UpdateBranchButton

## Usage

A button component used to:
  - Trigger a update of master DCS branch to a local user branch
  - Show the loading status of the update

**Basic Example:**

In the following example, change the _editableProps_ object to see how the
button changes based on the props given.

```jsx
import React, { useState } from 'react'

const Component = () => {
  const editableProps = {
    blocked: false,
    isLoading: false,
    loadingProps: { color: 'primary' },
    onClick: () => console.log("UPDATING!"),
    pending: false,
    title: 'Update Example'
  }

  return (
    <UpdateBranchButton {...editableProps} />
  )
}

<Component/>
```
