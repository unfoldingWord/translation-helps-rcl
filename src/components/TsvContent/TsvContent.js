import React from 'react'
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

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  margin-bottom: 7px;
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
`

const Item = ({ label, value, fontSize }) => (
  <ItemContainer>
    <Label
      color='#424242'
      fontSize={fontSize === 'inherit' ? '14px' : fontSize}
    >
      {label}
    </Label>
    <Label fontSize={fontSize}>{value}</Label>
  </ItemContainer>
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
                <Item label='Book' value={book} fontSize={fontSize} />
              </TD>
            )}
            {filters.includes('Chapter') && (
              <TD>
                <Item label='Chapter' value={chapter} fontSize={fontSize} />
              </TD>
            )}
            {filters.includes('Verse') && (
              <TD>
                <Item label='Verse' value={verse} fontSize={fontSize} />
              </TD>
            )}
            {filters.includes('ID') && (
              <TD>
                <Item label='ID' value={id} fontSize={fontSize} />
              </TD>
            )}
          </tr>
          <tr>
            {filters.includes('SupportReference') && (
              <TD>
                <Item
                  label='Support Reference'
                  value={supportReference}
                  fontSize={fontSize}
                />
              </TD>
            )}
            {filters.includes('Occurrence') && (
              <TD>
                <Item
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
                <Item label='GL Quote' value={glQuote} fontSize={fontSize} />
              </TD>
            )}
          </tr>
          <tr>
            {filters.includes('OccurrenceNote') && (
              <TD>
                <Item
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
