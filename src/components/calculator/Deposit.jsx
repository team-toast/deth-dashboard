import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../../styles/flex-grid";
import { sizes, colors } from "./../../styles/styleguide";
import Tooltip from "./../Tooltip";
import CONTRACT_ABI from "./../../lib/abi_2021_02_25.json";

export default function Deposit({
  eTHbalance,
  dETHbalance,
  walletAddress,
  web3,
}) {
  const [deposit, setDeposit] = useState(true);
  const [depositJson, setDepositJson] = useState(0);
  const [calculatedDeposit, setCalculatedDeposit] = useState({});
  const [swapInfo, setSwatInfo] = useState({
    input: 0,
    output: 0,
  });
  const [showOutput, setShowOutput] = useState(true);
  const [notEnoughBalance, setNotEnoughBalance] = useState(false);
  const increase = () => {
    const copyOfObject = (parseFloat(depositJson) + 0.001).toFixed(3);
    setDepositJson(copyOfObject);
    deposit ? calculateDeposit(copyOfObject) : calculateWithdraw(copyOfObject);
  };
  const decrease = () => {
    let copyOfObject;
    if (depositJson >= 0.002) {
      copyOfObject = (parseFloat(depositJson) - 0.001).toFixed(3);
      setDepositJson(copyOfObject);
    } else {
      copyOfObject = 0;
      setDepositJson(copyOfObject);
    }
    deposit ? calculateDeposit(copyOfObject) : calculateWithdraw(copyOfObject);
  };

  const calculateDeposit = async (value) => {
    let new_contract = await new web3.eth.Contract(
      CONTRACT_ABI,
      process.env.ETH_CONTRACT_ADDRESS
    );
    setShowOutput(false);
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
    setShowOutput(true);
    setNotEnoughBalance(false);
  };
  const calculateWithdraw = async (value) => {
    let new_contract = await new web3.eth.Contract(
      CONTRACT_ABI,
      process.env.ETH_CONTRACT_ADDRESS
    );
    setShowOutput(false);
    const getCalculate = await new_contract.methods
      .calculateRedemptionValue(web3.utils.toWei(value.toString(), "ether"))
      .call();
    let obj = {
      protocol: web3?.utils?.fromWei(getCalculate._protocolFee),
      automation: web3?.utils?.fromWei(getCalculate._automationFee),
      redeemed: web3?.utils?.fromWei(getCalculate._collateralRedeemed),
      returned: web3?.utils?.fromWei(getCalculate._collateralReturned),
    };
    setNotEnoughBalance(false);
    setCalculatedDeposit(obj);
    setShowOutput(true);
  };

  const depositEthToDETH = async () => {
    if (parseFloat(eTHbalance) >= parseFloat(depositJson)) {
      let new_contract = await new web3.eth.Contract(
        CONTRACT_ABI,
        process.env.ETH_CONTRACT_ADDRESS
      );
      const fundit = await new_contract.methods
        .squanderMyEthForWorthlessBeansAndAgreeToTerms(walletAddress)
        .send({
          from: walletAddress,
          value: web3.utils.toWei(depositJson.toString(), "ether"),
        })
        .then((res) => console.log("Success", res))
        .catch((err) => console.log(err));
    } else {
      setNotEnoughBalance(true);
    }
  };

  const withdrawDETHtoETH = async () => {
    if (parseFloat(dETHbalance) >= parseFloat(depositJson)) {
      setNotEnoughBalance(false);
      let new_contract = await new web3.eth.Contract(
        CONTRACT_ABI,
        process.env.ETH_CONTRACT_ADDRESS
      );
      const balanceOfDETH = await new_contract.methods
        .balanceOf(walletAddress)
        .call();

      console.log(118, balanceOfDETH);

      // const fundit = await new_contract.methods
      //   .redeem(walletAddress, web3.utils.toWei(depositJson.toString(), "ether"))
      //   .call();

      // console.log(fundit);
    } else {
      setNotEnoughBalance(true);
    }
  };

  useEffect(() => {
    setDepositJson(0), setCalculatedDeposit({});
  }, [deposit]);

  return (
    <Col size={1}>
      {/* Tabs to switch between deposit or Withdraw */}
      <StyledCalculator>
        <SelectButton
          onClick={() => {
            setDeposit(true);
            setNotEnoughBalance(false);
          }}
          className={deposit ? "active" : ""}
        >
          Deposit
        </SelectButton>
        <SelectButton
          onClick={() => {
            setDeposit(false);
            setNotEnoughBalance(false);
          }}
          className={!deposit ? "active" : ""}
        >
          Withdraw
        </SelectButton>
      </StyledCalculator>
      {/* Calculator section */}
      {deposit ? (
        // Deposit Calculator
        <div>
          <StyledUpDown>
            <Col className="text-center" size={1}>
              <UpDownButton onClick={decrease}>-</UpDownButton>
            </Col>
            <Col className="text-center" size={2}>
              <h3>{depositJson} ETH</h3>
              <AnimateChangeSpan className={showOutput ? "active" : ""}>
                {calculatedDeposit.issued
                  ? parseFloat(calculatedDeposit.issued).toFixed(4)
                  : 0}
              </AnimateChangeSpan>
              <span>dETH issued*</span>
            </Col>
            <Col className="text-center" size={1}>
              <UpDownButton className="increase" onClick={increase}>
                +
              </UpDownButton>
            </Col>
          </StyledUpDown>
          <div className="text-center">
            <Tooltip
              key={2}
              title={`*minus fees <span class="info-icon"></span>`}
            >
              <Row>
                <Col size={2}>Protocol Fee:</Col>
                <Col className="text-right" size={1}>
                  {depositJson !== 0
                    ? parseFloat(calculatedDeposit.protocol).toFixed(4)
                    : 0}
                </Col>
              </Row>
              <Row>
                <Col size={2}>Automation Fee:</Col>
                <Col className="text-right" size={1}>
                  {depositJson !== 0
                    ? parseFloat(calculatedDeposit.automation).toFixed(4)
                    : 0}
                </Col>
              </Row>
              <Row>
                <Col size={2}>Actual ETH Added:</Col>
                <Col className="text-right" size={1}>
                  {depositJson !== 0
                    ? parseFloat(calculatedDeposit.actualValue).toFixed(4)
                    : 0}
                </Col>
              </Row>
            </Tooltip>
          </div>
          {walletAddress ? (
            <StyledSubmit
              disabled={
                notEnoughBalance
                  ? true
                  : false || parseFloat(depositJson) > 0
                  ? false
                  : true
              }
              onClick={depositEthToDETH}
            >
              Deposit
            </StyledSubmit>
          ) : (
            <StyledSubmit disabled>Connect wallet to Deposit</StyledSubmit>
          )}
          <Posrelative>
            {walletAddress && notEnoughBalance && (
              <StyledNoFunds>
                <div className="arrow-up"></div>
                Not enough ETH funds
              </StyledNoFunds>
            )}
          </Posrelative>
        </div>
      ) : (
        // Withdraw Calculator
        <div>
          <StyledUpDown>
            <Col className="text-center" size={1}>
              <UpDownButton onClick={decrease}>-</UpDownButton>
            </Col>
            <Col className="text-center" size={2}>
              <h3>{depositJson} dETH</h3>
              <AnimateChangeSpan className={showOutput ? "active" : ""}>
                {calculatedDeposit.returned
                  ? parseFloat(calculatedDeposit.returned).toFixed(4)
                  : 0}
              </AnimateChangeSpan>
              <span>ETH returned*</span>
            </Col>
            <Col className="text-center" size={1}>
              <UpDownButton className="increase" onClick={increase}>
                +
              </UpDownButton>
            </Col>
          </StyledUpDown>
          <div className="text-center">
            <Tooltip
              key={1}
              title={`*minus fees <span class="info-icon"></span>`}
            >
              <Row>
                <Col size={2}>Protocol Fee:</Col>
                <Col className="text-right" size={1}>
                  {depositJson !== 0
                    ? parseFloat(calculatedDeposit.protocol).toFixed(4)
                    : 0}
                </Col>
              </Row>
              <Row>
                <Col size={2}>Automation Fee:</Col>
                <Col className="text-right" size={1}>
                  {depositJson !== 0
                    ? parseFloat(calculatedDeposit.automation).toFixed(4)
                    : 0}
                </Col>
              </Row>
              <Row>
                <Col size={2}>Collateral Returned:</Col>
                <Col className="text-right" size={1}>
                  {depositJson !== 0
                    ? parseFloat(calculatedDeposit.redeemed).toFixed(4)
                    : 0}
                </Col>
              </Row>
            </Tooltip>
          </div>
          {walletAddress ? (
            <StyledSubmit
              disabled={
                notEnoughBalance
                  ? true
                  : false || parseFloat(depositJson) > 0
                  ? false
                  : true
              }
              onClick={withdrawDETHtoETH}
            >
              Withdraw
            </StyledSubmit>
          ) : (
            <StyledSubmit disabled>Connect wallet to Withdraw</StyledSubmit>
          )}
          <Posrelative>
            {walletAddress && notEnoughBalance && (
              <StyledNoFunds>
                <div className="arrow-up"></div>
                Not enough dETH funds
              </StyledNoFunds>
            )}
          </Posrelative>
        </div>
      )}
    </Col>
  );
}

