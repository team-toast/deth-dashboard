import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "../../styles/flex-grid";
import { sizes, colors } from "../../styles/styleguide";
import Tooltip from "./../Tooltip";

import LineChart from "./LineChart";

import Web3 from "web3";

export default function CalculatorEstimate({ ethPriceWeb }) {
  const web3Provider = new Web3.providers.HttpProvider(process.env.ETH_RPC);
  const web3 = new Web3(web3Provider);

  return (
    <StyledSection>
      <GridContainer>
        <Row>
          <Col size={1}>
            <Styledh2 className="text-center">
              Calculate your potential ETH gains
            </Styledh2>
            <div>
              <LineChart />
            </div>
          </Col>
        </Row>
        <Row xsNoflex></Row>
      </GridContainer>
    </StyledSection>
  );
}

const FadeSlider = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);
  position: absolute;
  top: 0;
  left: -5px;
  width: 103%;
  height: 100%;
  z-index: 1;
  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    left: 50%;
  }
`;

const FlexBox = styled.div`
  display: flex;
`;

const FlexRow = styled.div`
  flex: 1;
  padding: 0 0.5rem;
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
`;

const MaxWidth = styled.div`
  // max-width: 500px;
  position: relative;
  display: flex;
  > div {
    flex: 1;
    &:last-child {
      text-align: right;
    }
  }
  &.margin-top-2 {
    margin-top: 1.5rem;
    width: 91%;
  }
  &.margin-left-bubble-6 {
    .range-bubble {
      margin-left: -6px;
    }
  }
`;

const StyledInputValue = styled.div`
  position: absolute;
  color: #1f1f1f;
  bottom: 0;
  bottom: -53px;
  @-moz-document url-prefix() {
    bottom: -40px;
  }
  z-index: 1;
  transition: all 0.15s ease-out;
  background: #5987db;
  border-radius: 5px;
  padding: 2px 10px;
  color: #ffffff;
  &::after {
    content: "";
    position: absolute;
    top: 27%;
    left: -12px;
    border-top: 7px solid transparent;
    border-left: 7px solid transparent !important;
    border-right: 7px solid #5987db !important;
    border-bottom: 7px solid transparent;
  }
  &.flip-arrow {
    &::after {
      content: "";
      position: absolute;
      top: 27%;
      left: 97%;
      border-top: 7px solid transparent;
      border-left: 7px solid #5987db !important;
      border-right: 7px solid transparent !important;
      border-bottom: 7px solid transparent;
    }
  }
  @media screen and (max-width: 40rem) {
    left: 0;
    transition: none;
  }
`;

const Posrelative = styled.div`
  position: relative;
  .visible-on-xsmall {
    display: none;
    @media screen and (max-width: 40rem) {
      display: inline;
    }
  }
`;

const StyledInput = styled.input`
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  // max-width: 500px;
  &:disabled {
    cursor: not-allowed;
    background: #f3f3f3;
  }
  &.slider {
    -webkit-appearance: none;
    background: #dddddd;
    height: 0.32rem;
    margin-top: 0rem;
    margin-bottom: 0.8rem;
    position: relative;
    &:after {
      content: " ";
      width: 6px;
      height: 30px;
      border-radius: 3px;
      background: #dddddd;
      position: absolute;
      left: 50%;
      z-index: 0;
      margin-left: -2px;
      margin-top: -10px;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #5987db;
      cursor: pointer;
      transition: all 0.25s ease;
      z-index: 1;
      position: relative;
      &:active {
        cursor: grabbing;
        transition: all 0.25s ease;
        box-shadow: 0 0 40px 10px #5987db;
        @media screen and (max-width: 40rem) {
          box-shadow: none;
        }
      }
    }
    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #5987db;
      cursor: pointer;
      border-radius: 0;
    }
  }
  &.input {
    line-height: 48px;
    padding: 0 1rem;
    font-size: 1rem;
    border-radius: 5px;
    border: solid 1px #dddddd;
    color: #2e2942;
  }
`;

const MinusFeesCol = styled(Col)`
  margin-top: 1rem;
`;

const Styledh4 = styled.h4`
  font-family: "Helvetica Neue";
  color: #2e2942;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  .green {
    color: #5987db;
    @media screen and (max-width: 40rem) {
      display: block;
    }
  }
  .red {
    color: rgb(219, 89, 109);
    @media screen and (max-width: 40rem) {
      display: block;
    }
  }
`;

const GraphCol = styled(Col)`
  padding: 0 1rem;
  @media screen and (max-width: 40rem) {
    padding: 0 0 1rem 0;
    margin-top: 2rem;
  }
`;

const StyledReverseRow = styled(Row)`
  flex-direction: row-reverse;
`;

const StyledSection = styled.div`
  background: #ffffff;
  padding: 4em 1em;
  width: 100%;
  display: block;
`;

const GridContainer = styled.div`
  max-width: ${sizes.container};
  margin: auto;
  width: 100%;
  h1 {
    margin: auto;
  }
`;

const Styledh2 = styled.h2`
  margin-bottom: 3rem;
  @media screen and (max-width: 75em) {
    margin-bottom: 1em;
  }
`;
