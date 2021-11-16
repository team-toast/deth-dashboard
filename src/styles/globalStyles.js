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
    font: normal normal normal 100% / 1.5em "Helvetica Neue", Arial;
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
    &-green {
        color: green;
    }
    &-red {
        color: red;
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
        border-color: ${colors.dRed};
        background: ${colors.lRed};
        color: ${colors.White};
        transition: all 0.15s ease;
    }
    &:active {
        color: #ffffff;
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
    &-bottom-1 {
        margin-bottom: 1em;
    }
    &-bottom-2 {
        margin-bottom: 2em;
    }
    &-bottom-3 {
        margin-bottom: 3em;
    }
    &-right-2 {
        margin-right: 2em;
    }
}
.text-transform {
    &-auto {
        text-transform: initial;
    }
}
.info-icon {
    height: 16px;
    width: 16px;
    background: url(/info-icon.svg) center no-repeat;
    display: inline-block;
    background-size: contain;
    position: relative;
    top: 3px;
    cursor: pointer;
}
.hidden {
    display: none;
}
input {
    outline: none;
}
.dollar-symbol input {
    padding: 0px 1rem 0 2.5rem !important;
}
.disabledBlock {
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}
.dollar-symbol::after {
    content: "$";
    position: absolute;
    left: 0;
    bottom: 32px;
    width: 30px;
    background: rgb(221, 221, 221);
    height: 50px;
    color: rgb(46, 41, 66);
    line-height: 50px;
    text-align: center;
    border-radius: 5px 0 0 5px;
}
.grey-text {
    font-size: 0.9rem;
    color: #888;
}
@media screen and (max-width: 48em) {
    .hide-xs {
        display: none;
    }
}
`;
