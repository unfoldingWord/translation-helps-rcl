# TsvTranslate

This component helps to dispaly the source and the target of translation notes. 

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
  markdown: sourceMarkdown, 
  items: sourceItems 
  } = useContent({
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



  let sourceItem = {};
  if(sourceItems && typeof itemIndex == 'number'){
    sourceItem = sourceItems[itemIndex];
  }

  if(item){
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
      <TsvTranslate
        item={item}
        sourceItem={sourceItem}
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
  }else{
    return null
  }
}

<Component/>

```