const Posrelative = styled.div`
  position: relative;
`;

const ShiftUp = keyframes`
  0% {
    top: 3px;
  }
  100% {
    top: 0;
    opacity: 1;
  }
`;

const AnimateChangeSpan = styled.span`
  opacity: 0.25;
  margin-right: 0.25em;
  text-align: right;
  position: relative;
  &.active {
    opacity: 1;
    animation: 0.15s ${ShiftUp} forwards;
  }
`;

const StyledNoFunds = styled.div`
  opacity: 1;
  background: #2e2942;
  color: #ffffff;
  box-shadow: 0px 3px 37px rgb(0 0 0 / 40%);
  position: absolute;
  border-radius: 5px;
  width: 600px;
  max-width: 230px;
  padding: 1em;
  font-size: 0.8em;
  line-height: 1.6em;
  text-align: left;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
  animation: 0.15s ${ShiftUp} forwards;
  .arrow-up {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #2e2942;
    position: absolute;
    top: -9px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const StyledSubmit = styled.button`
  border: none;
  width: 100%;
  max-width: 450px;
  margin: 2em auto 0 auto;
  display: block;
  &:hover {
    color: #ffffff;
    background: #db596d;
  }
  &:disabled:hover {
    cursor: not-allowed;
    background: #1c1d22;
    color: #ffffff;
  }
