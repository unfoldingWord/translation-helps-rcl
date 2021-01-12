import React from 'react'
import PropTypes from 'prop-types'
import { BlockEditable } from 'markdown-translatable'
import TsvContent from '../TsvContent'
import TsvList from '../TsvList'
import CircularProgress from '../CircularProgress'

const CardContent = ({
  item,
  items,
  filters,
  markdown,
  viewMode,
  isLoading,
  markdownView,
  fontSize: _fontSize,
}) => {
  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`

  if (isLoading) {
    return <CircularProgress size={200} />
  } else if (markdown && typeof markdown === 'string') {
    return (
      <BlockEditable
        preview={markdownView}
        markdown={markdown}
        style={{
          fontSize,
        }}
        // onEdit={_markdown => onMarkdownChange(_markdown)}
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
        // onEdit={_markdown => onMarkdownChange(_markdown)}
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
        item={item}
        filters={filters}
        fontSize={_fontSize}
        markdownView={markdownView}
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
          Something went wrong or there's no content available.
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
  isLoading: PropTypes.bool,
  markdown: PropTypes.string,
  fontSize: PropTypes.number,
  markdownView: PropTypes.bool,
  viewMode: PropTypes.oneOf(['default', 'table', 'markdown']),
}

export default CardContent
