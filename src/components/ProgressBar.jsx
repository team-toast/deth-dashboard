import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export default function ProgressBar({ status, closeBtn }) {
  return (
    <ProgressBarDiv status={status}>
      <Content>{`${status}`}</Content>
      <CloseBtn onClick={closeBtn}>X</CloseBtn>
    </ProgressBarDiv>
  );
}

const CloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: initial;
  padding: 0 1rem;
`;

const Content = styled.div`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 0 1rem;
`;

const ProgressBarDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 2;
  backdrop-filter: blur(2px);
`;
