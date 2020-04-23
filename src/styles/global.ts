import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    -webkit-font-smoothing: antialiased;
  }

  body, button, input {
    font: 16px 'Montserrat', sans-serif;
  }

  button {
    cursor: pointer;
  }
`;
