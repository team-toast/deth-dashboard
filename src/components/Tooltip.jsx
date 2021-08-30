import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../styles/flex-grid";

export default function Tooltip({ title = null, children = null }) {
  const [showToolTip, setShowToolTip] = useState(false);
  return (
    <TooltipBody onClick={() => setShowToolTip(!showToolTip)}>
      <div
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      ></div>
      {showToolTip && (
        <ToolTipOverlay onClick={() => setShowToolTip(!showToolTip)} />
      )}
      {showToolTip && <ToolTipInfo>{children}</ToolTipInfo>}
      {showToolTip && <div className="arrow-down"></div>}
    </TooltipBody>
  );
}

const ToolTipOverlay = styled.div`
  background: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TooltipBody = styled.div`
  position: relative;
  display: inline-block;
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #ffffff;
    position: absolute;
    left: 50%;
    margin-left: 34px;
    top: -10px;
  }
`;

const ShiftUp = keyframes`
  0% {
    bottom: 36px;
  }
  100% {
    bottom: 33px;
    opacity: 1;
  }
`;

const ToolTipInfo = styled.div`
  opacity: 0;
  background: #ffffff;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.2);
  position: absolute;
  border-radius: 5px;
  width: 600px;
  max-width: 230px;
  padding: 1em;
  font-size: 0.8em;
  line-height: 1.6em;
  text-align: left;
  bottom: 33px;
  left: -65px;
  animation: 0.15s ${ShiftUp} forwards;
`;
