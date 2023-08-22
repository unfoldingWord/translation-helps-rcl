import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthenticationContext, get } from 'gitea-react-toolkit'
import useEventListener from './useEventListener'
import {
  getResponseData,
  processHttpErrors,
  processUnknownError,
} from '../core/network'

/**
 * Custom hook that listens for link click events and if the link is a translation helps resource then fetches it.
 * @param {object} {
 *  owner,
 *  server,
 *  ref,
 *  taArticle,
 *  languageId,
 * }
 * @returns {Array} [
 *  {
 *    error,
 *    title,
 *    content,
 *    loading,
 *  },
 *  clearContent
 * ]
 */
export default function useResourceClickListener({
  ref,
  owner,
  server,
  branch,
  taArticle,
  languageId,
  httpConfig = {},
  onResourceError,
}) {
  const { state: authentication } = useContext(AuthenticationContext)
  const [link, setLink] = useState(null)
  const [linkHtml, setLinkHtml] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  // if ref not given, fall back to branch
  ref = ref || branch

  const handler = useCallback(
    e => {
      e.preventDefault()

      if (e?.target?.href) {
        setLinkHtml(e.target.outerHTML || null)
        setLink(e.target.href || null)
      }
    },
    [setLink]
  )

  useEventListener('click', handler)

  useEffect(() => {
    async function fetchContent() {
      if (link) {
        setTitle('')
        setLoading(true)
        let url = ''
        let titleUrl = ''

        try {
          const tw = ['/other/', '/kt/', '/names/']
          const slug = link.includes('http')
            ? new URL(link).pathname
            : link.replace('rc://*/', '').replace('rc://', '')
          const slugs = slug.split('/')
          let _languageId = ''
          let resourceId = ''
          let filePath = ''
          let title = ''
          let data = ''

          if (slugs.includes('obs')) {
            // slug = "rc://en/tn/help/obs/17/09"
            // slugs:["en", "tn", "help", "obs", "17", "06"]
            _languageId = slugs[0] || languageId
            resourceId = `${slugs[3]}`
            filePath = `${slugs[4]}.md#${slugs[5]}`
            const repoName = `${_languageId}_${resourceId}`
            // https://git.door43.org/unfoldingWord/en_obs/src/branch/master/content/45.md
            url = `${server}/api/v1/repos/${owner}/${repoName}/contents/content/${filePath}?ref=${ref}`
            title = `${repoName} ${filePath}`
          } else if (
            slugs.length === 5 &&
            slug.includes('/ta/man/') &&
            link.includes('rc:/')
          ) {
            // slug = "en/ta/man/translate/translate-names"
            _languageId = slugs[0] || languageId
            resourceId = slugs[1] || 'ta'
            filePath = encodeURI(`${slugs[3]}/${slugs[4]}`)
            url = `${server}/api/v1/repos/${owner}/${_languageId}_${resourceId}/contents/${filePath}/01.md?ref=${ref}`
            titleUrl = `${server}/api/v1/repos/${owner}/${_languageId}_${resourceId}/contents/${filePath}/title.md?ref=${ref}`
          } else if (slug.includes('01.md')) {
            _languageId = languageId
            resourceId = 'ta'
            filePath = `${taArticle?.projectId || 'translate'}/${slugs[1]}`
            url = `${server}/api/v1/repos/${owner}/${_languageId}_${resourceId}/contents/${filePath}/01.md?ref=${ref}`
            titleUrl = `${server}/api/v1/repos/${owner}/${_languageId}_${resourceId}/contents/${filePath}/title.md?ref=${ref}`
          } else if (tw.find(slugItem => slug.includes(slugItem))) {
            _languageId = languageId
            resourceId = 'tw'
            filePath = slug
            url = `${server}/api/v1/repos/${owner}/${_languageId}_${resourceId}/contents/bible${filePath}?ref=${ref}`
            title = slugs[2].replace('.md', '')
            title = title.charAt(0).toUpperCase() + title.slice(1)
          }

          const _config = {
            ...authentication.config,
            ...httpConfig,
          }

          if (url) {
            data = await get({
              url,
              params: {},
              config: _config,
              fullResponse: true,
            }).then(res => {
              const message = processHttpErrors(res, link, url, onResourceError)
              if (message) {
                console.warn(
                  `useResourceClickListener() url not found: ${url}: ${message}`
                )
                return null
              }
              return getResponseData(res)
            })
          }

          if (titleUrl) {
            title = await get({
              url: titleUrl,
              params: {},
              config: _config,
              fullResponse: true,
            }).then(res => {
              const message = processHttpErrors(
                res,
                link,
                titleUrl,
                onResourceError
              )
              if (message) {
                console.warn(
                  `useResourceClickListener() title url not found: ${titleUrl}: ${message}`
                )
                return null
              }
              return getResponseData(res)
            })
          }

          if (!url || !title) {
            console.warn(
              `useResourceClickListener() error parsing link: ${link} from embedded html: ${linkHtml}`
            )
            setError(true)
          }

          setContent(data)
          setTitle(title)
          setLoading(false)
        } catch (error) {
          clearContent()
          setError(true)
          const httpCode = error?.response?.status || 0
          console.error(
            `useResourceClickListener() httpCode ${httpCode}, error loading link: ${link} from embedded html: ${linkHtml}`,
            error
          )
          processUnknownError(
            error,
            link,
            `'${url} or ${titleUrl}'`,
            onResourceError
          )
        }
      }
    }
    fetchContent()
  }, [
    link,
    owner,
    server,
    branch,
    languageId,
    authentication?.config,
    taArticle?.projectId,
  ])

  function clearContent() {
    setLink(null)
    setTitle(null)
    setContent(null)
    setLoading(false)
    setError(false)
  }

  return [
    {
      error,
      title,
      content,
      loading,
    },
    clearContent,
  ]
}
