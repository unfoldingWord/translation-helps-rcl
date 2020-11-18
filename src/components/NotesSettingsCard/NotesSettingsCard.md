# NotesSettingsCard

Notes Settings Card.

```jsx
import React, { useState } from 'react'

const Component = () => {
  const headers = ['Book', 'Chapter', 'Verse', 'ID', 'Support Reference', 'Original Quote', 'Occurrence', 'Occurrence Note']
  const [filters, setFilters] = useState(headers);
  const [markdownView, setMarkdownView] = useState(false);
  const [fontSize, setFontSize] = useState(100)

  return (
    <NotesSettingsCard
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      setFilters={setFilters}
      setFontSize={setFontSize}
      markdownView={markdownView}
      onShowMarkdown={setMarkdownView}
      title={<div>Notes Settings</div>}
      onClose={() => console.log('onClose')}
      onRemoveCard={() => console.log('onRemoveCard')}
    />
  )
}

<Component/>
```
