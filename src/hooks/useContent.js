import { useEffect, useState } from 'react'
import { useRsrc } from 'scripture-resources-rcl'
import base64DecodeUnicode from '../core/base64DecodeUnicode'

function useTsvItems({
  languageId,
  projectId,
  chapter,
  content,
  server,
  owner,
  verse,
  fetchMarkdown = true,
}) {
  const [items, setItems] = useState([])
  useEffect(() => {
    async function getTsvItems() {
      const tsvItems = Array.isArray(content) ? content : []
      const tn = {}

      for (let index = 0; index < tsvItems.length; index++) {
        const note = tsvItems[index]
        const book = note.Book.toLowerCase() || 'list'

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
            const filePath = `${routes[routes.length - 3]}/${
              routes[routes.length - 2]
            }/${routes[routes.length - 1]}.md`
            const url = `${server}/api/v1/repos/${owner}/${languageId}_${resource}/contents/${filePath}`

            const result = await fetch(url).then(data => data.json())
            const markdown = base64DecodeUnicode(result.content)
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

const useContent = ({
  verse,
  owner,
  branch,
  server,
  chapter,
  filePath,
  projectId,
  languageId,
  resourceId,
  fetchMarkdown,
}) => {
  const reference = {
    verse,
    chapter,
    filePath,
    projectId,
  }
  const resourceLink = `${owner}/${languageId}/${resourceId}/${branch}`
  const config = {
    server,
    cache: {
      maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
    },
  }

  const {
    state: { resource, content },
  } = useRsrc({
    resourceLink,
    reference,
    config,
  })

  const items = useTsvItems({
    fetchMarkdown,
    languageId,
    projectId,
    content,
    chapter,
    server,
    owner,
    verse,
  })

  return {
    items,
    resource,
    markdown: Array.isArray(content) ? null : content,
    props: {
      verse,
      owner,
      branch,
      server,
      chapter,
      filePath,
      projectId,
      languageId,
      resourceId,
    },
  }
}

useContent.defaultProps = {
  verse: 1,
  chapter: 1,
  filePath: '',
  branch: 'master',
  fetchMarkdown: true,
}

export default useContent
