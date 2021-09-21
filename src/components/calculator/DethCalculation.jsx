import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { Row, Col } from "./../../styles/flex-grid";
import CONTRACT_ABI from "./../../lib/abi_2021_02_25.json";

import ProgressBar from "./../ProgressBar";

export default function DethCalculation({
  dETHbalance,
  dETHtoETHvalue,
  web3,
  walletAddress,
  getDETHbalanceFunc,
}) {
  const [deth, setDeth] = useState(null);
  const [eth, setEth] = useState(null);
  const [dollar, setDollar] = useState(null);
  const [showNoFundsTooltip, setShowNoFundsTooltip] = useState(false);

  const [status, setStatus] = useState(false);

  const withdrawDETHtoETH = async () => {
    if (walletAddress && deth > 0) {
      let new_contract = await new web3.eth.Contract(
        CONTRACT_ABI,
        process.env.ETH_CONTRACT_ADDRESS
      );

      setStatus("Withdrawing all ...");

      const fundit = await new_contract.methods
        .redeem(walletAddress, web3?.utils?.toWei(deth).toString())
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

      console.log(31, fundit);
    }
  };

  useEffect(() => {
    setDeth(dETHbalance);
    setEth(web3?.utils?.fromWei(dETHtoETHvalue._collateralRedeemed));
  }, [dETHtoETHvalue]);
  return (
    <StyledCol size={1} className={walletAddress ? "" : "disabledBlock"}>
      {status !== false && (
        <ProgressBar
          status={status}
          closeBtn={() => setStatus(false)}
        ></ProgressBar>
      )}
      <StyledRow>
        <Col size={1}>
          <h2 className="no-margin">
            {deth ? Number(parseFloat(deth).toFixed(4)) : 0} dETH
          </h2>
          <div>
            {eth ? Number(parseFloat(eth).toFixed(4)) : 0} ETH Redeemable
          </div>
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
            onClick={withdrawDETHtoETH}
            className={walletAddress && deth > 0 ? "" : "disabled"}
            onMouseEnter={() =>
              walletAddress && deth > 0 ? "" : setShowNoFundsTooltip(true)
            }
            onMouseLeave={() =>
              walletAddress && deth > 0 ? "" : setShowNoFundsTooltip(false)
            }
          >
            Withdraw All
          </Button>
          {showNoFundsTooltip && (
            <Posrelative>
              <StyledNoFunds>
                <div className="arrow-up"></div>
                No dETH funds to withdraw
              </StyledNoFunds>
            </Posrelative>
          )}
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

const ShiftUp = keyframes`
  0% {
    top: 3px;
  }
  100% {
    top: 0;
    opacity: 1;
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

const Posrelative = styled.div`
  position: relative;
`;

const Button = styled.button`
  background: #5987db;
  border: none;
  color: #ffffff;
  &.disabled {
    background: #ccc;
  }
  &.disabled:hover {
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
