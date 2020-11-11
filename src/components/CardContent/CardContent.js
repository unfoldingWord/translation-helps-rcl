import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRsrc } from 'scripture-resources-rcl'
import { BlockEditable } from 'markdown-translatable'

const CardContent = ({
  verse,
  bookId,
  branch,
  server,
  chapter,
  filePath,
  languageId,
  resourceId,
}) => {
  // const [preview, setPreview] = useState(false)
  const [content, setContent] = useState('')

  const reference = {
    verse,
    bookId,
    chapter,
    filePath,
  }
  const resourceLink = `unfoldingWord/${languageId}/${resourceId}/${branch}`
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

  const path = state?.project?.path.includes('tsv')
    ? state?.project?.path
    : null
  const fileType = path ? path.split('.').pop() : filePath.split('.').pop()

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
  } else {
    return <div>{content}</div>
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
  bookId: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
}

export default CardContent
