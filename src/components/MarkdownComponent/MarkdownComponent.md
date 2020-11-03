# MarkdownComponent

A Markdown file viewer and editor.

```jsx
import MarkdownComponent from "./MarkdownComponent";

<MarkdownComponent markdown={`
# Edit Markdown as HTML!<br><br>No *Frills* **Markdown** __WYSIWYG__.

## Sections and Blocks

- Markdown Heading Sections are split out only in the DocumentTranslatable component and render a SectionTranslatable component for each section.
- Markdown Blocks are split out only in the SectionTranslatable component and render a BlockTranslatable component for each block.
`} />
```
