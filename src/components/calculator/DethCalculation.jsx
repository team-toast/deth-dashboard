import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Row, Col } from "./../../styles/flex-grid";
import CONTRACT_ABI from "./../../lib/abi_2021_02_25.json";

export default function DethCalculation({
  dETHbalance,
  dETHtoETHvalue,
  web3,
  walletAddress,
}) {
  const [deth, setDeth] = useState(null);
  const [eth, setEth] = useState(null);
  const [dollar, setDollar] = useState(null);

  const withdrawDETHtoETH = async () => {
    let new_contract = await new web3.eth.Contract(
      CONTRACT_ABI,
      process.env.ETH_CONTRACT_ADDRESS
    );
    const balanceOfDETH = await new_contract.methods
      .balanceOf(walletAddress)
      .call();

    console.log(118, balanceOfDETH);

    const fundit = await new_contract.methods
      .redeem(walletAddress, web3.utils.toWei(dETHbalance.toString(), "ether"))
      .call();

    console.log(fundit);
  };

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
          {dollar && <div className="l-blue">≈ $ {dollar ? dollar : 0}</div>}
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
      <StyledRow className="text-center">
        <Col size={1}>
          <Button
            disabled={walletAddress && deth > 0 ? false : true}
            onClick={withdrawDETHtoETH}
          >
            Withdraw All
          </Button>
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

const Button = styled.button`
  background: #5987db;
  border: none;
  color: #ffffff;
  &:disabled {
    background: #ccc;
  }
  &:disabled:hover {
    cursor: not-allowed;
    background: #1c1d22;
    color: #ffffff;
  }
`;

const MaxRow = styled(Row)``;

const StyledRow = styled(Row)`
  font-size: 0.9em;
  border-radius: 5px;
  background: #ffffff;
  margin: auto;
  margin-bottom: 2em;
  padding: 2em 2em 2.5em 2em;
  align-items: center;
  max-width: 450px;
  h2.no-margin {
    margin: 0;
    color: #5987db;
  }
  .l-blue {
    color: #5987db;
  }
  &:first-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  &:nth-child(2) {
    padding-top: 1rem;
  }
`;

const StyledLink = styled.a`
  color: #5987db;
`;

const StyledCol = styled(Col)`
  margin: 1em 2em 2em;
  @media screen and (max-width: 40rem) {
    margin: 1em 0 2em;
  }
`;
