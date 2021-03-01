# TsvList

TSV List view.

```jsx
import React, { useState } from 'react'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const [selectedQuote, setQuote] = useState({})
  const { markdown, items, props: { languageId } } = useContent({
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

  console.log({item, items})

  return (
    <div style={{ display: 'flex' }}>
      <Card
        items={items}
        title={'Words'}
        headers={headers}
        filters={filters}
        fontSize={fontSize}
        itemIndex={itemIndex}
        setFilters={setFilters}
        setFontSize={setFontSize}
        setItemIndex={setItemIndex}
        markdownView={markdownView}
        setMarkdownView={setMarkdownView}
        disableFilters
        disableNavigation
        hideMarkdownToggle
      >
        <TsvList
          items={items}
          filters={filters}
          fontSize={fontSize}
          markdownView={markdownView}
          selectedQuote={selectedQuote}
          setQuote={setQuote}
        />
      </Card>
      <Card
        items={items}
        title={'Words'}
        headers={headers}
        filters={filters}
        fontSize={fontSize}
        itemIndex={itemIndex}
        setFilters={setFilters}
        setFontSize={setFontSize}
        setItemIndex={setItemIndex}
        markdownView={markdownView}
        setMarkdownView={setMarkdownView}
        disableFilters
        disableNavigation
        hideMarkdownToggle
      >
        <CardContent
          item={item}
          filters={filters}
          fontSize={fontSize}
          markdown={markdown}
          viewMode={'markdown'}
          languageId={languageId}
          markdownView={markdownView}
        />
      </Card>
    </div>
  )
}

<Component/>
```
