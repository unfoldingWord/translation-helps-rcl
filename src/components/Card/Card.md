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
  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

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
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <p style={{ fontSize: fontSize ? `${fontSize}%` : 'inherit' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </Card>
  )
}

<Component/>
```

## Customizing settings card and Card toolbar

The content of the Card toolbar and the Card settings can be customized using the **onRenderSettings** and **onRenderToolbar** props.

**Examples:**

```js
const CustomToolbarButton = ({onClick}) => {
  return <button onClick={onClick}>Custom Toolbar Button</button>
}

const CustomSettingComponent = () => {
  return (
    <>
      <h4>Custom setting</h4>
      <input type="range" min="1" step="1" max="100" defaultValue="50"/>
    </>
  );
}

const CustomCard = () => {

  const onRenderSettings = ({items}) => {
    const slicedItems = items.slice(-1); //Slice or filter desired items.
    return <><CustomSettingComponent/>{slicedItems}</>//Example returning jsx
  }

  const onRenderToolbar = ({items}) => [
    ...items,
    <CustomToolbarButton onClick={ () => alert("Custom Toolbar Button clicked") }/>
  ] //Example returning array

  return (
    <Card
      title="Custom card"
      alert
      onRenderToolbar={onRenderToolbar}
      onRenderSettings={onRenderSettings}
      //...other required props
    >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </Card>
  )
}

<CustomCard/>
```

<small>*Note: Both **onRenderSettings** and **onRenderToolbar** callback functions can return either jsx or an array of children for their respective parents*</small>
