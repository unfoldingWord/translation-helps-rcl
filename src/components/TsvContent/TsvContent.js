import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BlockEditable } from 'markdown-translatable'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px 0px 0px;
  margin: 7px 0px 0px;
`

const Fieldset = styled.fieldset`
  display: flex;
  flex-grow: 1;
  width: ${props => (props?.label === 'Annotation' ? '100%' : '33%')};
  flex-direction: column;
  padding: 0px;
  padding-bottom: 10px;
  padding-inline-end: 6px;
  padding-inline-start: 6px;
  margin: 0px;
  margin-bottom: 10px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.error ? '#FF1A1A' : props.caution ? '#FF8400' : 'transparent'};
`

const Legend = styled.legend`
  margin-bottom: 7px;
  padding-inline-start: ${props =>
    props.error || props.caution ? '2px' : '0px'};
  padding-inline-end: ${props =>
    props.error || props.caution ? '2px' : '0px'};
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
`

const Label = styled.label`
  margin-bottom: 7px;
  letter-spacing: 0.25px;
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
  font-weight: ${props => (props.bold ? 'bold' : 'inherit')};
  cursor: ${props => (props.clickable ? 'pointer' : 'inherit')};
`

const Item = ({
  label,
  value,
  error,
  fontSize,
  caution,
  setQuote,
  Occurrence,
  selectedQuote,
}) => {
  const selected = selectedQuote?.quote === value

  return (
    <Fragment>
      <Fieldset
        label={label}
        caution={caution}
        error={error}
        onClick={() => {
          if (setQuote && label === 'Quote' && !selected)
            setQuote({
              quote: value,
              occurrence: Occurrence,
            })
          else if (setQuote && selected) setQuote({})
        }}
      >
        <Legend
          error={error}
          color='#424242'
          caution={caution}
          fontSize={fontSize === 'inherit' ? '14px' : fontSize}
        >
          {label}
        </Legend>
        <Label
          color={selected ? '#38ADDF' : null}
          bold={selected}
          fontSize={fontSize}
          clickable={!!setQuote}
        >
          {value}
        </Label>
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

const TsvContent = ({
  item,
  filters,
  setQuote,
  markdownView,
  selectedQuote,
  fontSize: _fontSize,
}) => {
  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`
  const { Annotation, Occurrence } = item
  const AnnotationMarkdown = (
    <BlockEditable
      preview={!markdownView}
      markdown={Annotation}
      editable={false}
      style={{
        fontSize,
        padding: '0px',
        margin: markdownView ? '-10px 0px -16px' : '5px',
      }}
    />
  )

  const ordering = {
    Book: 10,
    Chapter: 9,
    Verse: 8,
    Reference: 7,
    ID: 6,
    Occurrence: 5,
    SupportReference: 4,
    Quote: 3,
    Tags: 2,
    Annotation: 1,
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
      {filters.map(label => {
        const value = label === 'Annotation' ? AnnotationMarkdown : item[label]
        return (
          <Item
            key={label}
            label={label}
            value={value}
            error={false}
            caution={false}
            fontSize={fontSize}
            setQuote={setQuote}
            Occurrence={Occurrence}
            selectedQuote={selectedQuote}
          />
        )
      })}
    </Container>
  )
}

TsvContent.defaultProps = {
  fontSize: 100,
}

TsvContent.propTypes = {
  item: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  markdownView: PropTypes.bool.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default TsvContent
