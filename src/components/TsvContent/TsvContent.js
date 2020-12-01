import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BlockEditable } from 'markdown-translatable'

const Container = styled.div`
  margin: 7px 0px 0px;
`

const Table = styled.table`
  width: 100%;
`

const TD = styled.td`
  align-items: center;
  padding-bottom: 10px;
`

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  padding: 0px;
  padding-inline-end: 6px;
  padding-inline-start: 6px;
  margin: 0px;
  margin-bottom: 2.5px;
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
`

const Item = ({ label, value, fontSize, caution, error }) => (
  <Fragment>
    <Fieldset caution={caution} error={error}>
      <Legend
        error={error}
        color='#424242'
        caution={caution}
        fontSize={fontSize === 'inherit' ? '14px' : fontSize}
      >
        {label}
      </Legend>
      <Label fontSize={fontSize}>{value}</Label>
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

const TsvContent = ({
  id,
  book,
  verse,
  chapter,
  glQuote,
  filters,
  occurrence,
  markdownView,
  originalQuote,
  occurrenceNote,
  supportReference,
  fontSize: _fontSize,
}) => {
  const fontSize = _fontSize === 100 ? 'inherit' : `${_fontSize}%`
  const OccurrenceNote = (
    <BlockEditable
      preview={markdownView}
      markdown={occurrenceNote}
      style={{
        fontSize,
        padding: '0px',
        margin: markdownView ? '-16px 0px -16px' : '5px',
      }}
    />
  )

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            {filters.includes('Book') && (
              <TD>
                <Item
                  label='Book'
                  value={book}
                  error={false}
                  caution={false}
                  fontSize={fontSize}
                />
              </TD>
            )}
            {filters.includes('Chapter') && (
              <TD>
                <Item
                  error={false}
                  caution={false}
                  label='Chapter'
                  value={chapter}
                  fontSize={fontSize}
                />
              </TD>
            )}
            {filters.includes('Verse') && (
              <TD>
                <Item
                  label='Verse'
                  value={verse}
                  error={false}
                  caution={false}
                  fontSize={fontSize}
                />
              </TD>
            )}
            {filters.includes('ID') && (
              <TD>
                <Item
                  label='ID'
                  value={id}
                  error={false}
                  caution={false}
                  fontSize={fontSize}
                />
              </TD>
            )}
          </tr>
          <tr>
            {filters.includes('SupportReference') && (
              <TD>
                <Item
                  error={false}
                  caution={false}
                  label='Support Reference'
                  value={supportReference}
                  fontSize={fontSize}
                />
              </TD>
            )}
            {filters.includes('Occurrence') && (
              <TD>
                <Item
                  error={false}
                  caution={false}
                  label='Occurrence'
                  value={occurrence}
                  fontSize={fontSize}
                />
              </TD>
            )}
          </tr>
        </tbody>
      </Table>
      <Table>
        <tbody>
          <tr>
            {filters.includes('OrigQuote') && (
              <TD>
                <Item
                  error={false}
                  caution={false}
                  label='Original Quote'
                  value={originalQuote}
                  fontSize={fontSize}
                />
              </TD>
            )}
          </tr>
          <tr>
            {filters.includes('GLQuote') && (
              <TD>
                <Item
                  error={false}
                  caution={false}
                  label='GL Quote'
                  value={glQuote}
                  fontSize={fontSize}
                />
              </TD>
            )}
          </tr>
          <tr>
            {filters.includes('OccurrenceNote') && (
              <TD>
                <Item
                  error={false}
                  caution={false}
                  label='Occurrence Note'
                  value={OccurrenceNote}
                  fontSize={fontSize}
                />
              </TD>
            )}
          </tr>
        </tbody>
      </Table>
    </Container>
  )
}

TsvContent.defaultProps = {
  fontSize: 100,
}

TsvContent.propTypes = {
  id: PropTypes.string.isRequired,
  book: PropTypes.string.isRequired,
  verse: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  chapter: PropTypes.string.isRequired,
  glQuote: PropTypes.string.isRequired,
  occurrence: PropTypes.string.isRequired,
  markdownView: PropTypes.bool.isRequired,
  originalQuote: PropTypes.string.isRequired,
  occurrenceNote: PropTypes.string.isRequired,
  supportReference: PropTypes.string.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default TsvContent
