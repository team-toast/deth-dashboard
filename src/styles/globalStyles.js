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
    &-bottom-2 {
        margin-bottom: 2em;
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

.container {
    position: relative;
}

.slider {
  position: relative;
  width: 100%;
}

.slider__track,
.slider__range,
.slider__left-value,
.slider__right-value {
  position: absolute;
}

.slider__track,
.slider__range {
  border-radius: 3px;
  height: 5px;
}

.slider__track {
  background-color: #ced4da;
  width: 100%;
  z-index: 1;
}

.slider__range {
  background-color: #5987db;
  z-index: 2;
}

.slider__left-value,
.slider__right-value {
  color: #dee2e6;
  font-size: 12px;
  margin-top: 20px;
}

.slider__left-value {
  left: 6px;
}

.slider__right-value {
  right: -4px;
}

/* Removing the default appearance */
.thumb,
.thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.thumb {
  pointer-events: none;
  position: absolute;
  height: 0;
  width: 100%;
  outline: none;
}

.thumb--zindex-3 {
  z-index: 3;
}

.thumb--zindex-4 {
  z-index: 4;
}

.thumb--zindex-5 {
  z-index: 5;
}

/* For Chrome browsers */
.thumb::-webkit-slider-thumb {
  background-color: #bfc3c9;
  border: none;
  //border-radius: 50%;
  box-shadow: 0 0 1px 1px #ced4da;
  cursor: pointer;
  height: 30px;
  width: 10px;
  margin-top: 4px;
  pointer-events: all;
  position: relative;
}

/* For Firefox browsers */
.thumb::-moz-range-thumb {
  background-color: #f1f5f7;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0 1px 1px #ced4da;
  cursor: pointer;
  height: 18px;
  width: 18px;
  margin-top: 4px;
  pointer-events: all;
  position: relative;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

`;
