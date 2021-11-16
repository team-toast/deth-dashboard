import React, { useEffect } from "react";
import { useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import styled from "styled-components";
import "chartjs-adapter-moment";

import { Row, Col } from "./../../styles/flex-grid";

import { Line } from "react-chartjs-2";

const LineChart = () => {
  const [timestamps, setTimestamps] = useState([]);
  const [currentDate, setCurrentDate] = useState("2021-11-08");
  const [exchangeEthData, setExchangeEthData] = useState();
  const [ethPrice, setEthPrice] = useState([]);
  const [dethRedemptionPrice, setDethRedemptionPrice] = useState([]);
  const [startDate, setStartDate] = useState("2021-07-27");
  const [endDate, setEndDate] = useState("2021-11-09");
  const [finalEthValue, setFinalEthValue] = useState(0);
  const [finalDollarValue, setFinalDollarValue] = useState(0);
  const [percentageDollarGrowth, setPercentageDollarGrowth] = useState(0);
  const [percentageEthGrowth, setPercentageEthGrowth] = useState(0);
  const [finalDollarValueNoDeth, setFinalDollarValueNoDeth] = useState(0);
  const [percentageDollarGrowthNoDeth, setPercentageDollarGrowthNoDeth] =
    useState(0);
  const [buyAmount, setBuyAmount] = useState(1.0);
  const [chartLoading, setChartLoading] = useState("");
  const [firstEndDateSet, setFirstEndDateSet] = useState(false);

  const axios = require("axios");

  useEffect(() => {
    clearTimeout(timeout);
    const timeout = setTimeout(() => {
      queryAndProcessData();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [startDate, endDate, buyAmount]);

  const toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  const viewRange = () => {
    queryAndProcessData();
  };

  const makeBatchQuery = (fromTimeStamp) => {
    return `{
        dataPoints(first: 1000, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: "${fromTimeStamp}" }) {
            id
            ethRedeemablePerDeth
            dethRedeemablePerEth
            timestamp
        }
    }`;
  };

  const queryAndProcessData = async () => {
    try {
      let tmpCurrentDate = timeConverter2(Date.now() / 1000);
      //tmpCurrentDate = tmpCurrentDate.substr(0, tmpCurrentDate.indexOf(" "));
      setCurrentDate(tmpCurrentDate);
      console.log("Current Date: ", tmpCurrentDate);

      if (!firstEndDateSet) {
        setEndDate(tmpCurrentDate);
        setFirstEndDateSet(true);
      }

      let url =
        "https://api.thegraph.com/subgraphs/name/coinop-logan/deth-stats";
      let startTimestamp = toTimestamp(startDate);
      let endTimestamp = toTimestamp(endDate);

      console.log("Start Time: ", startTimestamp);
      console.log("End Time: ", endTimestamp);

      let dethBought = 0;
      let tmpTimeStamps = [];
      let tmpEthRate = [];
      let tmpDethRate = [];
      let nextTimestamp = startTimestamp;
      let endFound = false;

      // Query the graph api for deth stats
      setChartLoading("Calculating...");
      while (!endFound) {
        let graphQuery = makeBatchQuery(nextTimestamp);
        const result = await axios.post(url, { query: graphQuery });

        let dataPoints = result.data.data.dataPoints;
        for (let i = 0; i < dataPoints.length - 1; i++) {
          tmpEthRate.push(dataPoints[i].ethRedeemablePerDeth / 10 ** 18);
          tmpDethRate.push(dataPoints[i].dethRedeemablePerEth / 10 ** 18);
          tmpTimeStamps.push(dataPoints[i].timestamp);
          if (dataPoints[i].timestamp >= toTimestamp(endDate)) {
            break;
          }
        }

        console.log("Datapoints length: ", dataPoints.length);

        if (dataPoints.length < 1000) {
          endFound = true;
        } else {
          if (
            endDate !== "" &&
            tmpTimeStamps[tmpTimeStamps.length - 1] > toTimestamp(endDate)
          ) {
            break;
          }
          nextTimestamp = dataPoints[dataPoints.length - 1].timestamp;
        }
      }

      dethBought = tmpDethRate[0] * buyAmount;
      console.log("buyAmount: ", buyAmount);
      console.log("Eth rate: ", tmpEthRate);
      console.log("timestamps: ", tmpTimeStamps);
      console.log("Deth Bought", dethBought);

      let tmpEthPrices = [];
      let tmpDethRedemptionPrice = [];
      let startTimeStamp = "1627344000";
      let endTimeStamp = "9999999999";

      // query eth price data from exchange
      let priceData = null;
      if (!exchangeEthData) {
        console.log("Getting exchange data");
        priceData = await axios.get(
          "https://poloniex.com/public?command=returnChartData&currencyPair=USDT_ETH&start=" +
            startTimeStamp +
            "&end=" +
            endTimeStamp +
            "&period=14400"
        );

        setExchangeEthData(priceData);
      } else {
        console.log("Already got exchange data");
        priceData = exchangeEthData;
      }

      // Merge ETH price data from exchange with timestamps from the graph deth query
      console.log("Starting merge");

      let tmpDates = [];
      for (var i = 0; i < priceData.data.length - 1; i++) {
        tmpDethRedemptionPrice.push(NaN);
        tmpEthPrices.push(priceData.data[i]["close"] * buyAmount);
        tmpDates.push(parseInt(priceData.data[i]["date"]));
      }

      console.log("First number of stamps: ", priceData.data.length);

      let finalRedemptionValue = 0;
      let redemptionValue = 0;
      let startEthValue = 0;
      let finalEthValue = 0;
      let startValue = 0;
      for (var k = 0; k < priceData.data.length - 1; k++) {
        for (var i = startValue; i < tmpTimeStamps.length - 1; i++) {
          if (
            parseInt(tmpTimeStamps[i]) >= parseInt(priceData.data[k]["date"]) &&
            parseInt(tmpTimeStamps[i]) <=
              parseInt(priceData.data[k + 1]["date"])
          ) {
            redemptionValue =
              parseFloat(priceData.data[k]["close"]) *
              parseFloat(tmpEthRate[i] * dethBought);
            tmpDethRedemptionPrice[k] = redemptionValue;
            //console.log(i);

            finalRedemptionValue = redemptionValue;
            finalEthValue = tmpEthPrices[k];

            if (i === 0) {
              startEthValue = tmpEthPrices[k];
              console.log("Start Eth value found");
            }

            startValue = i;
            break;
          }
        }
      }
      console.log("End merge");

      console.log("Number of stamps", tmpTimeStamps.length);

      // Set graph data

      let tmpEthObjects = [];
      let tmpDethRedemptionObjects = [];
      for (let i = 0; i < tmpDates.length; i++) {
        tmpEthObjects.push({
          x: parseInt(tmpDates[i] * 1000),
          y: tmpEthPrices[i],
        });
        tmpDethRedemptionObjects.push({
          x: parseInt(tmpDates[i] * 1000),
          y: tmpDethRedemptionPrice[i],
        });
      }
      setEthPrice(tmpEthObjects);
      setDethRedemptionPrice(tmpDethRedemptionObjects);
      // Calculate final postion/growth values

      console.log("Eth end Price: ", finalEthValue);

      let endEthPosition = finalRedemptionValue / (finalEthValue / buyAmount);

      setFinalEthValue(endEthPosition);

      setFinalDollarValue(finalRedemptionValue);

      setPercentageEthGrowth(
        (finalRedemptionValue / finalEthValue - 1) * 100.0
      );

      setPercentageDollarGrowth(
        (finalRedemptionValue / startEthValue - 1) * 100.0
      );

      setFinalDollarValueNoDeth(finalEthValue);

      setPercentageDollarGrowthNoDeth(
        (finalEthValue / startEthValue - 1) * 100.0
      );

      setChartLoading("");
    } catch (error) {
      console.error(error);
      setChartLoading("An Error Occurred.");
    }
  };

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = "0" + a.getHours();
    var min = "0" + a.getMinutes();
    var date = date + "/" + month + "/" + year;
    var time = hour.toString().substr(-2) + ":" + min.toString().substr(-2);

    return date + " " + time;
  }

  function timeConverter2(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = "0" + a.getDate();
    var date = year + "-" + month + "-" + date.toString().substr(-2);

    return date;
  }

  return (
    <div>
      <BodyDiv>
        {"If I deposited "}
        <StyledInput
          type="number"
          id="ethAmount"
          name="ethAmount"
          className="input"
          defaultValue={1.0}
          onChange={(e) => {
            setBuyAmount(e.target.value);
            console.log(e.target.value);
          }}
        ></StyledInput>
        {" ETH into dETH on "}

        <StyledInput
          className="input"
          type="date"
          id="startDate"
          name="startDate"
          max={endDate}
          min={"2021-07-27"}
          defaultValue={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            console.log(e.target.value);
          }}
        ></StyledInput>
        {" and withdrew on "}

        <StyledInput
          className="input"
          type="date"
          id="endDate"
          name="endDate"
          min={startDate}
          max={currentDate}
          defaultValue={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            console.log(e.target.value);
          }}
        ></StyledInput>
        {" my position value would be: "}
        {/* <br></br>
        <br></br>
        <button onClick={viewRange}>Calculate</button> */}

        <br></br>
        <br></br>
        <LoadingOverlay
          active={chartLoading}
          spinner={chartLoading !== "An Error Occurred."}
          text={chartLoading}
          fadeSpeed="1000"
          styles={{
            overlay: (base) => ({
              ...base,
              background: "rgba(150, 150, 150, 0.5)",
              zIndex: 0,
            }),
          }}
        >
          <div>
            <EarningsRow className="text-left margin-bottom-2" xsNoflex>
              <Col size={"0 0 auto"} className="margin-bottom-1 margin-right-2">
                <StyledEthImg></StyledEthImg>
                <strong>Ethereum</strong>
                <br />
                <span>from dETH</span>
              </Col>
              <Col size={"0 0 auto"} className="margin-bottom-1 margin-right-2">
                <strong>
                  {finalEthValue.toFixed(2)} ({percentageEthGrowth.toFixed(2)}%
                  Growth)
                </strong>
                <br />
                Final ETH amount
              </Col>
              <Col size={"0 0 auto"} className="margin-bottom-1 margin-right-2">
                <strong>
                  ${finalDollarValue.toFixed(2)} (
                  {percentageDollarGrowth.toFixed(2)}% Growth)
                </strong>
                <br />
                Final Dollar amount
              </Col>
              <Col size={"0 0 auto"} className="margin-bottom-1 margin-right-2">
                <strong>
                  ${finalDollarValueNoDeth.toFixed(2)} (
                  {percentageDollarGrowthNoDeth.toFixed(2)}% Growth)
                </strong>
                <br />
                If you only held ETH
              </Col>
            </EarningsRow>
          </div>
          <div>
            <div>
              <Line
                data={{
                  //labels: timestamps,
                  datasets: [
                    {
                      label: "ETH Position",
                      data: ethPrice,
                      borderColor: "rgb(0, 192, 0)",
                      borderWidth: 2,
                      fill: false,
                      pointRadius: 0,
                      pointHitRadius: 20,
                    },
                    {
                      label: "dETH Position",
                      data: dethRedemptionPrice,
                      borderColor: "#2E2942",
                      borderWidth: 3,
                      fill: false,
                      pointRadius: 0,
                      pointHitRadius: 20,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,

                  scales: {
                    xAxis: {
                      type: "time",
                      time: {
                        unit: "month",
                      },
                    },
                    y: {
                      ticks: {
                        callback: function (value, index, values) {
                          return "$" + value;
                        },
                      },
                    },
                  },
                }}
                height={350}
              />
            </div>
          </div>
        </LoadingOverlay>
      </BodyDiv>
    </div>
  );
};

export default LineChart;

const StyledEthImg = styled.div`
  background: #2e2942 url(/ethereum-brands.svg) no-repeat center;
  height: 35px;
  width: 35px;
  float: left;
  margin-right: 1rem;
  background-size: 16px;
  border-radius: 100%;
`;

const EarningsRow = styled(Row)`
  justify-content: center;
  strong {
    font-size: 18px;
  }
`;

const StyledInput = styled.input`
  margin-top: 1rem;
  margin-bottom: 2rem;
  &:disabled {
    cursor: not-allowed;
    background: #f3f3f3;
  }
  &.slider {
    -webkit-appearance: none;
    background: #dddddd;
    height: 0.32rem;
    margin-top: 0rem;
    margin-bottom: 0.8rem;
    position: relative;
    &:after {
      content: " ";
      width: 6px;
      height: 30px;
      border-radius: 3px;
      background: #dddddd;
      position: absolute;
      left: 50%;
      z-index: 0;
      margin-left: -2px;
      margin-top: -10px;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #5987db;
      cursor: pointer;
      transition: all 0.25s ease;
      z-index: 1;
      position: relative;
      &:active {
        cursor: grabbing;
        transition: all 0.25s ease;
        box-shadow: 0 0 40px 10px #5987db;
        @media screen and (max-width: 40rem) {
          box-shadow: none;
        }
      }
    }
    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #5987db;
      cursor: pointer;
      border-radius: 0;
    }
  }
  &.input {
    line-height: 48px;
    padding: 0 1rem;
    font-size: 1rem;
    border-radius: 5px;
    border: solid 1px #dddddd;
    color: #2e2942;
  }
`;

const BodyDiv = styled.div`
  align-items: center;
  text-align: center;
`;
