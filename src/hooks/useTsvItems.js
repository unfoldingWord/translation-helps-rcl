import { useEffect, useState } from 'react'
import base64DecodeUnicode from '../core/base64DecodeUnicode'

export default function useTsvItems({
  fetchMarkdown = true,
  languageId,
  resourceId,
  projectId,
  chapter,
  content,
  server,
  owner,
  verse,
}) {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function getTsvItems() {
      const tsvItems = Array.isArray(content) ? content : []
      const tn = {}

      for (let index = 0; index < tsvItems.length; index++) {
        const note = tsvItems[index]
        const referenceChunks = note?.Reference?.split(':')
        const Chapter = referenceChunks ? referenceChunks[0] : null
        const Verse = referenceChunks ? referenceChunks[1] : null
        const book = projectId.toLowerCase() || 'list'

        if (Chapter && Verse && book) {
          note.Chapter = Chapter
          note.Verse = Verse
          note.Book = book
        }

        if (
          tn[book] &&
          tn[book][note.Chapter] &&
          tn[book][note.Chapter][note.Verse]
        ) {
          tn[book][note.Chapter][note.Verse].push(note)
        } else if (tn[book] && tn[book][note.Chapter]) {
          tn[book][note.Chapter][note.Verse] = [note]
        } else if (tn[book]) {
          tn[book][note.Chapter] = {}
          tn[book][note.Chapter][note.Verse] = [note]
        } else {
          tn[book] = {}
          tn[book][note.Chapter] = {}
          tn[book][note.Chapter][note.Verse] = [note]
        }
      }

      let _items =
        tn[projectId] && tn[projectId][chapter] && tn[projectId][chapter][verse]
          ? tn[projectId][chapter][verse]
          : null

      if (
        _items &&
        Array.isArray(_items) &&
        _items[0].SupportReference?.includes('rc://*/')
      ) {
        const newItems = []

        if (fetchMarkdown) {
          for (let i = 0; i < _items.length; i++) {
            const item = _items[i]
            const path = item.SupportReference.replace('rc://*/', '')
            const routes = path.split('/')
            const resource = routes[0]
            const newRoutes = routes.slice(2, routes.length)
            const filename = resource === 'ta' ? '/01.md' : '.md'
            const filePath = `${newRoutes.join('/')}${filename}`
            const url = `${server}/api/v1/repos/${owner}/${languageId}_${resource}/contents/${filePath}`
            let markdown = ''
            try {
              const result = await fetch(url).then(data => data.json())
              markdown = base64DecodeUnicode(result.content)
            } catch (e) {
              console.warn(`useTsvItems(url) - article not found`, e)
            }
            newItems.push({ ...item, markdown })
            item.markdown = markdown
          }
          _items = newItems
        }
      }
      setItems(_items)
    }

    getTsvItems()
  }, [content])

  return items
}
