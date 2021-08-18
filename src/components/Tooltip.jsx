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
      {showToolTip && <ToolTipInfo>{children}</ToolTipInfo>}
    </TooltipBody>
  );
}

const TooltipBody = styled.div`
  position: relative;
  display: inline-block;
`;

const ToolTipInfo = styled.div`
  background: #ffffff;
  box-shadow: 0px 3px 20px #0000001a;
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
