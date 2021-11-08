import React, { useEffect } from "react";
import { useState } from "react";
import LoadingOverlay from "react-loading-overlay";

import { Line } from "react-chartjs-2";

const LineChart = () => {
  const [timestamps, setTimestamps] = useState([]);
  const [exchangeEthData, setExchangeEthData] = useState();
  const [ethPrice, setEthPrice] = useState([]);
  const [dethRedemptionPrice, setDethRedemptionPrice] = useState([]);
  const [startDate, setStartDate] = useState("2021-09-29");
  const [endDate, setEndDate] = useState("2021-10-17");
  const [finalEthValue, setFinalEthValue] = useState(0);
  const [finalDollarValue, setFinalDollarValue] = useState(0);
  const [percentageDollarGrowth, setPercentageDollarGrowth] = useState(0);
  const [percentageEthGrowth, setPercentageEthGrowth] = useState(0);
  const [finalDollarValueNoDeth, setFinalDollarValueNoDeth] = useState(0);
  const [percentageDollarGrowthNoDeth, setPercentageDollarGrowthNoDeth] =
    useState(0);
  const [buyAmount, setBuyAmount] = useState(1.0);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(false);

  const axios = require("axios");

  useEffect(() => {
    queryAndProcessData();
  }, []);

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
            ethRate
            dethRate
            timestamp
        }
    }`;
  };

  const queryAndProcessData = async () => {
    try {
      let url = "https://api.studio.thegraph.com/query/5655/deth-stats/9";
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
      while (!endFound) {
        let graphQuery = makeBatchQuery(nextTimestamp);
        const result = await axios.post(url, { query: graphQuery });

        let dataPoints = result.data.data.dataPoints;
        for (let i = 0; i < dataPoints.length - 1; i++) {
          tmpEthRate.push(dataPoints[i].ethRate / 10 ** 18);
          tmpDethRate.push(dataPoints[i].dethRate / 10 ** 18);
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
      let startTime = "1627344000";
      let endTime = "9999999999";

      // query eth price data from exchange
      let priceData = null;
      if (!exchangeEthData) {
        console.log("Getting exchange data");
        priceData = await axios.get(
          "https://poloniex.com/public?command=returnChartData&currencyPair=USDT_ETH&start=" +
            startTime +
            "&end=" +
            endTime +
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
        tmpDates.push(timeConverter(parseInt(priceData.data[i]["date"])));
      }

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

      // // Set graph data
      setTimestamps(tmpDates);
      setEthPrice(tmpEthPrices);
      setDethRedemptionPrice(tmpDethRedemptionPrice);

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
    } catch (error) {
      console.error(error);
    }
  };

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = "0" + a.getHours();
    var min = "0" + a.getMinutes();
    var sec = a.getSeconds();
    var date = date + "/" + month + "/" + year;
    var time = hour.toString().substr(-2) + ":" + min.toString().substr(-2);

    return date + " " + time;
  }

  return (
    <div>
      <div>
        {"Depositing "}
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
        {" (ETH) on "}

        <input
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
        ></input>
        {" and withdrawing on "}

        <input
          type="date"
          id="endDate"
          name="endDate"
          min={startDate}
          defaultValue={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            console.log(e.target.value);
          }}
        ></input>
        {" would give me: "}
        <br></br>
        <br></br>
        <button onClick={viewRange}>Calculate</button>

        <br></br>
        <br></br>
        <LoadingOverlay
          active={chartLoading}
          spinner
          text="Calculating..."
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
            <h3>Performace Summary</h3>
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
                  labels: timestamps,
                  datasets: [
                    {
                      label: "dETH Valuation",
                      data: dethRedemptionPrice,
                      borderColor: "rgb(0, 0, 0)",
                      borderWidth: 4,
                      fill: false,
                      pointRadius: 0,
                      pointHitRadius: 20,
                    },
                    {
                      label: "ETH Valuation",
                      data: ethPrice,
                      borderColor: "rgb(0, 192, 0)",
                      borderWidth: 2,
                      fill: false,
                      pointRadius: 0,
                      pointHitRadius: 20,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  spanGaps: true,
                }}
                height={350}
              />
            </div>
          </div>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export default LineChart;
