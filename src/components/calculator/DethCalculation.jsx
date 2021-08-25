import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Row, Col } from "./../../styles/flex-grid";
import { sizes, colors } from "./../../styles/styleguide";
import Tooltip from "./../Tooltip";

export default function DethCalculation({ dETHbalance, dETHtoETHvalue, web3 }) {
  const [deth, setDeth] = useState(null);
  const [eth, setEth] = useState(null);
  const [dollar, setDollar] = useState(null);

  useEffect(() => {
    setDeth(dETHbalance);
    setEth(web3?.utils?.fromWei(dETHtoETHvalue._collateralRedeemed));
  }, [dETHtoETHvalue]);
  return (
    <StyledCol size={1}>
      <StyledRow>
        <Col size={1}>
          <h2 className="no-margin">{deth ? deth : 0} dETH</h2>
          <div>{eth ? eth : 0} ETH Redeemable</div>
          <div className="l-blue">≈ $ {dollar ? dollar : 0}</div>
        </Col>
        <Col className="text-center" size={1}>
          <Image
            height="100"
            width="100"
            src="/deth-logo-svg.svg"
            alt="dETH Logo"
          />
        </Col>
      </StyledRow>
      <MaxRow>
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
      </MaxRow>
    </StyledCol>
  );
}

const MaxRow = styled(Row)``;

const StyledRow = styled(Row)`
  font-size: 0.9em;
  border-radius: 5px;
  background: #ffffff;
  margin: auto;
  margin-bottom: 2em;
  padding: 3em 2em 2.5em 2em;
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
