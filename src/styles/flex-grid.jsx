import styled, { css } from "styled-components";

// Media Breakpoints
// xs: 0
// sm: 48
// md: 64
// lg: 75

// How to use this grid?

// SIZE attributes:
// size = default on all breakpoints
// xs
// sm
// md
// lf

// REMOVE flex attributes:
// xsNoflex
// smNoflex
// mdNoflex
// lgNoflex

// HIDE attributes:
// hidexs
// hidesm
// hidemd
// hidelg

// HTML markup
// <Row>
//     <Col size={2} xs={1}>Col 1</Col>
//     <Col size={1} xs={1}>Col 2</Col>
// </Row>
// <Row xsNoflex>
//     <Col size={2}>Col 1</Col>
//     <Col size={1}>Col 2</Col>
// </Row>

export const Grid = styled.div``;

export const Row = styled.div`
  display: flex;
  width: 100%;
  ${({ lgNoflex }) =>
    lgNoflex &&
    css`
      @media screen and (min-width: 75em) {
        display: block;
      }
    `}
  ${({ mdNoflex }) =>
    mdNoflex &&
    css`
      @media screen and (max-width: 75em) {
        display: block;
      }
    `}
    ${({ smNoflex }) =>
    smNoflex &&
    css`
      @media screen and (max-width: 64em) {
        display: block;
      }
    `}
    ${({ xsNoflex }) =>
    xsNoflex &&
    css`
      @media screen and (max-width: 48em) {
        display: block;
      }
    `}
    ${({ hidelg }) =>
    hidelg &&
    css`
      @media screen and (min-width: 75em) {
        display: none;
      }
    `}
    ${({ hidemd }) =>
    hidemd &&
    css`
      @media screen and (max-width: 75em) {
        display: none;
      }
    `}
    ${({ hidesm }) =>
    hidesm &&
    css`
      @media screen and (max-width: 64em) {
        display: none;
      }
    `}
    ${({ hidexs }) =>
    hidexs &&
    css`
      @media screen and (max-width: 48em) {
        display: none;
      }
    `}
`;

export const Col = styled.div`
  flex: ${({ size }) => size};
  transition: all 0.15s ease;
  ${({ lg }) =>
    lg &&
    css`
      @media screen and (min-width: 75em) {
        flex: ${({ lg }) => lg};
      }
    `}
  ${({ hidelg }) =>
    hidelg &&
    css`
      @media screen and (min-width: 75em) {
        display: none;
      }
    `}
    ${({ md }) =>
    md &&
    css`
      @media screen and (max-width: 75em) {
        flex: ${({ md }) => md};
      }
    `}
    ${({ hidemd }) =>
    hidemd &&
    css`
      @media screen and (max-width: 75em) {
        display: none;
      }
    `}
    ${({ sm }) =>
    sm &&
    css`
      @media screen and (max-width: 64em) {
        flex: ${({ sm }) => sm};
      }
    `}
    ${({ hidesm }) =>
    hidesm &&
    css`
      @media screen and (max-width: 64em) {
        display: none;
      }
    `}
    ${({ xs }) =>
    xs &&
    css`
      @media screen and (max-width: 48em) {
        flex: ${({ xs }) => xs};
      }
    `}
    ${({ hidexs }) =>
    hidexs &&
    css`
      @media screen and (max-width: 48em) {
        display: none;
      }
    `}
`;
