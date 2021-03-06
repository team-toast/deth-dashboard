import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useScript from "./../lib/useScript";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../styles/flex-grid";
import { sizes, colors } from "./../styles/styleguide";
import CONTRACT_ABI from "./../lib/abi_2021_02_25.json";
import axios from "axios";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

import ProgressBar from "./../components/ProgressBar";
import CalculatorEstimate from "../components/CalculatorEstimation";
import Calculator from "./../components/Calculator";
import Media from "./../components/Media";

let web3;

export default function Home({ ethPrice }) {
  const [wallet, setWallet] = useState(null);
  const [web3Obj, setWeb3Obj] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [dETHbalance, setDETHbalance] = useState(null);
  const [eTHbalance, setETHbalance] = useState(0);
  const [dETHtoETHvalue, setDETHtoETHvalue] = useState(0);
  const [showConnectOptions, setShowConnectOptions] = useState(false);
  const [web3Detect, setWeb3Detect] = useState(false);
  const [showDisconnectWallet, setShowDisconnectWallet] = useState(false);
  const [wrongChain, setWrongChain] = useState(false);
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false);
  useEffect(() => {
    if (typeof window != "undefined" && !web3) {
      if (window.ethereum !== undefined) {
        setWeb3Detect(true);
      }
      connectSelectedWallet();
    }
  }, [wallet]);
  const connectSelectedWallet = async () => {
    console.log("connectSelectedWallet");
    if (wallet === "metamask") {
      try {
        const newWeb3 = await new Web3(window.ethereum);
        web3 = newWeb3;
        setWeb3Obj(web3);
        connectWallet();
      } catch (error) {
        setWallet(null);
        web3 = false;
        setWeb3Obj(null);
        console.log("Could not connect Web3");
      }
    } else if (wallet === "walletconnect") {
      try {
        const provider = new WalletConnectProvider({
          rpc: {
            1: process.env.ETH_RPC,
          },
        });
        await provider.enable();
        const newWeb3 = await new Web3(provider);
        web3 = newWeb3;
        setWeb3Obj(web3);
        const accounts = await web3.eth.getAccounts();
        console.log(56, accounts);
        connectWallet();
      } catch (error) {
        setWallet(null);
        web3 = false;
        setWeb3Obj(null);
        console.log("Could not connect Web3");
      }
    }
  };
  const disconnectWallet = () => {
    // setWeb3(null);
    setWalletAddress(null);
  };
  const disconnectWalletConnect = () => {
    localStorage.removeItem("walletconnect");
    web3 = null;
    setWeb3Obj(null);
    setWalletAddress(null);
    setWallet(null);
    setDETHbalance(null);
    setDETHtoETHvalue(0);
    setETHbalance(0);
  };
  const connectWallet = () => {
    console.log(66, `connectWallet`);
    if (typeof window != "undefined" && web3) {
      (async () => {
        console.log("Startup, test eth_requestAccounts");
        let testPassed = false;
        if (wallet === "metamask") {
          try {
            const sendTest = await window.ethereum.send("eth_requestAccounts");
            console.log("sendTest", sendTest);
            testPassed = true;
          } catch (error) {
            setWallet(null);
            web3 = false;
            setWeb3Obj(null);
            console.log("sendTest Error: ", error);
          }
        }

        if (testPassed || wallet === "walletconnect") {
          console.log("updating web3");
          // const newWeb3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          console.log("accounts", accounts);
          setWalletAddress(accounts[0]);
          await getDETHbalance(accounts[0]);
          await getETHbalance(accounts[0]);
        }
      })();
    }
  };
  useEffect(() => {
    if (web3Obj !== null) {
      web3Obj.eth.getChainId().then((chainID) => {
        // Detect which blockchain MM is connected to. ID 1 means Ethereum
        if (chainID == 1) {
          setWrongChain(false);
        } else {
          setWrongChain(true);
        }
      });
    }
  }, [web3, web3Obj, walletAddress]);
  const getDETHtoETHValue = async (data) => {
    let new_contract = await new web3.eth.Contract(
      CONTRACT_ABI,
      process.env.ETH_CONTRACT_ADDRESS
    );
    const balanceOfDETH = await new_contract.methods
      .calculateRedemptionValue(data)
      .call();
    setDETHtoETHvalue(balanceOfDETH);
  };
  const getDETHbalance = async (data) => {
    console.log(104, web3, web3Obj);
    let new_contract;
    try {
      if (web3 === undefined) {
        new_contract = await new web3Obj.eth.Contract(
          CONTRACT_ABI,
          process.env.ETH_CONTRACT_ADDRESS
        );
      } else {
        new_contract = await new web3.eth.Contract(
          CONTRACT_ABI,
          process.env.ETH_CONTRACT_ADDRESS
        );
      }
      const balanceOfDETH = await new_contract.methods.balanceOf(data).call();
      setDETHbalance(web3?.utils?.fromWei(balanceOfDETH));
      await getDETHtoETHValue(balanceOfDETH);
    } catch (error) {
      console.log("Unable to connect to wallet.", error);
    }
  };

  const getETHbalance = async (data) => {
    const getBalance = await web3?.eth?.getBalance(data);
    const getWeiValue = await web3?.utils?.fromWei(getBalance.toString());
    //  Get Chain Id
    console.log("ETH Balance", getWeiValue);
    setETHbalance(getWeiValue);
  };
  useEffect(() => {
    if (window.ethereum) {
      // Metamask account change
      window.ethereum.on("accountsChanged", function (accounts) {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          // setWeb3(null);
          localStorage.removeItem("walletconnect");
          web3 = null;
          setWeb3Obj(null);
          setWalletAddress(null);
          setWallet(null);
          setDETHbalance(null);
          setDETHtoETHvalue(0);
          setETHbalance(0);
        }
      });
      // Network account change
      window.ethereum.on("chainChanged", function (networkId) {
        console.log(157, networkId);
        if (networkId === "0x1") {
          setWrongChain(false);
        } else {
          setWrongChain(true);
        }
      });
    } else {
      console.warn("No web3 detected.");
    }
  }, []);
  const shortenAddress = (data) => {
    const first = data.slice(0, 6);
    const last = data.slice(data.length - 4, data.length);
    return `${first}...${last}`;
  };
  return (
    <Layout>
      {wrongChain !== false && (
        <ProgressBar
          status={`Wrong chain, please switch to Ethereum Mainnet${
            wallet === "walletconnect" ? " and refresh." : "."
          }`}
          closeBtn={() => setWrongChain(false)}
        ></ProgressBar>
      )}
      <StyledHeader>
        <Row>
          <ColLogo>
            <StyledImg src="/deth-logo-svg.svg" alt="dETH LOGO" />
          </ColLogo>
          <Col
            className={
              toggleMobileMenu ? "menu-item show-menu-item" : "menu-item"
            }
            size={1}
          >
            <a className="menu-item-links" href="https://levr.ly">
              Home/About
            </a>
            <div className="menu-item-links dropdown-links">
              <a>Social Media</a>
              <div className="dropdown">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://medium.com/levr-ly"
                >
                  Medium
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://twitter.com/levr_ly"
                >
                  Twitter
                </a>
                <a target="_blank" rel="noreferrer" href="https://t.me/levrly">
                  Telegram
                </a>
              </div>
            </div>
          </Col>
          <Col hidesm hidexs size={1}>
            <StyledSpan></StyledSpan>
          </Col>
          <StyledConnectCol size={1}>
            {walletAddress ? (
              <ConnectedDiv title={walletAddress}>
                <div>
                  <StyledOnIcon></StyledOnIcon>
                  <strong onClick={() => setShowDisconnectWallet(true)}>
                    Connected to
                  </strong>
                  <DisconnectWallet
                    className={showDisconnectWallet ? "" : "hidden"}
                  >
                    <div>
                      <button onClick={disconnectWalletConnect}>
                        Disconnect
                      </button>
                    </div>
                    <button
                      className="close-btn"
                      onClick={() => setShowDisconnectWallet(false)}
                    >
                      X
                    </button>
                  </DisconnectWallet>
                </div>
                <EllipsisSpan>{shortenAddress(walletAddress)}</EllipsisSpan>
              </ConnectedDiv>
            ) : (
              <div>
                <button onClick={() => setShowConnectOptions(true)}>
                  Connect Wallet
                </button>
                <StyledWalletOptions
                  className={showConnectOptions ? "" : "hidden"}
                >
                  {web3Detect && (
                    <div>
                      <button
                        className="metamask"
                        onClick={() => setWallet("metamask")}
                      >
                        MetaMask
                      </button>
                    </div>
                  )}
                  <div>
                    <button
                      className="walletconnect"
                      onClick={() => setWallet("walletconnect")}
                    >
                      WalletConnect
                    </button>
                  </div>
                  <button
                    className="close-btn"
                    onClick={() => setShowConnectOptions(false)}
                  >
                    X
                  </button>
                </StyledWalletOptions>
              </div>
            )}
          </StyledConnectCol>
          <MobileMenuCol size={1}>
            <StyledHamburgerMenu
              toggleMobileMenu={toggleMobileMenu}
              onClick={() => setToggleMobileMenu(!toggleMobileMenu)}
            >
              <span></span>
              <span></span>
              <span></span>
            </StyledHamburgerMenu>
          </MobileMenuCol>
        </Row>
      </StyledHeader>
      <CalculatorEstimate ethPriceWeb={ethPrice} />
      <Calculator
        eTHbalance={eTHbalance}
        dETHbalance={dETHbalance}
        walletAddress={walletAddress}
        web3={web3Obj}
        web3Detect={web3Detect}
        dETHtoETHvalue={dETHtoETHvalue}
        getDETHbalanceFunc={() => getDETHbalance(walletAddress)}
        getETHbalanceFunc={() => getETHbalance(walletAddress)}
        wrongChain={wrongChain}
        setWallet={setWallet}
      />
      <Media></Media>
    </Layout>
  );
}

