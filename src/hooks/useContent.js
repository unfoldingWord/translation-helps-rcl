import { useState, useEffect } from 'react'
import { useRsrc } from 'scripture-resources-rcl'
import tsvToJson from '../core/tsvToJson'

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
}) => {
  const [content, setContent] = useState('')

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

  const { state: resource, actions } = useRsrc({
    resourceLink,
    reference,
    config,
  })

  useEffect(async () => {
    async function getContent() {
      const file = await actions.getFile()
      setContent(file || '')
    }

    if (actions.getFile) {
      getContent()
    }
  })

  const isTSV = resource?.project?.path.includes('.tsv')

  // TODO: #5
  const notes = isTSV ? tsvToJson(content) : []
  const tn = {}

  notes.forEach(note => {
    const book = note.Book.toLowerCase()

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
  })

  const tsvItems =
    tn[projectId] && tn[projectId][chapter] && tn[projectId][chapter][verse]
      ? tn[projectId][chapter][verse]
      : null

  return {
    resource,
    notes: tsvItems,
    markdown: !isTSV ? content : null,
  }
}

useContent.defaultProps = {
  verse: 1,
  chapter: 1,
  filePath: '',
  branch: 'master',
}

export default useContent
