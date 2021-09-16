import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import CircularProgress from '../CircularProgress'
import TsvContent from '../TsvContent'
import TsvList from '../TsvList'
import TqContent from '../TqContent'

const CardContent = ({
  id,
  item,
  items,
  onEdit,
  filters,
  markdown,
  viewMode,
  setQuote,
  editable,
  isLoading,
  onTsvEdit,
  markdownView,
  errorMessage,
  selectedQuote,
  updateTaDetails,
  fontSize: _fontSize,
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
        setQuote={setQuote}
        editable={editable}
        onTsvEdit={onTsvEdit}
        selectedQuote={selectedQuote}
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
        setQuote={setQuote}
        editable={editable}
        fontSize={_fontSize}
        onTsvEdit={onTsvEdit}
        markdownView={markdownView}
        selectedQuote={selectedQuote}
        updateTaDetails={updateTaDetails}
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

CardContent.defaultProps = {
  fontSize: 100,
  editable: false,
  isLoading: false,
  onEdit: () => {},
  viewMode: 'default',
}

CardContent.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object,
  items: PropTypes.array,
  onEdit: PropTypes.func,
  filters: PropTypes.array,
  setQuote: PropTypes.func,
  isLoading: PropTypes.bool,
  editable: PropTypes.bool,
  markdown: PropTypes.string,
  fontSize: PropTypes.number,
  markdownView: PropTypes.bool,
  errorMessage: PropTypes.string,
  selectedQuote: PropTypes.object,
  viewMode: PropTypes.oneOf([
    'default',
    'table',
    'list',
    'markdown',
    'question',
  ]),
}

export default CardContent
