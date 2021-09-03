import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "../../styles/flex-grid";
import { sizes, colors } from "../../styles/styleguide";
import Tooltip from "./../Tooltip";

import CONTRACT_ABI from "./../../lib/abi_2021_02_25.json";

import DonutChart from "./DonutChart";

import Web3 from "web3";

export default function CalculatorEstimate({ ethPrice }) {
  const web3Provider = new Web3.providers.HttpProvider(process.env.ETH_RPC);
  const web3 = new Web3(web3Provider);

  const [eth, setEth] = useState(0);
  const [percentage, setPercentage] = useState(10);
  const [inputPercentage, setInputPercentage] = useState(10);
  const [gains, setGains] = useState(0);
  const [gainsText, setGainsText] = useState(0);
  const [losses, setLosses] = useState(0);
  const [lossesText, setLossesText] = useState(0);
  const [calculatedDeposit, setCalculatedDeposit] = useState({});
  const [gainsDollars, setGainsDollars] = useState(0);
  const [lossesDollars, setLossesDollars] = useState(0);

  const calculateGains = async () => {
    const x = parseInt(percentage) / 100;
    const getPercentage = x * ethPrice;
    const getFullPrice = ethPrice + getPercentage;
    const ratio = getFullPrice / ethPrice;
    const dollarValue = eth * ethPrice * ratio;
    const dollarWithFees = dollarValue * (1 - 2 * 0.009) * (1 - 2 * 0.01);
    const currentEthValue = ethPrice * eth;
    const priceDiff = dollarWithFees - currentEthValue;
    const truePercentage = (priceDiff / currentEthValue) * 100;
    const toA100 = truePercentage;
    const ethGains = eth * ratio;
    const ethGainsWithFees = ethGains * (1 - 2 * 0.009) * (1 - 2 * 0.01);
    const ethGainsWithFeesPrice = ethGainsWithFees * ethPrice - currentEthValue;
    setGainsDollars(ethGainsWithFeesPrice);
    setGainsText(ethGainsWithFees);
    setGains(toA100);
  };
  const calculateLosses = () => {
    const x = parseInt(percentage) / 100;
    const getPercentage = x * ethPrice;
    const getFullPrice = ethPrice - getPercentage;
    const ratio = getFullPrice / ethPrice;
    const dollarValue = eth * ethPrice * ratio;
    const dollarWithFees = dollarValue * (1 - 2 * 0.009) * (1 - 2 * 0.01);
    const currentEthValue = ethPrice * eth;
    const priceDiff = dollarWithFees - currentEthValue;
    const truePercentage = Math.abs((priceDiff / currentEthValue) * 100);
    const toA100 = truePercentage;
    const ethGains = eth * ratio;
    const ethGainsWithFees = ethGains * (1 - 2 * 0.009) * (1 - 2 * 0.01);
    const ethGainsWithFeesPrice = ethGainsWithFees * ethPrice - currentEthValue;
    setLossesDollars(ethGainsWithFeesPrice);
    setLossesText(ethGainsWithFees);
    setLosses(toA100);
  };
  const calculateDeposit = async (value) => {
    try {
      if (isNaN(value) || value === "") {
        return;
      }
      let new_contract = await new web3.eth.Contract(
        CONTRACT_ABI,
        process.env.ETH_CONTRACT_ADDRESS
      );
      const getCalculate = await new_contract.methods
        .calculateIssuanceAmount(web3.utils.toWei(value.toString(), "ether"))
        .call();
      let obj = {
        protocol: web3?.utils?.fromWei(getCalculate._protocolFee),
        automation: web3?.utils?.fromWei(getCalculate._automationFee),
        actualValue: web3?.utils?.fromWei(getCalculate._actualCollateralAdded),
        issued: web3?.utils?.fromWei(getCalculate._tokensIssued),
      };
      setCalculatedDeposit(obj);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!isNaN(eth)) {
      calculateGains();
      calculateLosses();
    }
  }, [percentage, eth]);
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
                setEth
                onChange={({ target: { value: eth } }) => {
                  !isNaN(eth) ? setEth(eth) : "";
                }}
              />
            </Posrelative>
            <Posrelative>
              <strong>Assumed price change</strong>
              <br />
              <StyledInput
                type="range"
                min="1"
                max="100"
                className="slider"
                defaultValue={percentage}
                onInput={({ target: { value: percentage } }) => {
                  setPercentage(percentage);
                }}
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
                <Styledh4>
                  Possible gain{" "}
                  <span className={gainsDollars >= 0 ? "green" : "red"}>
                    ${Number(gainsDollars.toFixed(0))}
                  </span>
                </Styledh4>
                <DonutChart
                  color="#5987DB"
                  potential={parseFloat(gains).toFixed(4)}
                  difference={parseFloat(gainsText).toFixed(4)}
                />
              </GraphCol>
              <GraphCol size={1}>
                <Styledh4>
                  Possible loss{" "}
                  <span className={lossesDollars >= 0 ? "green" : "red"}>
                    ${Number(lossesDollars.toFixed(0))}
                  </span>
                </Styledh4>
                <DonutChart
                  color="#DB596D"
                  potential={parseFloat(losses).toFixed(4)}
                  difference={parseFloat(lossesText).toFixed(4)}
                  reverse={true}
                />
              </GraphCol>
            </Row>
            <Row>
              <MinusFeesCol
                className="text-center"
                size={1}
                onClick={() => calculateDeposit(eth)}
              >
                <Tooltip
                  key={2}
                  title={`*minus fees <span class="info-icon"></span>`}
                >
                  <Row>
                    <Col size={2}>Protocol Fee:</Col>
                    <Col className="text-right" size={1}>
                      {calculatedDeposit.protocol
                        ? parseFloat(calculatedDeposit.protocol).toFixed(4)
                        : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col size={2}>Automation Fee:</Col>
                    <Col className="text-right" size={1}>
                      {calculatedDeposit.protocol
                        ? parseFloat(calculatedDeposit.automation).toFixed(4)
                        : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col size={2}>Actual ETH Added:</Col>
                    <Col className="text-right" size={1}>
                      {calculatedDeposit.protocol
                        ? parseFloat(calculatedDeposit.actualValue).toFixed(4)
                        : 0}
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
  transition: all 0.35s ease-out;
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
    color: green;
    @media screen and (max-width: 40rem) {
      display: block;
    }
  }
  .red {
    color: red;
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
