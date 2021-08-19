import { createGlobalStyle, ThemeProvider } from "styled-components";

import "./../styles/page-loader.css";

import { globalStyles } from "./../styles/globalStyles";

const GlobalStyle = createGlobalStyle`
  ${globalStyles}
`;

const theme = {};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
