import React from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import TsvContent from '../TsvContent'

const CardContent = ({ markdown, note }) => {
  if (markdown && typeof markdown === 'string') {
    return (
      <BlockEditable
        preview={true}
        markdown={markdown}
        // onEdit={_markdown => {
        //   onMarkdownChange(_markdown)
        // }}
      />
    )
  } else if (note) {
    return (
      <TsvContent
        id={note.ID}
        book={note.Book}
        verse={note.Verse}
        chapter={note.Chapter}
        glQuote={note.GLQuote}
        occurrence={note.Occurrence}
        originalQuote={note.OrigQuote}
        occurrenceNote={note.OccurrenceNote}
        supportReference={note.SupportReference}
      />
    )
  } else {
    return <div></div>
  }
}

CardContent.propTypes = {
  note: PropTypes.object,
  markdown: PropTypes.string,
}

export default CardContent
