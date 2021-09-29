import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export default function DonutChart({
  potential = 0,
  color = "#000000",
  difference = 0,
  reverse = false,
}) {
  let values = {
    value: Math.sign(potential) >= 0 ? potential : Math.abs(potential),
    valuelabel: `USD`,
    size: 230,
    strokewidth: 20,
  };
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const [params, setParams] = useState({});

  useEffect(() => {
    let timeout = setTimeout(() => {
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
      setParams({
        size: values.size,
        halfsize,
        radius,
        trackstyle,
        indicatorstyle,
        rotateval,
      });
    }, 250);
    return () => {
      clearTimeout(timeout);
    };
  }, [potential]);

  return (
    <RelPos>
      <PosDiv color={color} className="donutchart-text">
        <div className="donutchart-text-val">{`You'll gain*`}</div>
        <div
          className={
            difference.toString().length > 6
              ? "donutchart-text-percent smaller-font-2-5"
              : "donutchart-text-percent"
          }
        >
          ${Number(difference)}
        </div>
        <div className="donutchart-text-label">{values.valuelabel}</div>
      </PosDiv>
      <DonutChartSVG
        color={color}
        className={reverse ? `DonutChart reverse` : `DonutChart`}
        width={params.size}
        height={params.size}
      >
        <circle
          r={params.radius}
          cx={params.halfsize}
          cy={params.halfsize}
          transform={params.rotateval}
          style={params.trackstyle}
          className="donutchart-track"
        />
        <circle
          r={params.radius}
          cx={params.halfsize}
          cy={params.halfsize}
          transform={params.rotateval}
          style={params.indicatorstyle}
          className="donutchart-indicator"
        />
      </DonutChartSVG>
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
  z-index: 0;
  text-align: center;
  transform: translateX(-50%) translateY(-50%);
  &.donutchart-text {
    color: #607580;
    @media screen and (max-width: 40rem) {
      width: 100%;
    }
    .donutchart-text-val {
      font-size: 1rem;
      color: #2e2942;
    }
    .donutchart-text-percent {
      color: ${(props) => props.color};
      font-size: 3rem;
      font-weight: bold;
      line-height: 3rem;
      &.smaller-font-2-5 {
        font-size: 2.5rem;
      }
      @media screen and (max-width: 40rem) {
        font-size: 2.5rem;
        line-height: 3rem;
      }
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
    @media screen and (max-width: 40em) {
      stroke-width: 0.7rem;
    }
  }
  .donutchart-indicator {
    fill: transparent;
    stroke-width: 1rem;
    @media screen and (max-width: 40em) {
      stroke-width: 1rem;
    }
    stroke-dasharray: 0 10000;
    transition: stroke-dasharray 0.3s ease;
    @media screen and (max-width: 40rem) {
      transition: none;
    }
  }
  &.reverse {
    display: block;
    transform: scale(-1, 1);
  }
`;
