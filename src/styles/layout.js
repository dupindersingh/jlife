import styled from 'styled-components'

const HeaderFooterWrapper = styled.div`
  margin: auto;
  grid-template-rows: max-content auto max-content;
  min-height: 100vh;
`

const Page = styled.div`

`
const Footer = styled.div`
  padding: 1rem;
  text-align: center;
  opacity: .3;
  vertical-align: bottom;
`

export {
  HeaderFooterWrapper,
  Page,
  Footer,
}
