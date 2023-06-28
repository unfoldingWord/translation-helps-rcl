# MergeBranchButton

## Usage

A button component used to:
  - Trigger a merge of a local DCS user branch to the master branch
  - Show the loading status of the merge

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
    onClick: () => console.log("MERGING!"),
    pending: false,
    title: 'Merge Example'
  }

  return (
    <MergeBranchButton {...editableProps} />
  )
}

<Component/>
```
