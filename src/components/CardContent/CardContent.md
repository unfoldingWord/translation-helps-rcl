# CardContent

Card Content component. Automagically detects MD or TSV content and renders it respectively.

## TSV Content Example

```jsx
<CardContent
  verse={1}
  chapter={1}
  // filePath={''}
  projectId={'tit'}
  branch={'master'}
  languageId={'en'}
  resourceId={'tn'}
  owner={'unfoldingWord'}
  server={'https://git.door43.org'}
/>
```

## Markdown Content Example

```jsx
<CardContent
  verse={1}
  chapter={1}
  filePath={'kt/jesus.md'}
  projectId={'bible'}
  branch={'master'}
  languageId={'en'}
  resourceId={'tw'}
  owner={'unfoldingWord'}
  server={'https://git.door43.org'}
/>
```
