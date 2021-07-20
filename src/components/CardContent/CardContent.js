import React from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import TsvContent from '../TsvContent'
import TsvList from '../TsvList'
import CircularProgress from '../CircularProgress'
import stripReferenceLinksFromMarkdown from '../../core/stripReferenceLinksFromMarkdown'

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
  markdownView,
  errorMessage,
  selectedQuote,
  fontSize: _fontSize,
}) => {
  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`

  markdown = stripReferenceLinksFromMarkdown(markdown)

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
        markdown={stripReferenceLinksFromMarkdown(item.markdown)}
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
        onEdit={onEdit}
        markdown={markdown}
        editable={editable}
        fontSize={fontSize}
        preview={!markdownView}
        style={{ display: 'block', padding: '0px' }}
      />
    )
  } else if (
    (item && viewMode === 'default') ||
    (item && viewMode === 'table')
  ) {
    console.log('filters', filters)
    return (
      <TsvContent
        id={id}
        item={item}
        onEdit={onEdit}
        filters={filters}
        setQuote={setQuote}
        editable={editable}
        fontSize={_fontSize}
        markdownView={markdownView}
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
