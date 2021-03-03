import { useRsrc } from 'scripture-resources-rcl'
import useTsvItems from './useTsvItems'

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
    resourceId,
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