const ColLogo = styled(Col)`
  padding-right: 2rem;
`;

const MobileMenuCol = styled(Col)`
  @media screen and (min-width: 40rem) {
    display: none;
  }
`;

const StyledHamburgerMenu = styled.div`
  position: relative;
  margin: auto;
  height: 3.5em;
  width: 3.5em;
  background: none;
  cursor: pointer;
  span {
    display: block;
    height: 5px;
    width: 35px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.87);
    position: absolute;
    left: 10px;
    top: 10px;
    transition: all 0.25s ease;
    &:nth-child(1) {
      transform: ${(props) =>
        props.toggleMobileMenu ? "rotateZ(45deg)" : "initial"};
      top: ${(props) => (props.toggleMobileMenu ? "25px" : "15px")};
    }
    &:nth-child(2) {
      top: 27px;
      display: ${(props) => (props.toggleMobileMenu ? "none" : "block")};
    }
    &:nth-child(3) {
      top: ${(props) => (props.toggleMobileMenu ? "25px" : "39px")};
      transform: ${(props) =>
        props.toggleMobileMenu ? "rotateZ(135deg)" : "initial"};
    }
  }
  @media screen and (min-width: 40em) {
    display: none;
  }
`;

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

const DisconnectWallet = styled.div`
  background: #2e2942;
  position: absolute;
  top: 6px;
  right: 3px;
  padding: 0.5rem 0 0;
  border-radius: 23px;
  min-width: 14.625em;
  text-align: center;
  box-shadow: 0 0 10px rgb(0 0 0 / 30%);
  z-index: 1;
  button {
    margin-bottom: 0.5rem;
    text-align: center;
    padding-left: 0;
    &.metamask {
      background: #fff url(/metamask.png) no-repeat;
      background-size: 20px;
      background-position: 17px;
      &:hover {
        background-color: #db596d;
      }
    }
    &.walletconnect {
      background: #fff url(/walletConnect.svg) no-repeat;
      background-size: 20px;
      background-position: 17px;
      &:hover {
        background-color: #db596d;
      }
    }
  }
  .close-btn {
    position: absolute;
    left: -25px;
    bottom: -28px;
    min-width: initial;
    padding: 0 1rem;
  }
  &.hidden {
    display: none;
  }
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
  @media screen and (max-width: 40rem) {
    button {
      min-width: 13em;
    }
  }
`;

