import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  overflow: auto;
`

const Table = styled.table`
  border-spacing: 0.5rem;
  padding: 0.3rem 0.2rem 1rem;
  width: 100%;
`
const Input = styled.input`
  width: 80px;
  border: none;
  letter-spacing: 0.25px;
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
  font-weight: ${props => (props.bold ? 'bold' : 'inherit')};
  &:focus-visible {
    outline: #38addf auto 1px;
  }
`
export default function TsvList({
  items,
  filters,
  fontSize,
  setQuote,
  editable,
  onTsvEdit,
  selectedQuote,
}) {
  let filteredItems = []
  fontSize = typeof fontSize === 'number' ? `${fontSize}%` : fontSize

  if (items) {
    filters = ['Translation Word', 'Original Quote', 'Occurrence', 'GL Quote']
    filteredItems = items.map(
      ({ SupportReference, TWLink, Quote, OrigWords, Occurrence, glQuote }) => {
        const directories = (SupportReference || TWLink || '').split('/')
        const value = directories[directories.length - 1]

        return {
          SupportReference: value,
          Quote: Quote || OrigWords,
          Occurrence,
          glQuote: glQuote || '',
        }
      }
    )
  }

  return (
    <Container>
      <Table>
        <thead style={{ fontSize, paddingBottom: '1rem' }}>
          <tr style={{ textAlign: 'left' }}>
            {filters.map((header, i) => (
              <th
                key={header + i}
                style={{
                  padding: '0.2rem 0rem',
                  lineHeight: '1.5rem',
                  borderBottom: '2px solid lightgrey',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontSize }}>
          {filteredItems &&
            filteredItems.map((item, i) => {
              let {
                Quote,
                TWLink,
                OrigWords,
                Occurrence,
                SupportReference,
              } = item
              Quote = Quote || OrigWords
              SupportReference = SupportReference || TWLink
              const style = { cursor: setQuote ? 'pointer' : '' }

              return (
                <Row
                  key={i}
                  rowKey={i}
                  item={item}
                  style={style}
                  items={items}
                  Quote={Quote}
                  editable={editable}
                  fontSize={fontSize}
                  setQuote={setQuote}
                  onTsvEdit={onTsvEdit}
                  Occurrence={Occurrence}
                  selectedQuote={selectedQuote}
                  SupportReference={SupportReference}
                />
              )
            })}
        </tbody>
      </Table>
    </Container>
  )
}

TsvList.defaultProps = {
  fontSize: 100,
}

TsvList.propTypes = {
  items: PropTypes.array,
  setQuote: PropTypes.func,
  selectedQuote: PropTypes.object,
  filters: PropTypes.array.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

function Row({
  item,
  style,
  items,
  Quote,
  rowKey,
  editable,
  fontSize,
  setQuote,
  onTsvEdit,
  Occurrence,
  selectedQuote,
  SupportReference,
}) {
  const [newQuote, setNewQuote] = useState(null)
  let selected = false

  if (
    (Quote &&
      Occurrence &&
      selectedQuote?.quote === Quote &&
      selectedQuote?.occurrence === Occurrence) ||
    (newQuote &&
      selectedQuote?.quote === newQuote?.quote &&
      selectedQuote?.occurrence === newQuote?.occurrence)
  ) {
    selected = true
    style.color = '#38ADDF'
    style.fontWeight = 'bold'
  }

  return (
    <tr
      key={rowKey}
      style={style}
      onClick={() => {
        if (setQuote && !selected) {
          if (newQuote) {
            setQuote(newQuote)
          } else {
            setQuote({
              quote: item.Quote,
              occurrence: item.Occurrence,
              SupportReference,
            })
          }
        } else if (setQuote && selected) {
          setQuote({})
        }
      }}
    >
      {Object.keys(item).map(key => {
        if (editable && (key == 'Quote' || key == 'Occurrence')) {
          return (
            <EditableItem
              key={key}
              item={item}
              itemIndex={rowKey}
              valueKey={key}
              tsvItem={items[rowKey]}
              fontSize={fontSize}
              selected={selected}
              setQuote={setQuote}
              onTsvEdit={onTsvEdit}
              setNewQuote={setNewQuote}
              SupportReference={SupportReference}
            />
          )
        } else {
          return (
            <td
              key={key + rowKey}
              style={{
                padding: '0.5rem 0rem',
                borderBottom: '1px solid lightgrey',
              }}
            >
              {item[key]}
            </td>
          )
        }
      })}
    </tr>
  )
}

function EditableItem({
  item,
  tsvItem,
  valueKey,
  selected,
  fontSize,
  setQuote,
  onTsvEdit,
  itemIndex,
  setNewQuote,
  SupportReference,
}) {
  const [inputValue, setInputValue] = useState(null)
  const value = typeof inputValue == 'string' ? inputValue : item[valueKey]
  const selectedQuoteKey = valueKey?.toLowerCase()

  return (
    <td
      style={{
        padding: '0.5rem 0rem',
        borderBottom: '1px solid lightgrey',
      }}
    >
      <Input
        value={value}
        bold={selected}
        fontSize={fontSize}
        color={selected ? '#38ADDF' : null}
        onChange={e => setInputValue(e.target.value)}
        onBlur={event => {
          if (typeof inputValue == 'string') {
            // In the UI we use Quote but the TSV data calls it OrigWords
            const k = valueKey == 'Quote' ? 'OrigWords' : valueKey
            const newTsvItem = {
              ...tsvItem,
              [k]: event.target.value,
            }

            delete newTsvItem.glQuote
            delete newTsvItem.markdown
            delete newTsvItem.filePath
            delete newTsvItem.fetchResponse

            onTsvEdit(newTsvItem, itemIndex)
            const updatedQuote = {
              quote: item.Quote,
              occurrence: item.Occurrence,
              SupportReference,
            }
            updatedQuote[selectedQuoteKey] = inputValue
            setNewQuote(updatedQuote)
            setQuote(updatedQuote)
          }
        }}
      />
    </td>
  )
}
