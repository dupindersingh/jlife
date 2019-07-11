import { injectGlobal } from 'styled-components'

// https://www.styled-components.com/docs/api#injectglobal
injectGlobal`
  *:before,
  *:after,
  * {
    box-sizing: border-box;
    font-family: Montserrat, sans-serif;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  html,
  body {
    margin: 0;
    padding: 0;
    line-height: 1.4;
    background-color: #f5f5f5;
  }

  html,
  body,
  #root {
    min-height: 100vh;
  }

  p {
    margin: 0 0 1rem;
  }

  hr {
    border: none;
    height: 1px;
    background: #eee;
    margin: 1rem 0;
  }
`
