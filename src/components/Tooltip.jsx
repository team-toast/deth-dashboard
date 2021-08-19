import { useState, useEffect } from "react";
import styled from "styled-components";
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
`;

const ToolTipInfo = styled.div`
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
`;
