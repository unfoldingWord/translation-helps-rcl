import { useEffect, useState } from 'react'
import {
  getResponseData,
  processHttpErrors,
  processUnknownError,
} from '../core/network'
import { get } from 'gitea-react-toolkit'
import { parseReferenceToList } from 'bible-reference-range'

/**
 * helper function to push item into a hierarcical bcv tree
 * */
const pushToBcvTree = (tree, book, ch, v, item) => {
  if (item) {
    if (book) {
      if (!tree[book]) tree[book] = {}
      if (ch) {
        if (!tree[book][ch]) tree[book][ch] = {}
        if (v) {
          if (!tree[book][ch][v]) tree[book][ch][v] = []
          tree[book][ch][v].push(item)
        }
      }
    }
  }
}

/**
 * helper function to push item into a hierarcical bcv tree
 * -> requirement:
 * item must have these fields: Book, Chapter and Verse
 * */
const pushNoteToBcvTree = (tree, note) => {
  if (note) {
    const book = note.Book
    if (book) {
      const ch = note.Chapter
      if (ch) {
        const v = note.Verse
        if (v) {
          pushToBcvTree(tree, book, ch, v, note)
        }
      }
    }
  }
}

/**
 * helper function to push item into a hierarcical bcv tree
 * based on reference chunks
 * -> requirements:
 * item must have this field specified: Book
 * each entry in the chunks array must have the following format:
 * {chapter, verse, endChapter, endVerse}
 * */
const pushToBcvTreeBasedOnChunks = (tree, chunks, item) => {
  if (item && chunks) {
    const book = item.Book
    if (book) {
      chunks.forEach(chunk => {
        // Skip verse ranges across chapters -> not yet implemented
        // TODO: lg - would first have to get bookData here
        if (!chunk.endChapter || chunk.endChapter === chunk.chapter) {
          const ch = chunk.chapter
          if (ch) {
            const itemCopy = { Chapter: ch, ...item }
            if (chunk.endVerse) {
              for (let i = chunk.verse; i <= chunk.endVerse; i++) {
                itemCopy.Verse = i
                pushToBcvTree(tree, book, ch, i, itemCopy)
              }
            } else if (chunk.verse) {
              itemCopy.Verse = chunk.verse
              pushToBcvTree(tree, book, ch, chunk.verse, itemCopy)
            }
          }
        }
      })
    }
  }
}

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
 * @param {string} ref - points to specific ref that could be a branch or tag
 * @param {string} verse
 * @param {function} onResourceError - optional callback if there is an error fetching resource, parameters returned are:
 *    ({string} errorMessage, {boolean} isAccessError, {object} resourceStatus, {Error} error)
 *      - isAccessError - is true if this was an error trying to access file
 *      - resourceStatus - is object containing details about problems fetching resource
 *      - error - Error object that has the specific error returned
 * @param {object} httpConfig - optional config settings for fetches (timeout, cache, etc.)
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
  ref: ref_ = 'master',
  verse,
  onResourceError,
  httpConfig = {},
}) {
  const [{ items, tsvs }, setState] = useState({
    items: [],
    tsvs: null,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getTsvItems() {
      const tsvItems = Array.isArray(content) ? content : []
      const tn = {}
      const book = projectId?.toLowerCase() || 'list'

      for (let index = 0; index < tsvItems.length; index++) {
        const note = tsvItems[index]
        const splitRef = note?.Reference?.split(':')
        const Chapter = splitRef ? splitRef[0] : null
        const Verse = splitRef ? splitRef[1] : null

        if (Chapter && Verse && book) {
          note.Chapter = Chapter
          note.Verse = Verse
          note.Book = book
        }

        if (
          Verse &&
          (Verse.includes('-') || Verse.includes(',') || Verse.includes(';'))
        ) {
          // remove the optional reference fields
          // and instead get these filled out
          // dynamically inside createBcvQueryBasedOnChunks
          delete note.Verse
          delete note.Chapter
          const referenceChunks = parseReferenceToList(note?.Reference)
          pushToBcvTreeBasedOnChunks(tn, referenceChunks, note)
        } else {
          pushNoteToBcvTree(tn, note)
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
            let filePath = `${newRoutes.join('/')}${filename}`
            url = `${server}/api/v1/repos/${owner}/${languageId}_${resource}/contents/${filePath}?ref=${ref_}`
            let markdown = ''
            let fetchResponse = null

            if (path) {
              // only fetch data if we were able to get path for item
              const ref = item?.SupportReference || item?.TWLink
              try {
                const result = await get({
                  url,
                  params: {},
                  config: httpConfig,
                  fullResponse: true,
                }).then(response => {
                  const resourceDescr = `${languageId}_${resourceId}, ref '${ref}'`
                  const message = processHttpErrors(
                    response,
                    resourceDescr,
                    url,
                    onResourceError
                  )
                  if (message) {
                    const httpCode = response?.status || 0
                    console.warn(
                      `useTsvItems(${url}) - httpCode ${httpCode}, article not found: ${message}`
                    )
                    return null
                  }
                  return response
                })
                fetchResponse = result
                markdown = getResponseData(result)
              } catch (e) {
                const httpCode = e?.response?.status || 0
                console.warn(
                  `useTsvItems(${url}) - httpCode ${httpCode}, article not found`,
                  e
                )
                const resourceDescr = `${languageId}_${resourceId}, ref '${ref}'`
                processUnknownError(e, resourceDescr, url, onResourceError)
              }
            }
            // Remove filePath value for ta and twl
            if (resource === 'ta' || resource === 'twl' || filePath === '.md') {
              filePath = ''
              fetchResponse = null
            }
            newItems.push({ ...item, markdown, fetchResponse, filePath })
            item.markdown = markdown
          }
          _items = newItems
          setLoading(false)
        }
      }
      setState({
        items: _items,
        tsvs: tn[book] || null,
      })
    }

    getTsvItems()
  }, [content])

  return { items, tsvs, loading }
}
