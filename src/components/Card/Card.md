# Card

A Card Component.

```jsx
import React, { useState } from 'react'
import useCardState from '../../hooks/useCardState.js'

const hideMarkdownToggle = false; // set to true to hide markdown toggle
const dropDownConfig = { // set this to null to removed from settings card
  label: 'Version',
  options: [
    { url: '0', title: 'unfoldingWord® Literal Text v18' },
    { url: '1', title: 'unfoldingWord® Greek New Testament v0.17'},
    { url: '2', title: 'unfoldingWord® Simplified Text v18'}
  ],
  current: 1,
  allowUserInput: true,
  onChange: (title, index) => {
    console.log(`New selection index ${index}, title: `, title);
  },
  style: {marginTop: '16px', width: '500px'},
};

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
      hideMarkdownToggle={hideMarkdownToggle}
      dropDownConfig={dropDownConfig}
    >
      <p style={{ fontSize: fontSize ? `${fontSize}%` : 'inherit' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </Card>
  )
}

<Component/>
```
