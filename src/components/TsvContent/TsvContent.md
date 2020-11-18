# TsvContent

Renders TSV data.

```jsx
import React, { useState } from 'react'
import Card from '../Card'
import useContent from '../../hooks/useContent.js'

function Component() {
  const [noteIndex, setNoteIndex] = useState(0)
  const { markdown, notes } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    branch: 'master',
    languageId: 'en',
    resourceId: 'tn',
    owner: 'unfoldingWord',
    server: 'https://git.door43.org',
  })
  const note = notes ? notes[noteIndex] : null

  if (note) {
    return (
      <Card
        notes={notes}
        noteIndex={noteIndex}
        title={<div>Notes</div>}
        setNoteIndex={setNoteIndex}
        onClose={() => console.log('closed')}
      >
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
      </Card>
    )
  } else {
    return null
  }
}

<Component />
```
