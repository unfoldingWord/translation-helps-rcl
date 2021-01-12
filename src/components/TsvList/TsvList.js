import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  overflow: auto;
`

const Table = styled.table`
  width: 100%;
`

const TsvList = ({ items, filters, fontSize }) => {
  fontSize = typeof fontSize === 'number' ? `${fontSize}%` : fontSize

  return (
    <Container>
      <Table>
        <tbody style={{ fontSize }}>
          <tr>
            {filters.map((header, i) => (
              <th key={header + i}>{header}</th>
            ))}
          </tr>
          {items &&
            items.map((item, i) => (
              <tr key={i}>
                {Object.keys(item).map(key => (
                  <td key={key + i}>{item[key]}</td>
                ))}
              </tr>
            ))}
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
  filters: PropTypes.array.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default TsvList
