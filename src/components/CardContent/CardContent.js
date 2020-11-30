import React from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import TsvContent from '../TsvContent'

const CardContent = ({
  item,
  filters,
  markdown,
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
  } else if (item && item.markdown) {
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
  } else if (item) {
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
}

CardContent.propTypes = {
  item: PropTypes.object,
  filters: PropTypes.array,
  markdown: PropTypes.string,
  fontSize: PropTypes.number,
  markdownView: PropTypes.bool,
}

export default CardContent
