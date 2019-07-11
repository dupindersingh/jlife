import styled from 'styled-components'
import { Link } from 'react-router-dom'

const InternalLink = styled(Link)`
  text-decoration: none;

  &:hover,
  &:active {
    text-decoration: underline;
  }
`
const HeaderLink = styled(Link)`
  padding: 0px 5px;
  text-decoration: none;
`

export {
  InternalLink,
  HeaderLink,
}
