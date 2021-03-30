import React from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import TsvContent from '../TsvContent'
import TsvList from '../TsvList'
import CircularProgress from '../CircularProgress'

function removeBibleReferenceLinks(src) {
  // OBS tN: Convert all [<Title>](rc://<lang>/tn/help/obs/*) links to just show "Open Bible Stories - <Title>"
  src = src.replace(
    /\[([^\]]+)\]\(rc:\/\/[^/]+\/tn\/help\/obs[^)]+\)/g,
    'Open Bible Stories - $1'
  )
  // tN: Convert all [<Bible Ref>](rc://<lang>/tn/*) links to just show the <Bible ref> (no link)
  src = src.replace(/\[([^\]]+)\]\(rc:\/\/[^/]+\/tn\/[^)]+\)/g, '$1')

  return src
}

const CardContent = ({
  item,
  items,
  filters,
  markdown,
  viewMode,
  setQuote,
  isLoading,
  markdownView,
  errorMessage,
  selectedQuote,
  fontSize: _fontSize,
}) => {
  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`

  console.log({ markdown })

  markdown = removeBibleReferenceLinks(markdown)

  if (isLoading) {
    return <CircularProgress size={200} />
  } else if (errorMessage) {
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
          {errorMessage}
        </div>
      </div>
    )
  } else if (markdown && typeof markdown === 'string') {
    return (
      <BlockEditable
        preview={!markdownView}
        markdown={markdown}
        editable={false}
        style={{
          fontSize,
        }}
      />
    )
  } else if (item && item.markdown && viewMode === 'markdown') {
    console.log({ markdown: removeBibleReferenceLinks(item.markdown) })

    return (
      <BlockEditable
        preview={!markdownView}
        markdown={removeBibleReferenceLinks(item.markdown)}
        editable={false}
        style={{
          fontSize,
        }}
      />
    )
  } else if (item && viewMode === 'list') {
    return (
      <TsvList
        items={items}
        filters={filters}
        fontSize={fontSize}
        setQuote={setQuote}
        selectedQuote={selectedQuote}
      />
    )
  } else if (
    item &&
    viewMode === 'question' &&
    (item.Annotation || item.Question)
  ) {
    let question, answer

    if (item.Annotation) {
      const text = item.Annotation.replace('', '')
      const chunks = text.split('?')
      question = chunks[0]
      answer = chunks[1].split('> ')[1]
    } else {
      question = item.Question
      answer = item.Response || ''
    }

    const markdown = `# ${question}? \n\n${answer.trim()}`

    return (
      <BlockEditable
        preview={!markdownView}
        markdown={markdown}
        editable={false}
        style={{
          display: 'block',
          fontSize,
        }}
      />
    )
  } else if (
    (item && viewMode === 'default') ||
    (item && viewMode === 'table')
  ) {
    return (
      <TsvContent
        item={item}
        filters={filters}
        fontSize={_fontSize}
        markdownView={markdownView}
        setQuote={setQuote}
        selectedQuote={selectedQuote}
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
  isLoading: false,
  viewMode: 'default',
}

CardContent.propTypes = {
  item: PropTypes.object,
  items: PropTypes.array,
  filters: PropTypes.array,
  setQuote: PropTypes.func,
  isLoading: PropTypes.bool,
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
