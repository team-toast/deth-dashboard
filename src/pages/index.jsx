import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useScript from "./../lib/useScript";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../styles/flex-grid";
import { sizes, colors } from "./../styles/styleguide";

import Calculator from "./../components/Calculator";

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const web3LoadStatus = useScript(
    "https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"
  );
  useEffect(() => {
    if (
      typeof window != "undefined" &&
      window.ethereum !== undefined &&
      web3LoadStatus === "ready" &&
      !web3
    ) {
      try {
        const newWeb3 = new window.Web3(window.ethereum);
        setWeb3(newWeb3);
      } catch (error) {
        console.log("Could not connect Web3");
      }
    }
  }, [web3LoadStatus, web3]);
  const disconnectWallet = () => {
    setWeb3(null);
    setWalletAddress(null);
  };
  const connectWallet = () => {
    if (
      typeof window != "undefined" &&
      window.ethereum !== undefined &&
      web3LoadStatus === "ready" &&
      web3
    ) {
      (async () => {
        console.log("Startup, test eth_requestAccounts");
        let testPassed = false;

        try {
          const sendTest = await window.ethereum.send("eth_requestAccounts");
          console.log("sendTest", sendTest);
          testPassed = true;
        } catch (error) {
          console.log("sendTest Error: ", error);
        }

        if (testPassed) {
          console.log("updating web3");
          const newWeb3 = new window.Web3(window.ethereum);
          const accounts = await newWeb3.eth.getAccounts();
          console.log("accounts", accounts);
          setWalletAddress(accounts[0]);
        }
      })();
    }
  };
  useEffect(() => {
    if (window.ethereum) {
      // Metamask account change
      window.ethereum.on("accountsChanged", function (accounts) {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWeb3(null);
          setWalletAddress(null);
        }
      });
      // Network account change
      window.ethereum.on("chainChanged", function (networkId) {
        console.log(networkId);
      });
    } else {
      console.warn("No web3 detected.");
    }
  });
  return (
    <Layout>
      <StyledHeader>
        <Row>
          <Col size={1}>
            <StyledImg src="/deth-logo-svg.svg" alt="dETH LOGO" />
          </Col>
          <Col hidexs size={1}>
            <StyledSpan>
              Welcome to dETH, where ETH gains are squared.
            </StyledSpan>
          </Col>
          <StyledConnectCol size={1}>
            {walletAddress ? (
              <ConnectedDiv title={walletAddress}>
                <div>
                  <StyledOnIcon></StyledOnIcon>
                  <strong>Connected to</strong>
                </div>
                <EllipsisSpan>{walletAddress}</EllipsisSpan>
              </ConnectedDiv>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )}
          </StyledConnectCol>
        </Row>
      </StyledHeader>
      <Calculator walletAddress={walletAddress} web3={web3} />
    </Layout>
  );
}

const blink = keyframes`
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
`;

const StyledOnIcon = styled.span`
  width: 0.8em;
  height: 0.8em;
  background: #00c762;
  border-radius: 100%;
  display: inline-block;
  margin-right: 0.4em;
  top: 0;
  position: relative;
  animation: 1s ${blink} infinite;
`;

const ConnectedButton = styled.button`
  .show-hover {
    display: none;
  }
  &:hover {
    ${StyledOnIcon} {
      display: none;
    }
    .hide-hover {
      display: none;
    }
    .show-hover {
      display: inline-block;
    }
  }
`;

const EllipsisSpan = styled.span`
  max-width: 600px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  font-size: 0.9em;
  line-height: initial;
  @media screen and (max-width: 75em) {
    max-width: 250px;
  }
`;

const ConnectedDiv = styled.div`
  overflow: hidden;
  display: inline-block;
`;

const StyledSpan = styled.span`
  color: #5987db;
  display: block;
  text-align: center;
`;

const StyledImg = styled.img`
  height: 3em;
  position: relative;
  top: 4px;
`;

const StyledConnectCol = styled(Col)`
  text-align: right;
`;

const StyledHeader = styled.header`
  width: 100%;
  border-bottom: 0.07142em solid #eaeaea;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  background: #ffffff;
  z-index: 1;
  padding: 0.5em 1em;
  box-shadow: 0px 3px 20px #0000001a;
  > div {
    align-items: center;
  }
`;
