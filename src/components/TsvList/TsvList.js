import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  overflow: auto;
`

const Table = styled.table`
  width: 100%;
`

const TsvList = ({ items, filters, markdownView, fontSize: _fontSize }) => {
  console.log({ items })

  return (
    <Container>
      <Table>
        <tbody style={{ fontSize: `${_fontSize}%` }}>
          <tr>
            {filters.map(header => (
              <th>{header}</th>
            ))}
          </tr>
          {items &&
            items.map(item => (
              <tr>
                {Object.keys(item).map(key => (
                  <td>{item[key]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  )
}

TsvList.defaultProps = {
  fontSize: 250,
}

TsvList.propTypes = {
  items: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  markdownView: PropTypes.bool.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default TsvList
