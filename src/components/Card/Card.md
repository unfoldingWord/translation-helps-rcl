# Card

A Card Component.

```jsx
import React, { useState } from 'react'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const items = [];
  const {
    state: {
      item,
      headers,
      filters,
      fontSize,
      itemIndex,
      markdownView,
    },
    actions: {
      setFilters,
      setFontSize,
      setItemIndex,
      setMarkdownView,
    }
  } = useCardState({
    items,
  })

  return (
    <Card
      alert
      items={[1, 2, 3]}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      title={'Lorem Ipsum'}
      setMarkdownView={setMarkdownView}
      onClose={() => console.log('closed')}
    >
      <p style={{ fontSize: fontSize ? `${fontSize}%` : 'inherit' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </Card>
  )
}

<Component/>
```
