# CardContent

Card Content component. Automagically detects MD or TSV content and renders it respectively.

## TSV Content Example

```jsx
import React, { useState } from 'react'
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const languageId = 'en'
  const { markdown, items } = useContent({
    verse: 1,
    chapter: 1,
    languageId,
    projectId: 'tit',
    branch: 'master',
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

  console.log({ fontSize })

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
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        languageId={languageId}
        markdownView={markdownView}
      />
    </Card>
  )
}

<Component/>
```

## Markdown Content Example

```jsx
import React, { useState } from 'react'
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const { markdown, items, props: { languageId } } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'bible',
    branch: 'master',
    languageId: 'en',
    resourceId: 'tw',
    owner: 'unfoldingWord',
    filePath: 'kt/jesus.md',
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
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        languageId={languageId}
        markdownView={markdownView}
      />
    </Card>
  )
}

<Component/>
```

## translationWords List (TWL) Content Example

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const { markdown, items, props: { languageId } } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    branch: 'master',
    languageId: 'en',
    resourceId: 'twl',
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
      {item ?
        <CardContent
          item={item}
          filters={filters}
          fontSize={fontSize}
          markdown={markdown}
          languageId={languageId}
          markdownView={markdownView}
        />
        :
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '45px' }}>
          <CircularProgress size={180}/>
        </div>
      }
    </Card>
  )
}

<Component/>
```
