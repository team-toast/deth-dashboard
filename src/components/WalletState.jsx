import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../styles/flex-grid";
import { useState, useEffect } from "react";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

let web3;

export default function WalletState({
  eTHbalance,
  dETHbalance,
  walletAddress,
  web3,
  dETHtoETHvalue,
  getDETHbalanceFunc,
  getETHbalanceFunc,
  web3Detect,
  setWallet,
}) {
  const [showConnectOptions, setShowConnectOptions] = useState(false);
  return (
    <StyledConnectCol size={1}>
      {!walletAddress && (
        <Wrapper>
          <button onClick={() => setShowConnectOptions(true)}>
            Connect Wallet
          </button>
          <StyledWalletOptions className={showConnectOptions ? "" : "hidden"}>
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
        </Wrapper>
      )}
    </StyledConnectCol>
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

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const StyledConnectCol = styled(Col)`
  text-align: right;
  position: absolute;
  left: 0;
  bottom: 0;
  height: calc(100% - 6rem);
  width: 100%;
  text-align: center;
  backdrop-filter: blur(2px);

  @media screen and (max-width: 40rem) {
    button {
      min-width: 13em;
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
  top: 0;
  right: 0;
  padding: 0.5rem 0 0;
  border-radius: 23px;
  min-width: 14.625em;
  text-align: center;
  box-shadow: 0 0 10px rgb(0 0 0 / 30%);
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

const StyledWalletOptions = styled.div`
  background: #2e2942;
  position: absolute;
  top: 0;
  right: 0;
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
