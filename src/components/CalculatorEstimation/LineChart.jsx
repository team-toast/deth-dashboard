import React, { useEffect } from "react";
import { useState } from "react";

import { Line } from "react-chartjs-2";

const LineChart = () => {
  const [ethRate, setEthRate] = useState([]);
  const [dEthRate, setDEthRate] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [ethPrice, setEthPrice] = useState([]);
  const [dethRedemptionPrice, setDethRedemptionPrice] = useState([]);
  const [startDate, setStartDate] = useState("2021-10-25");
  const [endDate, setEndDate] = useState("");
  const [finalEthValue, setFinalEthValue] = useState(0);
  const [finalDollarValue, setFinalDollarValue] = useState(0);
  const [percentageDollarGrowth, setPercentageDollarGrowth] = useState(0);
  const [percentageEthGrowth, setPercentageEthGrowth] = useState(0);
  const [finalDollarValueNoDeth, setFinalDollarValueNoDeth] = useState(0);
  const [percentageDollarGrowthNoDeth, setPercentageDollarGrowthNoDeth] =
    useState(0);
  const [buyAmount, setBuyAmount] = useState(1.0);
  const [chartLoading, setChartLoading] = useState(true);

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

      // query eth price data from exchange
      const priceData = await axios.get(
        "https://poloniex.com/public?command=returnChartData&currencyPair=USDT_ETH&start=" +
          tmpTimeStamps[0] +
          "&end=" +
          tmpTimeStamps[tmpTimeStamps.length - 1] +
          "&period=1800"
      );

      // Merge ETH price data from exchange with timestamps from the graph deth query
      let startValue = 0;
      for (var i = 0; i < tmpTimeStamps.length - 1; i++) {
        for (var k = startValue; k < priceData.data.length; k++) {
          if (
            parseInt(tmpTimeStamps[i]) >= priceData.data[k]["date"] &&
            parseInt(tmpTimeStamps[i]) <= priceData.data[k + 1]["date"]
          ) {
            tmpEthPrices.push(priceData.data[k]["close"] * buyAmount);
            tmpDethRedemptionPrice.push(
              parseFloat(priceData.data[k]["close"]) *
                parseFloat(tmpEthRate[i] * dethBought)
            );
            startValue = k;
            break;
          }
        }
      }

      // Get date strings
      let tmpDates = [];
      for (let i = 0; i < tmpTimeStamps.length; i++) {
        tmpDates.push(timeConverter(parseInt(tmpTimeStamps[i])));
      }

      console.log(tmpEthPrices);

      // Set graph data
      setTimestamps(tmpDates);
      setEthPrice(tmpEthPrices);
      setDethRedemptionPrice(tmpDethRedemptionPrice);

      // Calculate final postion/growth values
      let endEthPrice =
        parseFloat(tmpEthPrices[tmpEthPrices.length - 1]) /
        parseFloat(buyAmount);

      let startEthPrice = parseFloat(tmpEthPrices[0]) / parseFloat(buyAmount);

      console.log("Eth end Price: ", endEthPrice);

      let endEthPosition =
        tmpDethRedemptionPrice[tmpDethRedemptionPrice.length - 1] / endEthPrice;

      setFinalEthValue(endEthPosition);

      setFinalDollarValue(
        tmpDethRedemptionPrice[tmpDethRedemptionPrice.length - 1]
      );

      setPercentageEthGrowth(
        (tmpDethRedemptionPrice[tmpDethRedemptionPrice.length - 1] /
          tmpEthPrices[tmpEthPrices.length - 1] -
          1) *
          100.0
      );

      setPercentageDollarGrowth(
        (tmpDethRedemptionPrice[tmpDethRedemptionPrice.length - 1] /
          tmpEthPrices[0] -
          1) *
          100.0
      );

      setFinalDollarValueNoDeth(tmpEthPrices[tmpEthPrices.length - 1]);

      setPercentageDollarGrowthNoDeth(
        (tmpEthPrices[tmpEthPrices.length - 1] / tmpEthPrices[0] - 1) * 100.0
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
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + "/" + month + "/" + year + " " + hour + ":" + min;
    return time;
  }

  return (
    <div>
      <div>
        <div>{chartLoading && <h3>Loading...</h3>}</div>
        <div>
          <Line
            data={{
              labels: timestamps,
              datasets: [
                {
                  label: "dETH Valuation",
                  data: dethRedemptionPrice,
                  borderColor: "rgb(75, 0, 0)",
                  borderWidth: 2,
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
            width={450}
          />
        </div>
      </div>
      <label htmlFor="ethAmount: ">Pruchase Amount (ETH):</label>{" "}
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
      <br></br>
      <label htmlFor="startDate: ">Start Date:</label>{" "}
      <input
        type="date"
        id="startDate"
        name="startDate"
        max={endDate}
        onChange={(e) => {
          setStartDate(e.target.value);
          console.log(e.target.value);
        }}
      ></input>
      {"    "}
      <label htmlFor="endDate: ">End Date:</label>{" "}
      <input
        type="date"
        id="endDate"
        name="endDate"
        min={startDate}
        onChange={(e) => {
          setEndDate(e.target.value);
          console.log(e.target.value);
        }}
      ></input>
      <br></br>
      <button onClick={viewRange}>View Range</button>
      <div>
        <h3>Performace Summary</h3>
        <p>
          Final ETH Value: {finalEthValue.toFixed(2)} ({" "}
          {percentageEthGrowth.toFixed(2)}% Growth)
          <br></br>
          Final Dollar Value {finalDollarValue.toFixed(2)} (
          {percentageDollarGrowth.toFixed(2)}% Growth)
          <br></br>
          Final Dollar Value without dEth {finalDollarValueNoDeth.toFixed(2)} (
          {percentageDollarGrowthNoDeth.toFixed(2)}% Growth)
        </p>
      </div>
    </div>
  );
};

export default LineChart;
