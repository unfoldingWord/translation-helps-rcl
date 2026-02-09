import React from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import CircularProgress from '../CircularProgress'
import TsvContent from '../TsvContent'
import TsvList from '../TsvList'
import TqContent from '../TqContent'

const CardContent = ({
   cardResourceId,
   editable = false,
   errorMessage,
   filters,
   fontSize: _fontSize = 100,
   id,
   item,
   isLoading = false,
   items,
   markdown,
   markdownView,
   onEdit = () => {},
   onTsvEdit,
   selectedQuote,
   setContent,
   setCurrentCheck,
   setItemIndex,
   shouldDisableClick,
   showSaveChangesPrompt,
   twlActionButtons,
   updateTaDetails,
   viewMode = 'default',
}) => {
  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`

  if (isLoading) {
    return <CircularProgress size={200} />
  } else if (errorMessage) {
    return (
      <div style={{ fontSize: '1.3rem', height: '100%', width: '100%' }}>
        <p
          style={{
            fontSize,
            height: '100%',
            display: 'grid',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            wordBreak: 'break-word',
          }}
        >
          {errorMessage}
        </p>
      </div>
    )
  } else if (markdown && typeof markdown === 'string') {
    return (
      <BlockEditable
        onEdit={onEdit}
        editable={editable}
        markdown={markdown}
        fontSize={fontSize}
        preview={!markdownView}
        style={{ padding: '0px' }}
      />
    )
  } else if (item && item.markdown && viewMode === 'markdown') {
    return (
      <BlockEditable
        onEdit={onEdit}
        editable={editable}
        fontSize={fontSize}
        preview={!markdownView}
        style={{ padding: '0px' }}
        markdown={item.markdown}
      />
    )
  } else if (item && viewMode === 'list') {
    return (
      <TsvList
        items={items}
        filters={filters}
        fontSize={fontSize}
        setCurrentCheck={setCurrentCheck}
        editable={editable}
        onTsvEdit={onTsvEdit}
        renderedActionButtons={twlActionButtons}
        setContent={setContent}
        setItemIndex={setItemIndex}
        selectedQuote={selectedQuote}
        showSaveChangesPrompt={showSaveChangesPrompt}
        shouldDisableClick={shouldDisableClick}
      />
    )
  } else if (
    item &&
    viewMode === 'question' &&
    (item.Annotation || item.Question)
  ) {
    return (
      <TqContent
        item={item}
        fontSize={fontSize}
        editable={editable}
        onTsvEdit={onTsvEdit}
        markdownView={markdownView}
      />
    )
  } else if (
    (item && viewMode === 'default') ||
    (item && viewMode === 'table')
  ) {
    return (
      <TsvContent
        id={id}
        item={item}
        filters={filters}
        setCurrentCheck={setCurrentCheck}
        editable={editable}
        fontSize={_fontSize}
        onTsvEdit={onTsvEdit}
        setContent={setContent}
        markdownView={markdownView}
        selectedQuote={selectedQuote}
        cardResourceId={cardResourceId}
        updateTaDetails={updateTaDetails}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    )
  } else {
    return (
      <div style={{ fontSize: '1.3rem', height: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '35px 0px',
            fontWeight: 'bold',
            height: '100%',
            fontSize,
          }}
        >
          No content available.
        </div>
      </div>
    )
  }
}

CardContent.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object,
  items: PropTypes.array,
  onEdit: PropTypes.func,
  filters: PropTypes.array,
  setCurrentCheck: PropTypes.func,
  isLoading: PropTypes.bool,
  editable: PropTypes.bool,
  markdown: PropTypes.string,
  fontSize: PropTypes.number,
  markdownView: PropTypes.bool,
  errorMessage: PropTypes.string,
  selectedQuote: PropTypes.object,
  shouldDisableClick: PropTypes.bool,
  setItemIndex: PropTypes.func,
  viewMode: PropTypes.oneOf([
    'default',
    'table',
    'list',
    'markdown',
    'question',
  ]),
}

export default CardContent
