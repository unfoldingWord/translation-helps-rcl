# CardContent

Card Content component. Automagically detects MD or TSV content and renders it respectively.

## TSV Content Example

```jsx
import React, { useState } from 'react'
import Card from '../Card'
import useContent from '../../hooks/useContent.js'

const Component = () => {
  const [noteIndex, setNoteIndex] = useState(0)
  const languageId = 'en'
  const { markdown, items } = useContent({
    verse: 1,
    chapter: 1,
    languageId,
    projectId: 'tit',
    branch: 'master',
    resourceId: 'tn',
    owner: 'unfoldingWord',
    server: 'https://git.door43.org',
  })
  const note = items ? items[noteIndex] : null

  return (
    <Card
      items={items}
      noteIndex={noteIndex}
      title={<div>Notes</div>}
      setNoteIndex={setNoteIndex}
    >
      <CardContent note={note} markdown={markdown} languageId={languageId} />
    </Card>
  )
}

<Component/>
```

## Markdown Content Example

```jsx
import React, { useState } from 'react'
import Card from '../Card'
import useContent from '../../hooks/useContent.js'

const Component = () => {
  const [noteIndex, setNoteIndex] = useState(0)
  const { markdown, items } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'bible',
    branch: 'master',
    languageId: 'en',
    resourceId: 'tw',
    owner: 'unfoldingWord',
    filePath: 'kt/jesus.md',
    server: 'https://git.door43.org',
  })
  const note = items ? items[noteIndex] : null

  return (
    <Card
      items={items}
      noteIndex={noteIndex}
      title={<div>Words</div>}
      setNoteIndex={setNoteIndex}
    >
      <CardContent note={note} markdown={markdown}/>
    </Card>
  )
}

<Component/>
```

## translationWords List (TWL) Content Example

```jsx
import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../Card'
import useContent from '../../hooks/useContent.js'

const Component = () => {
  const [noteIndex, setNoteIndex] = useState(0)
  const { markdown, items } = useContent({
    verse: 1,
    chapter: 1,
    projectId: 'tit',
    branch: 'master',
    languageId: 'en',
    resourceId: 'twl',
    owner: 'test_org',
    server: 'https://git.door43.org',
  })
  const note = items ? items[noteIndex] : null

  return (
    <Card
      items={items}
      noteIndex={noteIndex}
      title={<div>Words</div>}
      setNoteIndex={setNoteIndex}
    >
      {note ?
        <CardContent note={note} markdown={markdown}/>
        :
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '45px' }}>
          <CircularProgress size={180}/>
        </div>
      }
    </Card>
  )
}

<Component/>
```
