import React from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import TsvContent from '../TsvContent'
import TsvList from '../TsvList'

const CardContent = ({
  item,
  items,
  filters,
  markdown,
  viewMode,
  markdownView,
  fontSize: _fontSize,
}) => {
  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`

  if (markdown && typeof markdown === 'string') {
    return (
      <BlockEditable
        preview={markdownView}
        markdown={markdown}
        style={{
          fontSize,
        }}
        // onEdit={_markdown => {
        //   onMarkdownChange(_markdown)
        // }}
      />
    )
  } else if (item && item.markdown && viewMode === 'markdown') {
    return (
      <BlockEditable
        preview={markdownView}
        markdown={item.markdown}
        style={{
          fontSize,
        }}
        // onEdit={_markdown => {
        //   onMarkdownChange(_markdown)
        // }}
      />
    )
  } else if (item && viewMode === 'list') {
    return <TsvList items={items} filters={filters} fontSize={fontSize} />
  } else if (
    (item && viewMode === 'default') ||
    (item && viewMode === 'table')
  ) {
    return (
      <TsvContent
        id={item.ID}
        book={item.Book}
        filters={filters}
        verse={item.Verse}
        fontSize={_fontSize}
        chapter={item.Chapter}
        glQuote={item.GLQuote}
        markdownView={markdownView}
        occurrence={item.Occurrence}
        originalQuote={item.OrigQuote}
        occurrenceNote={item.OccurrenceNote}
        supportReference={item.SupportReference}
      />
    )
  } else {
    return (
      <div style={{ textAlign: 'center', padding: '45px' }}>
        No Content Available.
      </div>
    )
  }
}

CardContent.defaultProps = {
  fontSize: 100,
  viewMode: 'default',
}

CardContent.propTypes = {
  item: PropTypes.object,
  items: PropTypes.array,
  filters: PropTypes.array,
  markdown: PropTypes.string,
  fontSize: PropTypes.number,
  markdownView: PropTypes.bool,
  viewMode: PropTypes.oneOf(['default', 'table', 'markdown']),
}

export default CardContent
