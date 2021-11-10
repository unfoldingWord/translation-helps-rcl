import React, { useState, useEffect } from 'react'
import { BlockEditable } from 'markdown-translatable'
import cleanMarkdownLineBreak from '../../core/cleanMarkdownLineBreak'

export default function TsvContent({
  item,
  fontSize,
  editable,
  onTsvEdit,
  markdownView,
}) {
  const [{ Question, Response }, setTqValue] = useState({
    Question: null,
    Response: null,
  })

  useEffect(() => {
    if (Question || Response) {
      const isOldTsvTq = item?.Annotation ? true : false
      const newItem = { ...item }

      if (Question && Response && isOldTsvTq) {
        newItem.Annotation = `${Question}> ${Response}`
      }

      if (Question && newItem.Question) {
        newItem.Question = Question
      }

      if (Response && newItem.Response) {
        newItem.Response = Response
      }

      // Edit TSV item
      onTsvEdit(newItem)
    }
  }, [Question, Response])

  const handleEdit = (field, edit) => {
    // Remove markdown that was added for view only
    let newEdit = edit?.replace('#', '')
    newEdit = cleanMarkdownLineBreak(edit)

    setTqValue(prevState => ({
      ...prevState,
      [field]: newEdit?.trim(),
    }))
  }

  let question, response

  if (item.Annotation) {
    const text = item.Annotation.replace('', '')
    const chunks = text.split('?')
    question = `${chunks[0]}?`
    response = chunks[1].split('> ')[1]
  } else {
    question = `# ${item.Question}`
    response = item.Response || ''
  }

  return (
    <div>
      <BlockEditable
        markdown={question}
        editable={editable}
        fontSize={fontSize}
        preview={!markdownView}
        onEdit={edit => handleEdit('Question', edit)}
        style={{ display: 'block', padding: '0px' }}
      />
      <BlockEditable
        markdown={response}
        editable={editable}
        fontSize={fontSize}
        preview={!markdownView}
        onEdit={edit => handleEdit('Response', edit)}
        style={{ display: 'block', padding: '0px' }}
      />
    </div>
  )
}
