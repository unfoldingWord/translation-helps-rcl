# TsvList

TSV List view.

```jsx
import React, { useState } from 'react'
import Card from '../../components/Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const { markdown, items } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    branch: 'master',
    languageId: 'en',
    resourceId: 'twl',
    owner: 'test_org',
    fetchMarkdown: false,
    server: 'https://git.door43.org',
  })

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

  console.log({ items })

  return (
    <Card
      items={items}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      title={<div>Words</div>}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
    >
      <TsvList
        items={items}
        // headers={headers}
        filters={filters}
        fontSize={fontSize}
        markdownView={markdownView}
      />
    </Card>
  )
}

<Component/>
```
