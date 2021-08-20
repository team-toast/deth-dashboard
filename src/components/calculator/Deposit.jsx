import { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "./../../styles/flex-grid";
import { sizes, colors } from "./../../styles/styleguide";
import Tooltip from "./../Tooltip";
import CONTRACT_ABI from "./../../lib/abi_2021_02_25.json";

export default function Deposit({ walletAddress, web3 }) {
  const [deposit, setDeposit] = useState(true);
  const [depositJson, setDepositJson] = useState(0);
  const [calculatedDeposit, setCalculatedDeposit] = useState({});
  const increase = () => {
    const copyOfObject = (parseFloat(depositJson) + 0.05).toFixed(2);
    setDepositJson(copyOfObject);
    if (deposit) {
      calculateDeposit(copyOfObject);
    } else {
      calculateWithdraw(copyOfObject);
    }
  };
  const decrease = () => {
    if (depositJson >= 0.1) {
      const copyOfObject = (parseFloat(depositJson) - 0.05).toFixed(2);
      setDepositJson(copyOfObject);
    } else {
      copyOfObject.value = 0;
      setDepositJson(copyOfObject);
    }
    if (deposit) {
      calculateDeposit(copyOfObject);
    } else {
      calculateWithdraw(copyOfObject);
    }
  };

  const calculateDeposit = async (value) => {
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
  };
  const calculateWithdraw = async (value) => {
    let new_contract = await new web3.eth.Contract(
      CONTRACT_ABI,
      process.env.ETH_CONTRACT_ADDRESS
    );
    const getCalculate = await new_contract.methods
      .calculateRedemptionValue(web3.utils.toWei(value.toString(), "ether"))
      .call();
    let obj;
    if (deposit) {
      obj = {
        protocol: web3?.utils?.fromWei(getCalculate._protocolFee),
        automation: web3?.utils?.fromWei(getCalculate._automationFee),
        actualValue: web3?.utils?.fromWei(getCalculate._actualCollateralAdded),
        issued: web3?.utils?.fromWei(getCalculate._tokensIssued),
      };
    } else {
      obj = {
        protocol: web3?.utils?.fromWei(getCalculate._protocolFee),
        automation: web3?.utils?.fromWei(getCalculate._automationFee),
        redeemed: web3?.utils?.fromWei(getCalculate._collateralRedeemed),
        returned: web3?.utils?.fromWei(getCalculate._collateralReturned),
      };
    }
    setCalculatedDeposit(obj);
  };

  useEffect(() => {
    setDepositJson(0), setCalculatedDeposit({});
  }, [deposit]);

  return (
    <Col size={1}>
      {/* Tabs to switch between deposit or Withdraw */}
      <StyledCalculator>
        <SelectButton
          onClick={() => setDeposit(true)}
          className={deposit ? "active" : ""}
        >
          Deposit
        </SelectButton>
        <SelectButton
          onClick={() => setDeposit(false)}
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
              {calculatedDeposit.issued
                ? parseFloat(calculatedDeposit.issued).toFixed(4)
                : 0}{" "}
              dETH issued*
            </Col>
            <Col className="text-center" size={1}>
              <UpDownButton onClick={increase}>+</UpDownButton>
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
            <StyledSubmit>Deposit</StyledSubmit>
          ) : (
            <StyledSubmit disabled>Connect wallet to Deposit</StyledSubmit>
          )}
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
              {calculatedDeposit.returned
                ? parseFloat(calculatedDeposit.returned).toFixed(4)
                : 0}{" "}
              ETH returned*
            </Col>
            <Col className="text-center" size={1}>
              <UpDownButton onClick={increase}>+</UpDownButton>
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
            <StyledSubmit>Withdraw</StyledSubmit>
          ) : (
            <StyledSubmit disabled>Connect wallet to Withdraw</StyledSubmit>
          )}
        </div>
      )}
    </Col>
  );
}

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

const UpDownButton = styled.button`
  min-width: inherit;
  background: none;
  border: none;
  border-radius: 0;
  font-size: 1.75em;
  display: block;
  width: 100%;
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
