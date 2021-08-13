import { colors, sizes } from "./styleguide";

const reset = `
html {
    box-sizing: border-box;
    font-size: ${parseInt(sizes.base) * 1}em;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    font: normal normal normal 100% / 2em Helvetica Neue;
    color: ${colors.Dark1};
    cursor: default;
  }
  h1,h2,h3,h4,h5 {
      margin: 0;
  }
`;

export const globalStyles = `
${reset}
.content {
    max-width: ${sizes.container};
    margin: auto;
    width: 100%;
}
.text {
    &-left {
        text-align: left;
    }
    &-center {
        text-align: center;
    }
    &-right {
        text-align: right;
    }
    @media screen and (max-width: 48em) {
        &-left-xs {
            text-align: left;
        }
        &-center-xs {
            text-align: center;
        }
        &-right-xs {
            text-align: right;
        }
    }
}
h1 {
    font-size: ${sizes.xxxl};
    line-height: 1.2238em;
}
h2 {
    font-size: ${sizes.xxl};
    line-height: 1.2156em;
}
h3 {
    font-size: ${sizes.xl};
    line-height: 1.2105em;
}
h4 {
    font-size: ${sizes.xl};
    line-height: 1.2105em;
    font-weight: normal;
    font-family: serif;
}
h5 {
    font-size: ${sizes.lg};
    line-height: 1.1904em;
    font-weight: normal;
    font-family: serif;
}
.logo {
    font-size: 1.875em;
}
a {
    color: ${colors.Dark1}
}
button, .button {
    text-transform: uppercase;
    border: solid 0.0625em ${colors.Dark2};
    background: ${colors.White};
    height: 3.125em;
    line-height: 3em;
    border-radius: 1.5625em;
    transition: all 0.15s ease;
    min-width: 15.625em;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    &:hover {
        border-color: ${colors.Yellow};
        background: ${colors.Yellow};
        color: ${colors.Dark1};
        transition: all 0.15s ease;
    }
}
.button.button-secondary {
    border-color: ${colors.White};
    color: ${colors.White};
    background: ${colors.Dark1};
    &:hover {
        color: ${colors.Dark1};
        background: ${colors.Yellow};
    }
}
.margin {
    &-top-2 {
        margin-top: 2em;
    }
    &-bottom-2 {
        margin-bottom: 2em;
    }
}
.text-transform {
    &-auto {
        text-transform: initial;
    }
}
`;
