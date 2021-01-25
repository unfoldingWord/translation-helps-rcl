import React from 'react'
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

const TsvList = ({ items, filters, fontSize, setQuote, selectedQuote }) => {
  fontSize = typeof fontSize === 'number' ? `${fontSize}%` : fontSize

  if (items) {
    filters = ['Translation Word', 'Original Quote']
    items = items.map(({ SupportReference, Quote }) => {
      const directories = SupportReference.split('/')
      const value = directories[directories.length - 1]

      return {
        SupportReference: value,
        Quote,
      }
    })
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
          {items &&
            items.map((item, i) => {
              const style = {}

              if (selectedQuote && selectedQuote === item.Quote) {
                style.color = '#38ADDF'
                style.fontWeight = 'bold'
              }

              if (setQuote) {
                style.cursor = 'pointer'
              }

              return (
                <tr
                  key={i}
                  onClick={() => {
                    if (setQuote) setQuote(item.Quote)
                  }}
                  style={style}
                >
                  {Object.keys(item).map(key => (
                    <td
                      key={key + i}
                      style={{
                        padding: '0.5rem 0rem',
                        borderBottom: '1px solid lightgrey',
                      }}
                    >
                      {item[key]}
                    </td>
                  ))}
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
  selectedQuote: PropTypes.string,
  filters: PropTypes.array.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default TsvList
