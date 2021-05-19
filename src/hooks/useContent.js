import { useEffect, useState } from 'react'
import { useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'
import {
  CONTENT_NOT_FOUND_ERROR,
  ERROR_STATE, INITIALIZED_STATE,
  LOADING_STATE,
  MANIFEST_NOT_LOADED_ERROR,
} from '../common/constants'

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
  onResourceError,
}) => {
  const [initialized, setInitialized] = useState(false)

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
    state: { resource, content, loadingResource, loadingContent },
  } = useRsrc({
    resourceLink,
    reference,
    config,
  })

  const { items, loading: loadingTSV } = useTsvItems({
    fetchMarkdown,
    languageId,
    resourceId,
    projectId,
    content,
    chapter,
    server,
    owner,
    verse,
    onResourceError,
  })

  const contentNotFoundError = !content
  const manifestNotFoundError = !resource?.manifest
  const loading = loadingResource || loadingContent || loadingTSV
  const error = initialized && !loading && (contentNotFoundError || manifestNotFoundError)
  const resourceStatus = {
    [LOADING_STATE]: loading,
    [CONTENT_NOT_FOUND_ERROR]: contentNotFoundError,
    [MANIFEST_NOT_LOADED_ERROR]: manifestNotFoundError,
    [ERROR_STATE]: error,
    [INITIALIZED_STATE]: initialized,
  }

  useEffect(() => {
    if (!initialized) {
      if (loading) { // once first load has begun, we are initialized
        setInitialized(true)
      }
    }
  }, [loading])

  return {
    items,
    resource,
    markdown: Array.isArray(content) ? null : content,
    resourceStatus,
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