`;

const StyledUpDown = styled(Row)`
  background: white;
  border-radius: 5px;
  max-width: 450px;
  margin: 3em auto 2em auto;
  align-items: center;
  h3,
  p {
    margin: 0;
  }
`;

const StyledCalculator = styled.div`
  display: flex;
  max-width: 600px;
  margin: auto;
`;

const AnimateShadowClick = keyframes`
0% {
  box-shadow: 0 0 0 rgba(222, 29, 58, 1);
}
100% {
  box-shadow: 0 0 20px rgba(222, 29, 58, 0);
}
`;

const UpDownButton = styled.button`
  min-width: inherit;
  background: none;
  border: none;
  border-radius: 0;
  font-size: 1.75em;
  display: block;
  width: 100%;
  border-radius: 5px 0 0 5px;
  &.increase {
    border-radius: 0 5px 5px 0;
  }
  &:active {
    outline: none;
    animation: 0.25s ${AnimateShadowClick} forwards;
  }
`;

const SelectButton = styled.button`
  border: none;
  background: #ffffff;
  border-radius: 0 30px 30px 0;
  flex: 1;
  min-width: inherit;
  text-transform: capitalize;
  &:first-child {
    border-radius: 30px 0 0 30px;
  }
  &:hover {
    background: #ccdaf3;
  }
  &.active {
    background: #5987db;
    color: #ffffff;
  }
`;

const StyledSection = styled.div`
  background: #f1f1f3;
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
  h2 {
    margin-bottom: 3em;
  }
`;
