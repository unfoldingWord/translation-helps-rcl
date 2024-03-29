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
  setCurrentCheck,
  editable,
  onTsvEdit,
  renderedActionButtons,
  setContent,
  setItemIndex,
  selectedQuote,
  showSaveChangesPrompt,
  shouldDisableClick,
}) {
  let filteredItems = []
  let headers = []
  fontSize = typeof fontSize === 'number' ? `${fontSize}%` : fontSize

  if (items) {
    headers = ['Translation Word', 'Original Quote', 'Occurrence', 'GL Quote']
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
  headers = renderedActionButtons ? [...headers, 'Actions'] : headers

  return (
    <Container>
      <Table>
        <thead style={{ fontSize, paddingBottom: '1rem' }}>
          <tr style={{ textAlign: 'left' }}>
            {headers.map((header, i) => (
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
              const style = { cursor: setCurrentCheck ? 'pointer' : '' }

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
                  setCurrentCheck={setCurrentCheck}
                  onTsvEdit={onTsvEdit}
                  Occurrence={Occurrence}
                  renderedActionButtons={renderedActionButtons}
                  setContent={setContent}
                  setItemIndex={setItemIndex}
                  shouldDisableClick={shouldDisableClick}
                  selectedQuote={selectedQuote}
                  SupportReference={SupportReference}
                  showSaveChangesPrompt={showSaveChangesPrompt}
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
  setCurrentCheck: PropTypes.func,
  setItemIndex: PropTypes.func,
  selectedQuote: PropTypes.object,
  shouldDisableClick: PropTypes.bool,
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
  setCurrentCheck,
  onTsvEdit,
  Occurrence,
  renderedActionButtons,
  setContent,
  setItemIndex,
  shouldDisableClick,
  selectedQuote,
  SupportReference,
  showSaveChangesPrompt,
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
        // Check if tw has been edited in order to not lose unsaved changes when selecting a twl item.
        if (shouldDisableClick) return
        showSaveChangesPrompt('tw', setContent).then(() => {
          if (setCurrentCheck && !selected) {
            if (newQuote) {
              setCurrentCheck(newQuote)
            } else {
              setCurrentCheck({
                quote: item.Quote,
                occurrence: item.Occurrence,
                SupportReference,
                reference: item.Reference,
              })
            }
          } else if (setCurrentCheck && selected) {
            setCurrentCheck({})
          }
          setItemIndex(rowKey)
        })
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
              setCurrentCheck={setCurrentCheck}
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
      { renderedActionButtons && <td
        key={`actions${rowKey}`}
        style={{
          padding: '0.5rem 0rem',
          borderBottom: '1px solid lightgrey',
        }}
      >
        {renderedActionButtons}
      </td>}
    </tr>
  )
}

function EditableItem({
  item,
  tsvItem,
  valueKey,
  selected,
  fontSize,
  setCurrentCheck,
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
              reference: item.Reference,
            }
            updatedQuote[selectedQuoteKey] = inputValue
            setNewQuote(updatedQuote)
            setCurrentCheck(updatedQuote)
          }
        }}
      />
    </td>
  )
}
