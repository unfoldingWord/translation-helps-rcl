# TsvContent

Renders TSV data.

```jsx
import React, { useState } from 'react'
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

function Component() {
  const [selectedQuote, setQuote] = useState({})
  const { markdown, items } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    branch: 'master',
    languageId: 'en',
    resourceId: 'tn',
    owner: 'test_org',
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

  if (item) {
    return (
      <Card
        items={items}
        headers={headers}
        filters={filters}
        fontSize={fontSize}
        itemIndex={itemIndex}
        setFilters={setFilters}
        title={'Notes'}
        setFontSize={setFontSize}
        setItemIndex={setItemIndex}
        markdownView={markdownView}
        setMarkdownView={setMarkdownView}
      >
        <TsvContent
          item={item}
          filters={filters}
          fontSize={fontSize}
          markdownView={markdownView}
          selectedQuote={selectedQuote}
          setQuote={setQuote}
        />
      </Card>
    )
  } else {
    return null
  }
}

<Component />
```
