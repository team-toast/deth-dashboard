import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export default function DonutChart({
  potential = 0,
  color = "#000000",
  difference = 0,
  reverse = false,
}) {
  const [svg, setSvg] = useState(null);
  let values = {
    value: potential,
    valuelabel: `ETH`,
    size: 230,
    strokewidth: 20,
  };

  useEffect(() => {
    const halfsize = values.size * 0.5;
    const radius = halfsize - values.strokewidth * 0.5;
    const circumference = 2 * Math.PI * radius;
    const strokeval = (values.value * circumference) / 100;
    const dashval = strokeval + " " + circumference;

    const trackstyle = {};
    const indicatorstyle = {
      strokeDasharray: dashval,
      stroke: color,
    };
    const rotateval = "rotate(-90 " + halfsize + "," + halfsize + ")";

    const svgHtml = (
      <DonutChartSVG
        color={color}
        className={reverse ? `DonutChart reverse` : `DonutChart`}
        width={values.size}
        height={values.size}
      >
        <circle
          r={radius}
          cx={halfsize}
          cy={halfsize}
          transform={rotateval}
          style={trackstyle}
          className="donutchart-track"
        />
        <circle
          r={radius}
          cx={halfsize}
          cy={halfsize}
          transform={rotateval}
          style={indicatorstyle}
          className="donutchart-indicator"
        />
      </DonutChartSVG>
    );

    setSvg(svgHtml);
  }, [potential]);

  return (
    <RelPos>
      <PosDiv color={color} className="donutchart-text">
        <div className="donutchart-text-val">{`You'll have*`}</div>
        <div className="donutchart-text-percent">{difference}</div>
        <div className="donutchart-text-label">{values.valuelabel}</div>
      </PosDiv>
      {svg}
    </RelPos>
  );
}

const RelPos = styled.div`
  position: relative;
`;

const PosDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  transform: translateX(-50%) translateY(-50%);
  &.donutchart-text {
    color: #607580;
    .donutchart-text-val {
      font-size: 1rem;
      color: #2e2942;
    }
    .donutchart-text-percent {
      color: ${(props) => props.color};
      font-size: 3rem;
      font-weight: bold;
      line-height: 3rem;
    }
    .donutchart-text-label {
      font-size: 1rem;
      color: #2e2942;
    }
  }
`;

const DonutChartSVG = styled.svg`
  &.DonutChart {
    margin: 0 auto;
    border-radius: 50%;
    display: block;
    font-family: "Helvetica Neue";
  }
  .donutchart-track {
    fill: transparent;
    stroke: #dddddd;
    stroke-width: 0.7rem;
  }
  .donutchart-indicator {
    fill: transparent;
    stroke-width: 1rem;
    stroke-dasharray: 0 10000;
    transition: stroke-dasharray 0.3s ease-in-out;
  }
  &.reverse {
    display: block;
    transform: scale(-1, 1);
  }
`;
