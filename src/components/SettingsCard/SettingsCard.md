# SettingsCard

Settings Card.

```jsx
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import useCardState from '../../hooks/useCardState.js'
import { makeStyles, withStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

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
    <ThemeProvider theme={theme} >
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
    </ThemeProvider>
  )
}

<Component/>
```
