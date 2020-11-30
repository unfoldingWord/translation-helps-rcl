# TsvContent

Renders TSV data.

```jsx
import React, { useState } from 'react'
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

function Component() {
  const { markdown, items } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    branch: 'master',
    languageId: 'en',
    resourceId: 'tn',
    owner: 'unfoldingWord',
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
        title={<div>Notes</div>}
        setFontSize={setFontSize}
        setItemIndex={setItemIndex}
        markdownView={markdownView}
        setMarkdownView={setMarkdownView}
      >
        <TsvContent
          id={item.ID}
          book={item.Book}
          filters={filters}
          verse={item.Verse}
          fontSize={fontSize}
          chapter={item.Chapter}
          glQuote={item.GLQuote}
          markdownView={markdownView}
          occurrence={item.Occurrence}
          originalQuote={item.OrigQuote}
          occurrenceNote={item.OccurrenceNote}
          supportReference={item.SupportReference}
        />
      </Card>
    )
  } else {
    return null
  }
}

<Component />
```
