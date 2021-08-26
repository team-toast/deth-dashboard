import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export default function DonutChart({
  potential = 0,
  color = "#000000",
  difference = 0,
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
        className="DonutChart"
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
        <text
          className="donutchart-text"
          x={halfsize}
          y={halfsize}
          style={{ textAnchor: "middle" }}
        >
          <tspan className="donutchart-text-val" x={halfsize} y={halfsize - 35}>
            {`You'll have*`}
          </tspan>
          <tspan
            className="donutchart-text-percent"
            x={halfsize + 3}
            y={halfsize + 10}
          >
            {difference}
          </tspan>
          <tspan
            className="donutchart-text-label"
            x={halfsize}
            y={halfsize + 35}
          >
            {values.valuelabel}
          </tspan>
        </text>
      </DonutChartSVG>
    );

    setSvg(svgHtml);
  }, [potential]);

  return <div>{svg}</div>;
}

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
    transition: stroke-dasharray 0.3s ease;
  }

  .donutchart-text {
    fill: #607580;
  }
  .donutchart-text-val {
    font-size: 1rem;
    fill: #2e2942;
  }
  .donutchart-text-percent {
    fill: #5987db;
    font-size: 3rem;
  }
  .donutchart-text-label {
    font-size: 1rem;
    fill: #2e2942;
  }
`;
