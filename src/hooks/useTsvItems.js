import { useEffect, useState } from 'react'
import base64DecodeUnicode from '../core/base64DecodeUnicode'
import { processHttpErrors, processUnknownError } from '../core/network'
import { core } from 'scripture-resources-rcl'

/**
 * hook for loading translation helps resources listed in content
 * @param {boolean} fetchMarkdown - flag that resource being fetched is in markdown
 * @param {string} languageId
 * @param {string} resourceId
 * @param {string} projectId
 * @param {string} chapter
 * @param {array} content - list of resources to load
 * @param {string} server
 * @param {string} owner
 * @param {string} verse
 * @param {function} onResourceError - optional callback if there is an error fetching resource, parameters returned are:
 *    ({string} errorMessage, {boolean} isAccessError, {object} resourceStatus)
 *      - isAccessError - is true if this was an error trying to access file
 *      - resourceStatus - is object containing details about problems fetching resource
 * @param {number} timeout - optional http timeout for fetching resources, default is 0 (very long wait)
 */
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
  onResourceError,
  timeout,
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

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
        (_items[0].SupportReference?.includes('rc://*/') ||
          _items[0].TWLink?.includes('rc://*/'))
      ) {
        const newItems = []
        let url

        if (fetchMarkdown) {
          setLoading(true)
          for (let i = 0; i < _items.length; i++) {
            const item = _items[i]
            const path =
              item.SupportReference || typeof item.SupportReference === 'string'
                ? item.SupportReference.replace('rc://*/', '')
                : item.TWLink.replace('rc://*/', '')
            const routes = path.split('/')
            const resource = routes[0]
            const newRoutes = routes.slice(2, routes.length)
            const filename = resource === 'ta' ? '/01.md' : '.md'
            const filePath = `${newRoutes.join('/')}${filename}`
            url = `${server}/api/v1/repos/${owner}/${languageId}_${resource}/contents/${filePath}`
            let markdown = ''
            if (path) { // only fetch data if we were able to get path for item
              try {
                const result = await core.doFetch(url, {}, timeout).then(response => {
                  const resourceDescr = `${languageId}_${resourceId}, ref '${item?.SupportReference}'`;
                  processHttpErrors(response, resourceDescr, url, onResourceError)
                  return response?.json()
                })
                markdown = base64DecodeUnicode(result.content)
              } catch (e) {
                console.warn(`useTsvItems(url) - article not found`, e)
                const resourceDescr = `${languageId}_${resourceId}, ref '${item?.SupportReference}'`;
                processUnknownError(e, resourceDescr, url, onResourceError)
              }
            }
            newItems.push({...item, markdown})
            item.markdown = markdown
          }
          _items = newItems
          setLoading(false)
        }
      }
      setItems(_items)
    }

    getTsvItems()
  }, [content])

  return { items, loading }
}
