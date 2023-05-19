import { useEffect, useState } from 'react'
import {
  getResponseData,
  processHttpErrors,
  processUnknownError,
} from '../core/network'
import { get } from 'gitea-react-toolkit'
import { parseReferenceToList } from 'bible-reference-range'

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
        if (!note?.Reference) {
          continue
        }

        // parse the reference to see if this is a reference range
        let referenceList = parseReferenceToList(note?.Reference)
        const multiVerse = (referenceList?.length > 1) || referenceList?.[0]?.endVerse
        if (multiVerse) {
          note.rerenceRange = `${note.ID}_${note.Reference}` // save a unique tag for the reference range
        }

        // iterate through each verse covered and map to each chapter:verse in reference range
        for (const refChunk of referenceList || []) {
          const refs = []
          let { chapter, verse: _verse, endVerse } = refChunk
          endVerse = endVerse || _verse

          if (chapter > 0 && _verse > 0) {
            for (let verse = _verse; verse <= endVerse; verse++) {
              refs.push({chapter, verse})
            }
          } else {
            refs.push({chapter, verse: _verse})
          }

          for (const ref of refs) {
            const { chapter, verse } = ref

            if (
              tn[book] &&
              tn[book][chapter] &&
              tn[book][chapter][verse]
            ) {
              tn[book][chapter][verse].push(note)
            } else if (tn[book] && tn[book][chapter]) {
              tn[book][chapter][verse] = [note]
            } else if (tn[book]) {
              tn[book][chapter] = {}
              tn[book][chapter][verse] = [note]
            } else {
              tn[book] = {}
              tn[book][chapter] = {}
              tn[book][chapter][verse] = [note]
            }
          }
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
