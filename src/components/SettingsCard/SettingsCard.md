# SettingsCard

Settings Card.

```jsx
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'

const Component = () => {
  const headers = ['Book', 'Chapter', 'Verse', 'ID', 'Support Reference', 'Original Quote', 'Occurrence', 'Occurrence Note']
  const [filters, setFilters] = useState(headers);
  const [showMenu, setShowMenu] = useState(false)
  const [markdownView, setMarkdownView] = useState(false);
  const [fontSize, setFontSize] = useState(100)

  const handleClickClose = () => setShowMenu(false)
  const handleClickOpen = () => setShowMenu(true)

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open Notes Settings
      </Button>
      <SettingsCard
        open={showMenu}
        headers={headers}
        filters={filters}
        fontSize={fontSize}
        setFilters={setFilters}
        setFontSize={setFontSize}
        onClose={handleClickClose}
        markdownView={markdownView}
        onShowMarkdown={setMarkdownView}
        title={<div>Notes Settings</div>}
        onRemoveCard={() => console.log('onRemoveCard')}
      />
    </div>
  )
}

<Component/>
```
