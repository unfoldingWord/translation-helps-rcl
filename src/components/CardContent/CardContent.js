import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRsrc } from 'scripture-resources-rcl'
import { BlockEditable } from 'markdown-translatable'
import TsvContent from '../TsvContent'
import tsvToJson from '../../core/tsvToJson'

const CardContent = ({
  verse,
  owner,
  branch,
  server,
  chapter,
  filePath,
  projectId,
  languageId,
  resourceId,
}) => {
  const [content, setContent] = useState('')

  const reference = {
    verse,
    chapter,
    filePath,
    projectId,
    bibleId: projectId
  }
  const resourceLink = `${owner}/${languageId}/${resourceId}/${branch}`
  const config = {
    server,
    cache: {
      maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
    },
  }

  const { state, actions } = useRsrc({
    resourceLink,
    reference,
    config,
  })

  useEffect(async () => {
    async function getContent() {
      const file = await actions.getFile()
      setContent(file || '')
    }

    if (actions.getFile) {
      getContent()
    }
  })

  console.log({ state })
  console.log({ content })

  const path = state?.project?.path.includes('tsv')
    ? state?.project?.path
    : null
  const fileType = path ? path.split('.').pop() : filePath.split('.').pop()

  const tsvs = tsvToJson(content);
  const tsvItem = tsvs.length ? tsvs[2] : null;

  console.log('tsvItem', tsvItem)


  if (fileType === 'md') {
    return (
      <BlockEditable
        markdown={content}
        preview={true}
        onEdit={_markdown => {
          onMarkdownChange(_markdown)
        }}
      />
    )
  } else if (tsvItem) {
    return (
      <TsvContent
        id={tsvItem.ID}
        book={tsvItem.Book}
        verse={tsvItem.Verse}
        chapter={tsvItem.Chapter}
        glQuote={tsvItem.GLQuote}
        occurrence={tsvItem.Occurrence}
        originalQuote={tsvItem.OrigQuote}
        occurrenceNote={tsvItem.OccurrenceNote}
        supportReference={tsvItem.SupportReference}
      />
    )
  } else {
    return <div></div>
  }
}

CardContent.defaultProps = {
  verse: 1,
  chapter: 1,
  filePath: '',
  branch: 'master',
}

CardContent.propTypes = {
  verse: PropTypes.number,
  branch: PropTypes.string,
  chapter: PropTypes.number,
  filePath: PropTypes.string,
  server: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
}

export default CardContent
