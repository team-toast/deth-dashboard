import { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "./../../styles/flex-grid";
import { sizes, colors } from "./../../styles/styleguide";
import Tooltip from "./../Tooltip";

export default function Deposit() {
  const [deposit, setDeposit] = useState(true);
  return (
    <Col size={1}>
      {deposit ? (
        <div>
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
          <StyledUpDown>
            <Col className="text-center" size={1}>
              <UpDownButton>-</UpDownButton>
            </Col>
            <Col className="text-center" size={2}>
              <h3>0.0500 ETH</h3>
              0.12 dETH issued*
            </Col>
            <Col className="text-center" size={1}>
              <UpDownButton>+</UpDownButton>
            </Col>
          </StyledUpDown>
          <div className="text-center">
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
          </div>
          <StyledSubmit>Deposit</StyledSubmit>
        </div>
      ) : (
        <div>
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
          <StyledUpDown>
            <Col className="text-center" size={1}>
              <UpDownButton>-</UpDownButton>
            </Col>
            <Col className="text-center" size={2}>
              <h3>0.0500 dETH</h3>
              0.12 ETH returned*
            </Col>
            <Col className="text-center" size={1}>
              <UpDownButton>+</UpDownButton>
            </Col>
          </StyledUpDown>
          <div className="text-center">
            <Tooltip
              key={1}
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
                  4
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
          </div>
          <StyledSubmit>Withdraw</StyledSubmit>
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
