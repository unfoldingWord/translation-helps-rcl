# CardContent

Card Content component. Automagically detects MD or TSV content and renders it respectively.

## TSV Content Example

```jsx
import useContent from '../../hooks/useContent.js'

const Component = () => {
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
  const note = notes ? notes[1] : null

  return (
    <CardContent note={note} markdown={markdown} />
  )
}

<Component/>
```

## Markdown Content Example

```jsx
import useContent from '../../hooks/useContent.js'

const Component = () => {
  const { markdown, notes } = useContent({
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
  const note = notes ? notes[1] : null

  return (
    <CardContent note={note} markdown={markdown}/>
  )
}

<Component/>
```
