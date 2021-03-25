# Card

A Card Component.

```jsx
import React, { useState } from 'react'
import useCardState from '../../hooks/useCardState.js'

const hideMarkdownToggle = false;
const TitleStyle = {
  fontFamily: 'Noto Sans',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#424242',
  letterSpacing: '0ch',
  lineHeight: '14px'
}

const title = 'Lorem Ipsum'

// set this to null to test settings title fallback
const settingsTitle = 'Cool card Settings'

// set this to null to disable remove card option
const onRemoveCard = () => {
  console.log(`Clicked card removal`);
}

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
      title={title}
      settingsTitle={settingsTitle}
      setMarkdownView={setMarkdownView}
      onClose={() => console.log('closed')}
      onMenuClose={() => console.log('menu closed')}
      onRemoveCard={onRemoveCard}
      hideMarkdownToggle={hideMarkdownToggle}
    >
      <p style={{ fontSize: fontSize ? `${fontSize}%` : 'inherit' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </Card>
  )
}

<Component/>
```
