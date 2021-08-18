import { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "./../../styles/flex-grid";
import { sizes, colors } from "./../../styles/styleguide";
import Tooltip from "./../Tooltip";

export default function DethCalculation() {
  const [deposit, setDeposit] = useState(true);
  return (
    <StyledCol size={1}>
      <StyledRow>
        <Col size={1}>
          <h2 className="no-margin">1.25 dETH</h2>
          <div>1.1 ETH Redeemable</div>
          <div className="l-blue">≈ $ 3 200</div>
        </Col>
        <Col className="text-center" size={1}>
          <img height="80" src="/deth-logo-svg.svg" alt="dETH Logo" />
        </Col>
      </StyledRow>
      <Row>
        <Col className="text-center" size={1}>
          Buy/sell dETH on{" "}
          <StyledLink
            target="_blank"
            href="https://app.1inch.io/#/1/swap/ETH/0x51863ec92ba14ede7b17fb2b053145c90e215a57"
            rel="noreferrer"
          >
            1inch
          </StyledLink>
        </Col>
      </Row>
    </StyledCol>
  );
}

const StyledRow = styled(Row)`
  font-size: 0.9em;
  border-radius: 5px;
  background: #ffffff;
  margin-bottom: 2em;
  padding: 3em 2em;
  align-items: center;
  max-width: 450px;
  h2.no-margin {
    margin: 0;
    color: #5987db;
  }
  .l-blue {
    color: #5987db;
  }
`;

const StyledLink = styled.a`
  color: #5987db;
`;

const StyledCol = styled(Col)`
  margin: 1em 2em 2em;
`;
