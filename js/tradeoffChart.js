// full ZingChart schema can be found here:
// https://www.zingchart.com/docs/api/json-configuration/

let defaultConfig = {
  type: "line",
  globals: {
    fontSize: "14px"
  },
  title: {
    text:
      "Estimated trade-off between final work constraint and additional total work",
    color: "#404040",

    _padding: "30 0 0 35",
    fontSize: "20px"
  },
  legend: {
    cursor: "hand",
    "max-items": 3,
    overflow: "page",
    item: {
      fontColor: "#373a3c",
      fontSize: "14px"
    },
    "highlight-plot": true,
    "offset-x": "-70",
    "offset-y": "60"
  },
  // plot represents general series, or plots, styling
  plot: {
    // hoverstate
    // animation docs here:
    // https://www.zingchart.com/docs/tutorials/design-and-styling/chart-animation/#animation__effect
    lineWidth: "3px",
    // line node styling
    marker: {
      borderWidth: "0px",
      size: "5px"
    },
    tooltip: {
      text: "Constraint: %vt, Additional Work: %kt%",
      fontSize: "18px",
      fontColor: "#383735",
      backgroundColor: "#f5f3f0"
    }
  },
  plotarea: {
    margin: "50px",
    marginLeft: "60px",
    marginBottom: "80px"
  },
  scaleX: {
    label: {
      text: "Percentage of additional total work compared to batch processing",
      fontSize: "18px"
    },
    // convert text on scale indices
    values: "0:120:20",
    item: {
      "font-size": 16
    }
  },
  scaleY: {
    // scale label with unicode character
    label: {
      text: "Final work constraint",
      fontSize: "18px"
    },
    values: "0.0:1.0:0.2",
    labels: ["0.0", "0.2", "0.4", "0.6", "0.8", "1.0"],
    item: {
      "font-size": 16
    }
  },
  series: [
    {
      text: "InQP",
      // plot values
      lineColor: "#3399ff",
      marker: {
        backgroundColor: "#3399ff"
      }
    },
    {
      text: "Spark",
      // plot values
      lineColor: "#ff8000",
      marker: {
        backgroundColor: "#ff8000"
      }
    }
  ]
};

let divId = "tradeoffChart";

var Q17_InQPValues = [[0, 1.0], [8, 0.5], [12, 0.2], [18, 0.1], [35, 0.05]];
var Q17_SparkValues = [[0, 1.0], [18, 0.5], [35, 0.2], [66, 0.1], [118, 0.05]];
var QHigh_InQPValues = [[0, 1.0], [6, 0.5], [10, 0.2], [17, 0.1], [30, 0.05]];
var QHigh_SparkValues = [[0, 1.0], [10, 0.5], [22, 0.2], [45, 0.1], [80, 0.05]];

zingchart.render({
  id: divId,
  data: defaultConfig,
  height: "100%",
  width: "100%"
});

function drawTradeoff() {
  var queryName = document.getElementById("query").value;
  var windowSize = document.getElementById("window").value;
  // render chart with width and height to
  // fill the parent container CSS dimensions
  if (
    queryName.localeCompare("Q-HighCustBal") === 0 &&
    windowSize.localeCompare("10mins") === 0
  ) {
    document.getElementById(divId).innerHTML = "";
    defaultConfig.series[0].values = QHigh_InQPValues;
    defaultConfig.series[1].values = QHigh_SparkValues;
    zingchart.render({
      id: divId,
      data: defaultConfig,
      height: "100%",
      width: "100%"
    });
  } else if (
    queryName.localeCompare("Q-17") === 0 &&
    windowSize.localeCompare("10mins") === 0
  ) {
    document.getElementById(divId).innerHTML = "";
    defaultConfig.series[0].values = Q17_InQPValues;
    defaultConfig.series[1].values = Q17_SparkValues;
    zingchart.render({
      id: divId,
      data: defaultConfig,
      height: "100%",
      width: "100%"
    });
  } else {
    document.getElementById(divId).innerHTML =
      "Not supported " + queryName + " with window size " + windowSize;
  }
}
