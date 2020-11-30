# SettingsCard

Settings Card.

```jsx
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import useCardState from '../../hooks/useCardState.js'

const Component = () => {
  const [showMenu, setShowMenu] = useState(false)

  const {
    state: {
      headers,
      filters,
      fontSize,
      markdownView,
    },
    actions: {
      setFilters,
      setFontSize,
      setMarkdownView,
    }
  } = useCardState({
    items: [],
  })

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
        title={'Notes'}
        onRemoveCard={() => console.log('onRemoveCard')}
      />
    </div>
  )
}

<Component/>
```
