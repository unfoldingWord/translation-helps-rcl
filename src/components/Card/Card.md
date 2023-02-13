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

  const onRenderGreeting = ({ items }) => {
    const [emoji,greeting,...rest] = items;
    return [
      greeting.toUpperCase(),
      " WORLD!",
      emoji,
      <span role="img" aria-label="world">
        🌎
      </span>,
      ...rest
    ];
  };

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

**Example:**

```js
import useCardState from '../../hooks/useCardState.js'
import Button from '@mui/material/Button'

const CustomToolbarButton = ({onClick}) => {
  return <Button variant="contained" onClick={onClick}>🔍 Custom Button</Button>
}

const CustomSettingComponent = () => {
  return (
    <label>
      <p>Custom setting</p>
      <input type="range" min="1" step="1" max="100" defaultValue="50"/>
    </label>
  );
}

const CustomCard = () => {

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
    items: []
  })

  //Example returning jsx
  const onRenderSettings = ({items}) => {
    const divider = items.find(item => item.key === "divider");
    return <><CustomSettingComponent/>{divider}{items}</>
  }

  //Example returning array
  const onRenderToolbar = ({items}) => [
    ...items,
    <CustomToolbarButton key="custom-button" onClick={ () => alert("Custom Toolbar Button clicked") }/>
  ]

  return (
    <Card
      onRenderToolbar={onRenderToolbar}
      onRenderSettings={onRenderSettings}
      //Other required props:
      alert
      headers={headers}
      filters={filters}
      title="Custom card"
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      onClose={() => console.log('closed')}
      onMenuClose={() => console.log('menu closed')}
      hideMarkdownToggle={false}
    >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </Card>
  )
}

<CustomCard/>
```

<small>
  Notes:
    1. Both **onRenderSettings** and **onRenderToolbar** callback functions can return either jsx or an array of children for their respective parents.
    2. Using filter, map, reduce array methods is adviced when manipulating the items array.
</small>
