# CardContent

Card Content component. Automagically detects MD or TSV content and renders it respectively.

## TSV Content Example

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const [selectedQuote, setQuote] = useState({})
  const languageId = 'en'
  const { markdown, items, isLoading } = useContent({
    verse: 1,
    chapter: 1,
    languageId,
    projectId: 'tit',
    ref: 'master',
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
  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return (
    <Card
      items={items}
      title={'Notes'}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        isLoading={isLoading}
        languageId={languageId}
        markdownView={markdownView}
        selectedQuote={selectedQuote}
        setQuote={setQuote}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    </Card>
  )
}

<Component/>
```

## Markdown Content Example

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const { markdown, items, isLoading, props: { languageId } } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'bible',
    ref: 'master',
    languageId: 'en',
    resourceId: 'tw',
    owner: 'test_org',
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
  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return (
    <Card
      items={items}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      title={'Words'}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        isLoading={isLoading}
        languageId={languageId}
        markdownView={markdownView}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    </Card>
  )
}

<Component/>
```

## Translation Words List (TWL) Markdown View

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const { markdown, items, isLoading, props: { languageId } } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    ref: 'master',
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
  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return (
    <Card
      items={items}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      title={'Words'}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        viewMode={'markdown'}
        isLoading={isLoading}
        languageId={languageId}
        markdownView={markdownView}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    </Card>
  )
}

<Component/>
```

## Translation Words List (TWL) Table View

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const [selectedQuote, setQuote] = useState(null)
  const { markdown, items, isLoading, props: { languageId } } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    ref: 'master',
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
  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return (
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
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <CardContent
        item={item}
        viewMode='table'
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        isLoading={isLoading}
        languageId={languageId}
        markdownView={markdownView}
        selectedQuote={selectedQuote}
        setQuote={setQuote}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    </Card>
  )
}

<Component/>
```

## Translation Academy Example

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const { markdown, items, resource, isLoading, props: { languageId } } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'translate',
    ref: 'master',
    languageId: 'en',
    resourceId: 'ta',
    filePath: 'figs-123person/01.md',
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
  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return (
    <Card
      items={items}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      title={'Academy'}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        isLoading={isLoading}
        languageId={languageId}
        markdownView={markdownView}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    </Card>
  )
}

<Component/>
```

## Translation Questions Example

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
   const { markdown, items, resource, isLoading, props: { languageId } } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    ref: 'master',
    languageId: 'en',
    resourceId: 'tq',
    filePath: null,
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
  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return (
    <Card
      items={items}
      title={'translationQuestions'}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        viewMode='question'
        isLoading={isLoading}
        languageId={languageId}
        markdownView={markdownView}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    </Card>
  )
}

<Component/>
```
