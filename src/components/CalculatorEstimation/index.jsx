import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "../../styles/flex-grid";
import { sizes, colors } from "../../styles/styleguide";
import Tooltip from "./../Tooltip";

import CONTRACT_ABI from "./../../lib/abi_2021_02_25.json";

import DonutChart from "./DonutChart";

import Web3 from "web3";

export default function CalculatorEstimate({ ethPriceWeb }) {
  const web3Provider = new Web3.providers.HttpProvider(process.env.ETH_RPC);
  const web3 = new Web3(web3Provider);

  const [eth, setEth] = useState(1);
  const [sliderPercentage, setSliderPercentage] = useState(ethPriceWeb * 1.1);
  const [gains, setGains] = useState(0);
  const [gainsText, setGainsText] = useState(0);
  const [calculatedDeposit, setCalculatedDeposit] = useState({});
  const [gainsDollars, setGainsDollars] = useState(0);
  const [potentialPrice, setPotentialPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(ethPriceWeb);

  const calculateGains = async () => {
    const sliderPotentialPrice = parseInt(sliderPercentage);
    setPotentialPrice(sliderPotentialPrice);
    const ratio = sliderPotentialPrice / ethPrice;
    const dollarValue = eth * ethPrice * ratio;
    const currentEthValue = ethPrice * eth;
    const priceDiff = dollarValue - currentEthValue;
    const truePercentage = (priceDiff / currentEthValue) * 100;
    const ethGains = eth * ratio;
    const ethGainsWithFees = ethGains * (1 - 2 * 0.009) * (1 - 2 * 0.01);
    const dollarGrowthWithFees =
      sliderPotentialPrice * ethGains * (1 - 2 * 0.009) * (1 - 2 * 0.01);
    setGainsDollars(dollarGrowthWithFees - eth * ethPrice);
    setGainsText(ethGainsWithFees);
    setGains(truePercentage);
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
  const setBubble = () => {
    const range = document.querySelector(".slider");
    const bubble = document.querySelector(".range-bubble");
    var slider = range;
    var sliderPos = slider.value / slider.max;

    var pixelPostion = slider.clientWidth * sliderPos;
    //this is your pixel value
    // console.log(pixelPostion);
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    if (newVal < 40) {
      bubble.style.left = `${Number(pixelPostion + 35)}px`;
      bubble.classList.remove("flip-arrow");
    } else if (newVal < 60) {
      bubble.style.left = `${Number(pixelPostion + 25)}px`;
      bubble.classList.remove("flip-arrow");
    } else {
      bubble.style.left = `${Number(pixelPostion - 90)}px`;
      bubble.classList.add("flip-arrow");
    }
  };
  useEffect(() => {
    calculateGains();
  }, []);
  useEffect(() => {
    if (!isNaN(eth)) {
      if (ethPrice !== 0 || eth !== 0) {
        calculateGains();
        setBubble();
      }
    }
  }, [sliderPercentage, eth, ethPrice]);
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
            <FlexBox>
              <FlexRow>
                <Posrelative>
                  <strong>
                    ETH <span className="hide-xs">you want</span> to place
                  </strong>
                  <br />
                  <StyledInput
                    type="text"
                    defaultValue={isNaN(eth) ? 1 : eth}
                    className="input"
                    placeholder="0"
                    pattern="[0-9]+"
                    onChange={() => {
                      if (!isNaN(event.target.value)) {
                        setEth(parseFloat(event.target.value));
                        // triggerChanges();
                      }
                    }}
                  />
                </Posrelative>
              </FlexRow>
              <FlexRow>
                <Posrelative className="dollar-symbol">
                  <strong>Current ETH price</strong>
                  <br />
                  <StyledInput
                    type="text"
                    value={ethPrice}
                    className="input"
                    placeholder="0"
                    pattern="[0-9]+"
                    disabled
                    readonly
                    title={`Current ETH price $${ethPrice}`}
                  />
                </Posrelative>
              </FlexRow>
            </FlexBox>
            <Posrelative>
              <strong>Assumed price change</strong>
              {ethPrice && (
                <span>
                  {" "}
                  of{" "}
                  <strong>
                    {Number((potentialPrice / ethPrice).toFixed(2)) < 1.0
                      ? Number(
                          ((potentialPrice / ethPrice) * 100 - 100).toFixed(2)
                        )
                      : Number(
                          ((potentialPrice / ethPrice) * 100 - 100).toFixed(2)
                        )}
                    %
                  </strong>
                </span>
              )}
              <br />
              <MaxWidth className="margin-top-2">
                <StyledInputValue
                  className={ethPrice ? "range-bubble" : "range-bubble hidden"}
                >
                  ${Number(potentialPrice)}
                </StyledInputValue>
              </MaxWidth>
              <MaxWidth className="grey-text">
                <div>-100%</div>
                <div className="text-center">0%</div>
                <div className="text-right">100%</div>
              </MaxWidth>
              <StyledInput
                type="range"
                min="0"
                max={parseInt(ethPrice * 2)}
                className="slider"
                defaultValue={
                  isNaN(sliderPercentage) ? ethPrice : sliderPercentage
                }
                onInput={({ target: { value: sliderPercentage } }) => {
                  setSliderPercentage(sliderPercentage);
                }}
              />
              <MaxWidth>
                <div>$0</div>
                <div>${Number(parseInt(ethPrice * 2))}</div>
              </MaxWidth>
            </Posrelative>
            <Posrelative className="dollar-symbol">
              <br />
              <br />
              <strong>Custom future ETH price</strong>
              <br />
              <StyledInput
                type="text"
                defaultValue={isNaN(potentialPrice) ? ethPrice : potentialPrice}
                className="input"
                placeholder="0"
                pattern="[0-9]+"
                onChange={() => {
                  if (event.target.value.length > 0) {
                    if (!isNaN(event.target.value)) {
                      setSliderPercentage(event.target.value);
                    }
                  }
                }}
              />
            </Posrelative>
          </Col>
          <Col size={1}>
            <Row>
              <GraphCol size={1}>
                <Styledh4>
                  Possible gain{" "}
                  <span className={gainsDollars >= 0 ? "green" : "red"}>
                    {isNaN(gainsText) ? 0 : parseFloat(gainsText).toFixed(4)}{" "}
                    ETH
                  </span>
                </Styledh4>
                <DonutChart
                  color={potentialPrice - ethPrice < 0 ? "#DB596D" : "#5987DB"}
                  potential={parseFloat(gains).toFixed(4)}
                  difference={Number(gainsDollars.toFixed(0))}
                  reverse={potentialPrice - ethPrice < 0 ? true : false}
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
`;

const StyledInputValue = styled.div`
  position: absolute;
  color: #1f1f1f;
  bottom: 0;
  bottom: -53px;
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
