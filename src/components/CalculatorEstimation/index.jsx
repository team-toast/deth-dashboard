import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "../../styles/flex-grid";
import { sizes, colors } from "../../styles/styleguide";
import Tooltip from "./../Tooltip";

import DonutChart from "./DonutChart";

export default function CalculatorEstimate() {
  const [eth, setEth] = useState(0);
  const [percentage, setPercentage] = useState(10);
  const updateEth = (value) => {
    if (isNaN(value)) {
      return;
    } else {
      setEth(value);
    }
  };
  return (
    <StyledSection>
      <GridContainer>
        <Row>
          <Col size={1}>
            <Styledh2 className="text-center">
              Calculate your potential ETH gains
            </Styledh2>
          </Col>
        </Row>
        <Row xsNoflex>
          <Col size={1}>
            <Posrelative>
              <strong>ETH you want to place</strong>
              <br />
              <StyledInput
                type="text"
                value={eth}
                className="input"
                placeholder="0"
                pattern="[0-9]+"
                onChange={() => updateEth(event.target.value)}
              />
            </Posrelative>
            <Posrelative>
              <strong>Assumed price change</strong>
              <br />
              <StyledInput
                type="range"
                min="0"
                max="100"
                className="slider"
                value={percentage}
                onChange={() => setPercentage(parseFloat(event.target.value))}
              />
              <MaxWidth>
                <StyledInputValue value={percentage}>
                  {percentage}%
                </StyledInputValue>
              </MaxWidth>
            </Posrelative>
          </Col>
          <Col size={1}>
            <Row>
              <GraphCol size={1}>
                <Styledh4>Possible gain</Styledh4>
                <DonutChart
                  color="#5987DB"
                  potential={
                    parseFloat((eth * percentage) / 100) % 1 != 0
                      ? parseFloat((eth * percentage) / 100).toFixed(4)
                      : parseFloat((eth * percentage) / 100).toFixed(0)
                  }
                  difference={
                    parseFloat((eth * percentage) / 100) % 1 != 0
                      ? parseFloat((eth * percentage) / 100).toFixed(4)
                      : parseFloat((eth * percentage) / 100).toFixed(0)
                  }
                />
              </GraphCol>
              <GraphCol size={1}>
                <Styledh4>Possible loss</Styledh4>
                <DonutChart
                  color="#DB596D"
                  potential={
                    parseFloat((eth * percentage) / 100) % 1 != 0
                      ? parseFloat((eth * percentage) / 100).toFixed(4)
                      : parseFloat((eth * percentage) / 100).toFixed(0)
                  }
                  difference={
                    parseFloat((eth * percentage) / 100) % 1 != 0
                      ? parseFloat((eth * percentage) / 100).toFixed(4)
                      : parseFloat((eth * percentage) / 100).toFixed(0)
                  }
                  reverse={true}
                />
              </GraphCol>
            </Row>
            <Row>
              <MinusFeesCol className="text-center" size={1}>
                <Tooltip
                  key={2}
                  title={`*minus fees <span class="info-icon"></span>`}
                >
                  <Row>
                    <Col size={2}>Automation Fee:</Col>
                    <Col className="text-right" size={1}>
                      1
                    </Col>
                  </Row>
                  <Row>
                    <Col size={2}>Collateral Redeemed:</Col>
                    <Col className="text-right" size={1}>
                      2
                    </Col>
                  </Row>
                  <Row>
                    <Col size={2}>Protocol Fee:</Col>
                    <Col className="text-right" size={1}>
                      344
                    </Col>
                  </Row>
                  <Row>
                    <Col size={2}>Collateral Returned:</Col>
                    <Col className="text-right" size={1}>
                      43
                    </Col>
                  </Row>
                </Tooltip>
              </MinusFeesCol>
            </Row>
          </Col>
        </Row>
      </GridContainer>
    </StyledSection>
  );
}

const MaxWidth = styled.div`
  max-width: 500px;
  position: relative;
`;

const StyledInputValue = styled.div`
  position: absolute;
  color: #1f1f1f;
  left: ${(props) => (props.value >= 90 ? props.value - 10 : props.value)}%;
  bottom: 0;
  transition: all 0.15s ease-out;
`;

const Posrelative = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
  &.slider {
    -webkit-appearance: none;
    background: #dddddd;
    height: 0.32rem;
    margin-top: 1.5rem;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #5987db;
      cursor: pointer;
      transition: all 0.25s ease;
      &:active {
        cursor: grabbing;
        transition: all 0.25s ease;
        box-shadow: 0 0 40px 10px #5987db;
      }
    }
    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #5987db;
      cursor: pointer;
      border-radius: 0;
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
