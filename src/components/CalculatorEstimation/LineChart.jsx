import React, { useEffect } from "react";
import { useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import styled from "styled-components";
import MultiRangeSlider from "./MultiRangeSlider";
import "chartjs-adapter-moment";

import { Line } from "react-chartjs-2";

const LineChart = () => {
  const [timestamps, setTimestamps] = useState([]);
  const [exchangeEthData, setExchangeEthData] = useState();
  const [ethPrice, setEthPrice] = useState([]);
  const [dethRedemptionPrice, setDethRedemptionPrice] = useState([]);
  const [startDate, setStartDate] = useState("2021-07-27");
  const [endDate, setEndDate] = useState(timeConverter2(Date.now() / 1000));
  const [finalEthValue, setFinalEthValue] = useState(0);
  const [finalDollarValue, setFinalDollarValue] = useState(0);
  const [percentageDollarGrowth, setPercentageDollarGrowth] = useState(0);
  const [percentageEthGrowth, setPercentageEthGrowth] = useState(0);
  const [finalDollarValueNoDeth, setFinalDollarValueNoDeth] = useState(0);
  const [percentageDollarGrowthNoDeth, setPercentageDollarGrowthNoDeth] =
    useState(0);
  const [buyAmount, setBuyAmount] = useState(1.0);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartLoadingText, setChartLoadingText] = useState("");
  const [minSlider, setMinSlider] = useState(1);
  const [maxSlider, setMaxSlider] = useState(999);
  const [sliderMinAdjust, setSliderMinAdjust] = useState(1);
  const [sliderMaxAdjust, setSliderMaxAdjust] = useState(999);
  const [dontTakeInput, setDontTakeInput] = useState(false);

  const axios = require("axios");

  useEffect(() => {
    clearTimeout(timeout);
    const timeout = setTimeout(() => {
      //if (!dontTakeInput) {
      queryAndProcessData();
      //}
    }, 1000);

    return () => clearTimeout(timeout);
  }, [startDate, endDate, buyAmount]);

  // useEffect(() => {
  //   clearTimeout(timeout);
  //   const timeout = setTimeout(() => {
  //     setDontTakeInput(false);
  //   }, 1000);

  //   return () => clearTimeout(timeout);
  // }, [dontTakeInput]);

  useEffect(() => {
    let minRatio = minSlider / 1000;
    let maxRatio = maxSlider / 1000;

    let minDateIndex = Math.round(minRatio * timestamps.length);
    let minDate = timestamps[minDateIndex];
    let maxDateIndex = Math.round(maxRatio * timestamps.length);
    let maxDate = timestamps[maxDateIndex];

    // Change date format
    if (minDate && maxDate) {
      let tmpMinDate = minDate.substr(0, minDate.indexOf(" "));
      let tmpMinDateArr = tmpMinDate.split("/");

      let tmpMaxDate = maxDate.substr(0, maxDate.indexOf(" "));
      let tmpMaxDateArr = tmpMaxDate.split("/");

      for (let i = 0; i < tmpMaxDateArr.length; i++) {
        if (tmpMaxDateArr[0].length === 1) {
          tmpMaxDateArr[0] = "0" + tmpMaxDateArr[0];
        }
        if (tmpMaxDateArr[1].length === 1) {
          tmpMaxDateArr[1] = "0" + tmpMaxDateArr[1];
        }
        if (tmpMinDateArr[0].length === 1) {
          tmpMinDateArr[0] = "0" + tmpMinDateArr[0];
        }
        if (tmpMinDateArr[1].length === 1) {
          tmpMinDateArr[1] = "0" + tmpMinDateArr[1];
        }
      }

      let minChangedFormat =
        tmpMinDateArr[2] + "-" + tmpMinDateArr[1] + "-" + tmpMinDateArr[0];

      let maxChangedFormat =
        tmpMaxDateArr[2] + "-" + tmpMaxDateArr[1] + "-" + tmpMaxDateArr[0];

      setStartDate(minChangedFormat);
      setEndDate(maxChangedFormat);
    }
  }, [minSlider, maxSlider]);

  const toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
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
      setDontTakeInput(true);

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
      setChartLoading(true);
      setChartLoadingText("Calculating...");
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
      let tmpStringDates = [];
      for (var i = 0; i < priceData.data.length - 1; i++) {
        tmpDethRedemptionPrice.push(NaN);
        tmpEthPrices.push(priceData.data[i]["close"] * buyAmount);
        tmpDates.push(parseInt(priceData.data[i]["date"]));
        tmpStringDates.push(timeConverter(parseInt(priceData.data[i]["date"])));
      }

      console.log("First number of stamps: ", priceData.data.length);

      let finalRedemptionValue = 0;
      let redemptionValue = 0;
      let startEthValue = 0;
      let finalEthValue = 0;
      let startValue = 0;
      let tmpStartIndex = 0;
      let tmpEndIndex = priceData.data.length - 1;
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
            tmpEndIndex = k;

            if (i === 0) {
              startEthValue = tmpEthPrices[k];
              console.log("Start Eth value found");
              tmpStartIndex = k;
            }

            startValue = i;
            break;
          }
        }
      }
      console.log("End merge");

      // Set Slider values
      let startValueSlider = Math.round(
        (tmpStartIndex / (priceData.data.length - 1)) * 1000
      );
      let endValueSlider = Math.round(
        (tmpEndIndex / (priceData.data.length - 1)) * 1000 + 5
      );
      if (endValueSlider > 999) {
        endValueSlider = 999;
      }

      setSliderMinAdjust(startValueSlider);
      setSliderMaxAdjust(endValueSlider);

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
      setTimestamps(tmpStringDates);
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

      setChartLoading(false);
      setChartLoadingText("");
    } catch (error) {
      console.error(error);
      setChartLoading(false);
      setChartLoadingText("An error has occurred.");
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
        <input
          type="number"
          id="ethAmount"
          name="ethAmount"
          defaultValue={1.0}
          onChange={(e) => {
            setBuyAmount(e.target.value);
            console.log(e.target.value);
          }}
        ></input>
        {" ETH into dETH on "}

        <input
          type="date"
          id="startDate"
          name="startDate"
          max={endDate}
          min={"2021-07-27"}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);

            console.log("Start Date: ", e.target.value);
          }}
          disabled={chartLoading}
        ></input>
        {" and withdrew on "}

        <input
          type="date"
          id="endDate"
          name="endDate"
          min={startDate}
          max={timeConverter2(Date.now() / 1000)}
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            console.log(e.target.value);
          }}
          disabled={chartLoading}
        ></input>
        {" my position value would be: "}

        <br></br>
        <br></br>
        <LoadingOverlay
          active={chartLoading}
          spinner={chartLoadingText !== "An Error Occurred."}
          text={chartLoadingText}
          fadeSpeed={1000}
          styles={{
            overlay: (base) => ({
              ...base,
              background: "rgba(150, 150, 150, 0.5)",
              zIndex: 0,
            }),
          }}
        >
          <div>
            <h3>Performance Summary</h3>
            <p>
              Final ETH amount: {finalEthValue.toFixed(2)} ({" "}
              {percentageEthGrowth.toFixed(2)}% Growth)
              <br></br>
              Final Dollar amount: ${finalDollarValue.toFixed(2)} (
              {percentageDollarGrowth.toFixed(2)}% Growth)
              <br></br>
              If you only held ETH: ${finalDollarValueNoDeth.toFixed(2)} (
              {percentageDollarGrowthNoDeth.toFixed(2)}% Growth)
            </p>
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
                      borderColor: "rgb(0, 0, 0)",
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
      <SliderDiv>
        <MultiRangeSlider
          min={0}
          max={999}
          minSet={sliderMinAdjust}
          maxSet={sliderMaxAdjust}
          onChange={({ min, max }) => {
            setMaxSlider(max);
            setMinSlider(min);
          }}
          disable={chartLoading}
        />
      </SliderDiv>
    </div>
  );
};

export default LineChart;

const BodyDiv = styled.div`
  align-items: center;
  text-align: center;
`;

const SliderDiv = styled.div`
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-left: 50px;
  position: relative;
`;
