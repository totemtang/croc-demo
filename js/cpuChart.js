var inqpIndex = 0;
let inqpCPU = [
  0.20337,
  0.153127,
  0.136802,
  0.149357,
  0.150666,
  0.26072,
  0.180488,
  0.157241,
  0.15677,
  0.186766,
  0.117258
];
var sparkIndex = 0;
let sparkCPU = [
  0.21079,
  0.227504,
  0.229601,
  0.288608,
  0.276782,
  0.298042,
  0.404516,
  0.361052,
  0.449008,
  0.424012,
  0.130317
];

function inqpRealTimeFeed(callback) {
  var tick = {};
  tick.plot0 = Math.round(inqpCPU[inqpIndex] * 100);
  inqpIndex += 1;
  callback(JSON.stringify(tick));
}

function sparkRealTimeFeed(callback) {
  var tick = {};
  tick.plot0 = Math.round(sparkCPU[sparkIndex] * 100);
  sparkIndex += 1;
  callback(JSON.stringify(tick));
}

const inqpCPUConfig = {
  //chart styling
  type: "line",
  globals: {
    fontFamily: "Roboto"
  },
  backgroundColor: "#fff",
  plotarea: {
    marginLeft: "70px",
    marginTop: "10px",
    marginBottom: "80px"
  },
  crosshairX: {
    lineWidth: 1,
    lineStyle: "dashed",
    lineColor: "#424242",
    marker: {
      visible: true,
      size: 7
    },
    plotLabel: {
      backgroundColor: "#fff",
      borderColor: "#e3e3e3",
      borderRadius: 2,
      padding: 5,
      fontSize: 12,
      shadow: true,
      shadowAlpha: 0.2,
      shadowBlur: 5,
      shadowDistance: 4
    },
    scaleLabel: {
      backgroundColor: "#424242",
      padding: 5
    }
  },
  scaleY: {
    label: {
      text: "CPU Usage (%)",
      fontSize: "15px"
    },
    guide: {
      visible: false
    },
    values: "0:50:10"
  },
  scaleX: {
    label: {
      text: "Execution Time (mins)",
      fontSize: "15px"
    },
    minValue: 1,
    maxValue: 11,
    step: 1
  },
  tooltip: {
    visible: false
  },
  //real-time feed
  refresh: {
    type: "feed",
    transport: "js",
    url: "inqpRealTimeFeed()",
    interval: 6000,
    adjustScale: true,
    stopTimeout: 11
  },
  plot: {
    shadow: 1,
    shadowColor: "#eee",
    shadowDistance: "10px",
    lineWidth: 2,
    hoverState: {
      visible: false
    },
    marker: {
      visible: false
    },
    aspect: "spline"
  },
  series: [
    {
      values: [],
      lineColor: "#2196F3",
      text: "CPU Usage"
    }
  ]
};

const sparkCPUConfig = {
  //chart styling
  type: "line",
  globals: {
    fontFamily: "Roboto"
  },
  backgroundColor: "#fff",
  plotarea: {
    marginLeft: "70px",
    marginTop: "10px",
    marginBottom: "80px"
  },
  crosshairX: {
    lineWidth: 1,
    lineStyle: "dashed",
    lineColor: "#424242",
    marker: {
      visible: true,
      size: 7
    },
    plotLabel: {
      backgroundColor: "#fff",
      borderColor: "#e3e3e3",
      borderRadius: 2,
      padding: 5,
      fontSize: 12,
      shadow: true,
      shadowAlpha: 0.2,
      shadowBlur: 5,
      shadowDistance: 4
    },
    scaleLabel: {
      backgroundColor: "#424242",
      padding: 5
    }
  },
  scaleY: {
    label: {
      text: "CPU Usage (%)",
      fontSize: "15px"
    },
    guide: {
      visible: false
    },
    values: "0:50:10"
  },
  scaleX: {
    label: {
      text: "Execution Time (s)",
      fontSize: "15px"
    },
    minValue: 1,
    maxValue: 11,
    step: 1
  },
  tooltip: {
    visible: false
  },
  //real-time feed
  refresh: {
    type: "feed",
    transport: "js",
    url: "sparkRealTimeFeed()",
    interval: 6000,
    adjustScale: true,
    stopTimeout: 11
  },
  plot: {
    shadow: 1,
    shadowColor: "#eee",
    shadowDistance: "10px",
    lineWidth: 2,
    hoverState: {
      visible: false
    },
    marker: {
      visible: false
    },
    aspect: "spline"
  },
  series: [
    {
      values: [],
      lineColor: "#2196F3",
      text: "CPU Usage"
    }
  ]
};

// define top level feed control functions
function clearGraph() {
  zingchart.exec("inqpCPUChart", "clearfeed");
}

var curInterval = 100;
var threshold = 1000;

function startGraph() {
  zingchart.render({
    id: "inqpCPUChart",
    data: inqpCPUConfig,
    height: "100%",
    width: "100%"
  });
  zingchart.render({
    id: "sparkCPUChart",
    data: sparkCPUConfig,
    height: "100%",
    width: "100%"
  });
  zingchart.exec("inqpCPUChart", "startfeed");
  zingchart.exec("sparkCPUChart", "startfeed");
}

function stopGraph() {
  zingchart.exec("inqpCPUChart", "stopfeed");
}