const StyledWalletOptions = styled.div`
  background: #2e2942;
  position: absolute;
  top: 6px;
  right: 3px;
  padding: 0.5rem 0 0;
  border-radius: 23px;
  min-width: 14.625em;
  text-align: center;
  box-shadow: 0 0 10px rgb(0 0 0 / 30%);
  button {
    margin-bottom: 0.5rem;
    text-align: left;
    padding-left: 3rem;
    &.metamask {
      background: #fff url(/metamask.png) no-repeat;
      background-size: 20px;
      background-position: 17px;
      &:hover {
        background-color: #db596d;
      }
    }
    &.walletconnect {
      background: #fff url(/walletConnect.svg) no-repeat;
      background-size: 20px;
      background-position: 17px;
      &:hover {
        background-color: #db596d;
      }
    }
  }
  .close-btn {
    position: absolute;
    left: -25px;
    bottom: -28px;
    min-width: initial;
    padding: 0 1rem;
  }
  &.hidden {
    display: none;
  }
  @media screen and (max-width: 40rem) {
    right: initial;
    left: 50%;
    transform: translateX(-50%);
    button {
      min-width: 92%;
    }
  }
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
  z-index: 4;
  padding: 0.5em 1em;
  box-shadow: 0px 3px 20px #0000001a;
  > div {
    align-items: center;
  }
  @media screen and (max-width: 40rem) {
    padding-right: 0;
  }
  .dropdown-links {
    position: relative;
    .dropdown {
      opacity: 0;
      visibility: hidden;
      position: absolute;
      width: 200px;
      background: #fff;
      box-shadow: 0 11px 10px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 5px 5px;
      top: 30px;
      a {
        display: block;
        width: 100%;
        padding: 0.5rem 1rem;
        text-decoration: none;
        font-weight: normal;
        &:hover {
          background: #f1f1f3;
        }
        &:last-child {
          padding-bottom: 1rem;
        }
      }
    }
    &:hover {
      .dropdown {
        transition: all 0.25s ease;
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .menu-item {
    .menu-item-links {
      display: inline-block;
      text-decoration: none;
      font-weight: bold;
      &:hover,
      > a:hover {
        color: #5987db;
        transition: color 0.15s;
      }
    }
    @media screen and (max-width: 40rem) {
      position: absolute;
      top: 69px;
      left: 0;
      width: 100%;
      background: white;
      height: 100vh;
      padding-right: 1.5rem;
      display: none;
      .dropdown-links {
        a {
          display: block;
        }
        > a {
          padding-bottom: 1rem;
          padding-top: 1rem;
        }
        .dropdown {
          opacity: 1;
          visibility: visible;
          width: 100%;
          box-shadow: none;
          position: relative;
          top: 0;
          padding: 0 0 1rem;
          a {
            font-weight: normal;
            padding-right: 0;
          }
        }
      }
      &.show-menu-item {
        left: 0;
        transition: all 0.25s ease;
        display: block;
      }
      .menu-item-links {
        text-decoration: none;
        display: block;
        text-align: right;
        padding: 17px 0;
        margin: 0;
        border-bottom: solid 2px #f7f7f7;
        font-weight: bold;
        &:last-child {
          border-bottom: none;
        }
        > a {
          font-weight: bold;
        }
      }
      .dropdown-links {
        padding: 0;
        a {
          margin: 0;
        }
      }
    }
    a {
      margin-right: 1rem;
      padding: 1rem 0;
      cursor: pointer;
    }
  }
`;

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=20, stale-while-revalidate=59"
  );
  const ethPrice = await axios(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD`
  );
  return {
    props: {
      ethPrice: ethPrice.data.USD ? ethPrice.data.USD : "3000",
    },
  };
}
