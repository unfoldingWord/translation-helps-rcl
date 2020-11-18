import React from 'react'
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

const Item = ({ label, value }) => (
  <ItemContainer>
    <Label color='#424242' fontSize='14px'>
      {label}
    </Label>
    <Label>{value}</Label>
  </ItemContainer>
)

const TsvContent = ({
  id,
  book,
  verse,
  chapter,
  glQuote,
  occurrence,
  originalQuote,
  occurrenceNote,
  supportReference,
}) => {
  const OccurrenceNote = (
    <BlockEditable
      markdown={occurrenceNote}
      preview={true}
      style={{ padding: '0px', margin: '-16px 0px -16px' }}
    />
  )

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            <TD>
              <Item label='Book' value={book} />
            </TD>
            <TD>
              <Item label='Chapter' value={chapter} />
            </TD>
            <TD>
              <Item label='Verse' value={verse} />
            </TD>
            <TD>
              <Item label='ID' value={id} />
            </TD>
          </tr>
          <tr>
            <TD>
              <Item label='Support Reference' value={supportReference} />
            </TD>
            <TD>
              <Item label='Occurrence' value={occurrence} />
            </TD>
          </tr>
        </tbody>
      </Table>
      <Table>
        <tbody>
          <tr>
            <TD>
              <Item label='Original Quote' value={originalQuote} />
            </TD>
          </tr>
          <tr>
            <TD>
              <Item label='GL Quote' value={glQuote} />
            </TD>
          </tr>
          <tr>
            <TD>
              <Item label='Occurrence Note' value={OccurrenceNote} />
            </TD>
          </tr>
        </tbody>
      </Table>
    </Container>
  )
}

export default TsvContent
