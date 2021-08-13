import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useScript from "./../lib/useScript";
import styled from "styled-components";
import { Row, Col } from "./../styles/flex-grid";
import { sizes, colors } from "./../styles/styleguide";

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const web3LoadStatus = useScript(
    "https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"
  );
  const connectWallet = () => {
    if (
      typeof window != "undefined" &&
      window.ethereum !== undefined &&
      web3LoadStatus === "ready" &&
      !web3
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
          console.log("newWeb3", newWeb3);
          const accounts = await newWeb3.eth.getAccounts();
          console.log("accounts", accounts);
          setWalletAddress(accounts[0]);
          setWeb3(newWeb3);
        }
      })();
    }
  };
  useEffect(() => {
    if (window.ethereum) {
      // Metamask account change
      window.ethereum.on("accountsChanged", function (accounts) {
        console.log("Metamask account change");
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
        <Row xsNoflex>
          <Col size={1}>[dETH]</Col>
          <StyledConnectCol size={1}>
            {walletAddress ? (
              `Connected ${walletAddress}`
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )}
          </StyledConnectCol>
        </Row>
      </StyledHeader>
    </Layout>
  );
}

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
  height: 5em;
  padding: 0 1em;
`;
