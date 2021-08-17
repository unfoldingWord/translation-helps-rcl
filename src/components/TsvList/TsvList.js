import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
              let selected = false
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

              if (
                selectedQuote?.quote === Quote &&
                selectedQuote?.occurrence === Occurrence
              ) {
                selected = true
                style.color = '#38ADDF'
                style.fontWeight = 'bold'
              }

              return (
                <tr key={i} style={style}>
                  {Object.keys(item).map(key => {
                    if (editable && (key == 'Quote' || key == 'Occurrence')) {
                      return (
                        <EditableItem
                          key={key}
                          item={item}
                          valueKey={key}
                          tsvItem={items[i]}
                          fontSize={fontSize}
                          selected={selected}
                          setQuote={setQuote}
                          onTsvEdit={onTsvEdit}
                          SupportReference={SupportReference}
                        />
                      )
                    } else {
                      return (
                        <td
                          key={key + i}
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

const Container = styled.div`
  overflow: auto;
`

const Table = styled.table`
  border-spacing: 0.5rem;
  padding: 0.3rem 0.2rem 1rem;
  width: 100%;
`
const Input = styled.input`
  width: 75px;
  border: none;
  letter-spacing: 0.25px;
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
  font-weight: ${props => (props.bold ? 'bold' : 'inherit')};
  &:focus-visible {
    outline: #38addf auto 1px;
  }
`

function EditableItem({
  item,
  tsvItem,
  valueKey,
  selected,
  fontSize,
  setQuote,
  onTsvEdit,
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
      onClick={() => {
        if (setQuote && !selected) {
          const newQuote = {
            quote: item.Quote,
            occurrence: item.Occurrence,
            SupportReference,
          }
          newQuote[selectedQuoteKey] = inputValue
          setQuote(newQuote)
        } else if (setQuote && selected) {
          setQuote({})
        }
      }}
    >
      <Input
        value={value}
        bold={selected}
        fontSize={fontSize}
        color={selected ? '#38ADDF' : null}
        onChange={e => setInputValue(e.target.value)}
        onBlur={event => {
          if (inputValue) {
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

            onTsvEdit(newTsvItem)
            const newQuote = {
              quote: item.Quote,
              occurrence: item.Occurrence,
              SupportReference,
            }
            newQuote[selectedQuoteKey] = inputValue
            setQuote(newQuote)
          }
        }}
      />
    </td>
  )
}
