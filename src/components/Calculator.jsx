import { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "./../styles/flex-grid";
import { sizes, colors } from "./../styles/styleguide";
import Deposit from "./calculator/Deposit";
import DethCalculation from "./calculator/DethCalculation";
import WalletState from "./WalletState";

export default function Calculator({
  eTHbalance,
  dETHbalance,
  walletAddress,
  web3,
  web3Detect,
  dETHtoETHvalue,
  getDETHbalanceFunc,
  getETHbalanceFunc,
  setWallet,
}) {
  const [deposit, setDeposit] = useState(true);
  return (
    <StyledSection>
      <GridContainer>
        <Row>
          <Col size={1}>
            <h2 className="text-center">dETH Dashboard</h2>
          </Col>
        </Row>
        <StyledReverseRow xsNoflex>
          <DethCalculation
            dETHbalance={dETHbalance}
            dETHtoETHvalue={dETHtoETHvalue}
            web3={web3}
            walletAddress={walletAddress}
            getDETHbalanceFunc={getDETHbalanceFunc}
          />
          <Deposit
            eTHbalance={eTHbalance}
            dETHbalance={dETHbalance}
            walletAddress={walletAddress}
            web3={web3}
            getDETHbalanceFunc={getDETHbalanceFunc}
            getETHbalanceFunc={getETHbalanceFunc}
          />
        </StyledReverseRow>
      </GridContainer>
      {!walletAddress && (
        <WalletState
          eTHbalance={eTHbalance}
          dETHbalance={dETHbalance}
          walletAddress={walletAddress}
          web3={web3}
          web3Detect={web3Detect}
          dETHtoETHvalue={dETHtoETHvalue}
          getDETHbalanceFunc={getDETHbalanceFunc}
          getETHbalanceFunc={getETHbalanceFunc}
          setWallet={setWallet}
        />
      )}
    </StyledSection>
  );
}

const StyledReverseRow = styled(Row)`
  flex-direction: row-reverse;
`;

const StyledSection = styled.div`
  background: #f1f1f3;
  padding: 4em 1em;
  width: 100%;
  display: block;
  position: relative;
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
    @media screen and (max-width: 75em) {
      margin-bottom: 1em;
    }
  }
`;
