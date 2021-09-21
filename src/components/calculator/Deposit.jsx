import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../../styles/flex-grid";
import { sizes, colors } from "./../../styles/styleguide";
import Tooltip from "./../Tooltip";
import CONTRACT_ABI from "./../../lib/abi_2021_02_25.json";

import ProgressBar from "./../ProgressBar";

export default function Deposit({
  eTHbalance,
  dETHbalance,
  walletAddress,
  web3,
  getDETHbalanceFunc,
  getETHbalanceFunc,
  wrongChain,
}) {
  const [deposit, setDeposit] = useState(true);
  const [depositJson, setDepositJson] = useState(0);
  const [calculatedDeposit, setCalculatedDeposit] = useState({});
  const [showOutput, setShowOutput] = useState(true);
  const [notEnoughBalance, setNotEnoughBalance] = useState(false);
  const [status, setStatus] = useState(false);
  const increase = () => {
    const copyOfObject = (
      isNaN(depositJson) || depositJson === ""
        ? 0 + 0.01
        : parseFloat(depositJson) + 0.01
    ).toFixed(3);
    setDepositJson(copyOfObject);
    deposit ? calculateDeposit(copyOfObject) : calculateWithdraw(copyOfObject);
  };
  const decrease = () => {
    let copyOfObject;
    if (depositJson >= 0.02) {
      copyOfObject = (parseFloat(depositJson) - 0.01).toFixed(3);
      setDepositJson(copyOfObject);
    } else {
      copyOfObject = 0;
      setDepositJson(copyOfObject);
    }
    deposit ? calculateDeposit(copyOfObject) : calculateWithdraw(copyOfObject);
  };

  const calculateDeposit = async (value) => {
    if (isNaN(value) || value === "") {
      return;
    }
    try {
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
    } catch (error) {
      console.log("Increase -error", error);
    }
  };
  const calculateWithdraw = async (value) => {
    if (isNaN(value) || value === "") {
      return;
    }
    try {
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
    } catch (error) {
      console.log("Decrease -error", error);
    }
  };

  const depositEthToDETH = async () => {
    console.log(`depositEthToDETH`);
    await getETHbalanceFunc();
    if (parseFloat(eTHbalance) >= parseFloat(depositJson)) {
      let new_contract = await new web3.eth.Contract(
        CONTRACT_ABI,
        process.env.ETH_CONTRACT_ADDRESS
      );
      setStatus("Depositing ...");
      const fundit = await new_contract.methods
        .squanderMyEthForWorthlessBeansAndAgreeToTerms(walletAddress)
        .send({
          from: walletAddress,
          value: web3.utils.toWei(depositJson.toString(), "ether"),
        })
        .then((res) => {
          console.log("Success");
          console.log(dETHbalance);
          if (parseFloat(dETHbalance) === 0) {
            addDETHtokenToMM();
          }
          getDETHbalanceFunc();
          setStatus(false);
        })
        .catch((err) => {
          console.log("err", err);
          setStatus("Unable to deposit, please try again.");
        });
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

      setStatus("Withdrawing ...");

      const fundit = await new_contract.methods
        .redeem(walletAddress, web3?.utils?.toWei(depositJson).toString())
        .send({
          from: walletAddress,
          value: web3.utils.toWei("0", "ether"),
        })
        .then((res) => {
          console.log("Success", res);
          getDETHbalanceFunc();
          setStatus(false);
        })
        .catch((err) => {
          setStatus("Unable to withdraw, please try again.");
          console.log(err);
        });

      console.log(fundit);
    } else {
      setNotEnoughBalance(true);
    }
  };

  const addDETHtokenToMM = async () => {
    console.log(`addDETHtokenToMM`);
    const tokenAddress = "0x51863Ec92BA14ede7B17fb2B053145C90E215A57";
    const tokenSymbol = "dETH";
    const tokenDecimals = 18;
    const tokenImage = "https://app.levr.ly/deth-logo-svg.svg";

    try {
      const wasAdded = await web3?.currentProvider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("User added token.");
      } else {
        console.log("User cancelled.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeDepositValue = (data) => {
    if (isNaN(data)) {
      return;
    } else {
      setDepositJson(data);
      deposit
        ? calculateDeposit(isNaN(data) ? 0 : data)
        : calculateWithdraw(isNaN(data) ? 0 : data);
    }
  };

  useEffect(() => {
    setDepositJson(0), setCalculatedDeposit({});
  }, [deposit]);

  return (
    <Col size={1} className={walletAddress ? "" : "disabledBlock"}>
      {status !== false && (
        <ProgressBar
          status={status}
          closeBtn={() => setStatus(false)}
        ></ProgressBar>
      )}
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
            <Col className="text-center" size={3}>
              <h3>
                <StyledRow>
                  <Col className="text-right" size={1}>
                    <StyledInput
                      type="text"
                      value={depositJson}
                      onInput={() => changeDepositValue(event.target.value)}
                      placeholder="0"
                      className={depositJson === "" ? "empty-background" : ""}
                    />
                  </Col>
                  <Col className="text-left" size={1}>
                    ETH
                  </Col>
                </StyledRow>
              </h3>
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
            <Col className="text-center" size={3}>
              <h3>
                <StyledRow>
                  <Col className="text-right" size={1}>
                    <StyledInput
                      type="text"
                      value={depositJson}
                      onInput={() => changeDepositValue(event.target.value)}
                      placeholder="0"
                      className={depositJson === "" ? "empty-background" : ""}
                    />
                  </Col>
                  <Col className="text-left" size={1}>
                    dETH
                  </Col>
                </StyledRow>
              </h3>
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
      {/* <button onClick={addDETHtokenToMM}>Add dETH token to your wallet</button> */}
    </Col>
  );
}

const StyledRow = styled(Row)`
  align-items: center;
`;

const StyledInput = styled.input`
  font-size: 1.1845em;
  line-height: 1.2105em;
  color: #2e2942;
  font-weight: bold;
  width: 100%;
  max-width: initial;
  min-width: initial;
  text-align: right;
  border: none;
  border-right: solid 0.5rem #ffffff;
  outline: none;
  &.empty-background {
    background: #eee;
  }
`;

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

const StyledNoFundsLoader = keyframes`
from {
  width: 0;
}
to {
  width: 100%;
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
