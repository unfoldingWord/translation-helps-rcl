import PropTypes from 'prop-types'
import styled from 'styled-components'

const Paper = styled.div`
  margin: 2.5px;
  padding: 16px;
  border-radius: 2px;
  position: relative;
  transition: all 0.2s ease-in-out;
  background-color: #ffffff;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.14);
`

Paper.propTypes = {
  children: PropTypes.node,
}

/** @component */
export default Paper
