import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BlockEditable } from 'markdown-translatable'
import getNoteLabel from '../../core/getNoteLabel'

export default function TsvContent({
  id,
  item,
  filters,
  editable,
  setQuote,
  onTsvEdit,
  markdownView,
  selectedQuote,
  updateTaDetails,
  fontSize: _fontSize,
}) {
  const [updatedItem, setUpdatedItemState] = useState({
    quote: null,
    occurrence: null,
  })

  useEffect(() => {
    setUpdatedItemState({
      quote: null,
      occurrence: null,
    })
  }, [item])

  const setUpdatedItem = (label, value) => {
    setUpdatedItemState(prevState => ({
      ...prevState,
      [label]: value,
    }))
  }

  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`
  const { Occurrence, SupportReference } = item
  const ordering = {
    Book: 14,
    Chapter: 13,
    Verse: 12,
    Reference: 11,
    ID: 10,
    Occurrence: 9,
    SupportReference: 8,
    Quote: 7,
    Tags: 6,
    Note: 5,
    Annotation: 5,
    Question: 5,
    Annotation2: 4,
    Response: 4,
    OrigQuote: 3,
    GLQuote: 2,
    OccurrenceNote: 0,
  }

  filters = filters
    .sort((a, b) => {
      if (ordering[a] < ordering[b]) {
        return -1
      }
      if (ordering[a] > ordering[b]) {
        return 1
      }

      return ordering[a] - ordering[b]
    })
    .reverse()

  return (
    <Container>
      {filters.map((label, i) => {
        const value = item[label]

        return (
          <Item
            key={label + i}
            item={item}
            label={label}
            value={value}
            error={false}
            caution={false}
            fontSize={fontSize}
            setQuote={setQuote}
            editable={editable}
            onTsvEdit={onTsvEdit}
            Occurrence={Occurrence}
            updatedItem={updatedItem}
            valueId={`${id}_${label}`}
            markdownView={markdownView}
            selectedQuote={selectedQuote}
            setUpdatedItem={setUpdatedItem}
            updateTaDetails={updateTaDetails}
            SupportReference={SupportReference}
          />
        )
      })}
    </Container>
  )
}

const Item = ({
  item,
  label,
  value,
  error,
  valueId,
  caution,
  fontSize,
  setQuote,
  editable,
  onTsvEdit,
  Occurrence,
  updatedItem,
  markdownView,
  selectedQuote,
  setUpdatedItem,
  updateTaDetails,
  SupportReference,
}) => {
  const selected =
    selectedQuote?.quote === value ||
    (selectedQuote?.quote === updatedItem['quote'] &&
      label.toLowerCase() == 'quote')
  const editableFields = [
    'OccurrenceNumber',
    'SupportReference',
    'Original Quote',
    'OccurrenceNote',
    'Occurrence',
    'Annotation',
    'OrigQuote',
    'Quote',
    'Note',
  ]
  const isEditable = editable && editableFields.includes(label)
  const { Note, Annotation, OccurrenceNote } = item
  const rawMarkdown = Annotation || Note || OccurrenceNote
  const markdownLabel = getNoteLabel({ Annotation, Note, OccurrenceNote })
  const updatedLabel = label.toLowerCase().includes('quote')
    ? 'quote'
    : label.toLowerCase().includes('occurrence')
    ? 'occurrence'
    : label

  return (
    <Fragment>
      <Fieldset
        label={label}
        caution={caution}
        error={error}
        onClick={() => {
          if (
            setQuote &&
            (label === 'Quote' || label === 'OrigQuote') &&
            !selected
          )
            setQuote({
              quote: updatedItem['quote'] || value,
              occurrence: updatedItem['occurrence'] || Occurrence,
              SupportReference,
            })
          else if (setQuote && selected) setQuote(null)
        }}
      >
        <Legend
          error={error}
          label={label}
          color='#424242'
          caution={caution}
          fontSize={fontSize === 'inherit' ? '14px' : fontSize}
        >
          {label}
        </Legend>
        {label === 'Annotation' ||
        label === 'Note' ||
        label === 'OccurrenceNote' ? (
          <BlockEditable
            id={valueId}
            editable={isEditable}
            fontSize={fontSize}
            markdown={rawMarkdown}
            preview={!markdownView}
            style={{
              padding: '0px',
              margin: markdownView ? '10px 0px 0px' : '-5px 0px 0px',
            }}
            onEdit={markdown => onTsvEdit({ [markdownLabel]: markdown })}
          />
        ) : isEditable ? (
          <Input
            id={valueId}
            bold={selected}
            value={
              typeof updatedItem[updatedLabel] == 'string'
                ? updatedItem[updatedLabel]
                : value
            }
            fontSize={fontSize}
            onBlur={event => {
              if (typeof updatedItem[updatedLabel] == 'string') {
                onTsvEdit({ [label]: event.target.value })

                if (
                  setQuote &&
                  (updatedLabel == 'quote' || updatedLabel == 'occurrence')
                ) {
                  setQuote({
                    quote: updatedItem['quote'] || value,
                    occurrence: updatedItem['occurrence'] || Occurrence,
                    SupportReference,
                  })
                }
                if (label == 'SupportReference') {
                  updateTaDetails(event.target.value)
                }
              }
            }}
            onChange={e => setUpdatedItem(updatedLabel, e.target.value)}
            clickable={!!setQuote}
            color={selected ? '#38ADDF' : null}
          />
        ) : (
          <Label
            id={valueId}
            bold={selected}
            value={value}
            fontSize={fontSize}
            clickable={!!setQuote}
            color={selected ? '#38ADDF' : null}
          >
            {value}
          </Label>
        )}
      </Fieldset>
      {error ? (
        <Label fontSize={fontSize} style={{ padding: '5px 6px' }}>
          <span style={{ color: '#FF1A1A', marginTop: '10px' }}>
            Warning: Something is wrong
          </span>
        </Label>
      ) : (
        caution && (
          <Label fontSize={fontSize} style={{ padding: '5px 6px' }}>
            <span style={{ color: '#FF8400', marginTop: '10px' }}>
              Caution: Something is wrong
            </span>
          </Label>
        )
      )}
    </Fragment>
  )
}

TsvContent.defaultProps = {
  fontSize: 100,
  id: '',
}

TsvContent.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  markdownView: PropTypes.bool.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: 1.5rem;
  column-gap: 1rem;
  width: 100%;
  padding: 0px;
  margin: 7px 0px 0px;
`

const Fieldset = styled.fieldset`
  display: flex;
  word-break: break-word;
  width: 100%;
  grid-column: ${({ label }) =>
    label === 'Annotation' || label === 'Note' || label === 'OccurrenceNote'
      ? 'span 3 / span 3'
      : label === 'GLQuote'
      ? 'span 2 / span 2'
      : 'span 1 / span 1'};
  flex-direction: column;
  padding: 0px;
  padding-inline-end: 0px;
  padding-inline-start: 0px;
  margin: 0px;
  margin-bottom: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.error ? '#FF1A1A' : props.caution ? '#FF8400' : 'transparent'};
`

const Legend = styled.legend`
  margin-bottom: ${({ label }) =>
    label === 'Annotation' || label === 'Note' || label === 'OccurrenceNote'
      ? '0px'
      : '7px'};
  padding-inline-start: ${props =>
    props.error || props.caution ? '2px' : '0px'};
  padding-inline-end: ${props =>
    props.error || props.caution ? '2px' : '0px'};
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
`

const Label = styled.label`
  letter-spacing: 0.25px;
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
  font-weight: ${props => (props.bold ? 'bold' : 'inherit')};
  cursor: ${props => (props.clickable ? 'pointer' : 'inherit')};
  &:focus-visible {
    outline: #38addf auto 1px;
  }
`

const Input = styled.input`
  border: none;
  letter-spacing: 0.25px;
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
  font-weight: ${props => (props.bold ? 'bold' : 'inherit')};
  &:focus-visible {
    outline: #38addf auto 1px;
  }
`
