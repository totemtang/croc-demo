// full ZingChart schema can be found here:
  // https://www.zingchart.com/docs/api/json-configuration/
  let chartConfig = {
    type: 'line',
    globals: {
      fontSize: '14px'
    },
    title: {
      text: 'Line Chart with Annotations',
      color: '#5D7D9A',

      _padding: '30 0 0 35',
      fontSize: '30px'
    },
    subtitle: {
    	text: 'Use the annotation dragging plugin to add toottips to your line charts.',
      color: '#5D7D9A',
      fontSize: '16px',
      fontWeight: 300,
      padding: '15px 0 0 40px'
    },
    _legend: {
      cursor: 'hand',
      draggable: true
    },
    legend: {
      cursor: 'hand',
      draggable: true,
      highlightPlot: true,
      item: {
        fontColor: '#373a3c',
        fontSize: '12px'
      },
      toggleAction: 'remove',
      borderRadius: '5px',
      header: {
        text: 'Legend',
        color: '#5D7D9A',
        padding: '10px'
      }
    },
    // plot represents general series, or plots, styling
    plot: {
      // hoverstate
      // animation docs here:
      // https://www.zingchart.com/docs/tutorials/design-and-styling/chart-animation/#animation__effect
      lineWidth: '3px',
      // line node styling
      marker: {
        borderWidth: '0px',
        size: '6px'
      }
    },
    plotarea: {
      margin: '85px'
    },
    scaleX: {
      // set scale label
      _markers: [
        {
          type: 'line',
          range: [35],
          lineColor: '#a3aeb8',
          lineWidth: '2px',
      		valueRange: true,
        }
      ],
      label: {
        text: '# of Units'
      },
      // convert text on scale indices
      values: '30:80:5',
    },
    scaleY: {
      // scale label with unicode character
      label: {
        text: 'Amount in USD'
      },
      values: '0:500000:100000',
      labels: ['0', '100K', '200K', '300K','400K','500K']
    },
    crosshairX: {
      plotLabel: {
        _padding: '10px 15px',
        borderRadius: '3px',
        color: '#5D7D9A',
        padding: '10px',
        backgroundColor: '#fff',
        thousandsSeparator: ',',
      }
    },
    series: [
      {
        _text: 'Week 1',
        // plot values
        values: [20000,15000,40000,55000,22000,60000,50000,115000,45000,47000,45000],
        lineColor: '#48d8c5',
        marker: {
          backgroundColor: '#48d8c5'
        }
      },
      {
        _text: 'Week 2',
        // plot values
        values: [105000,190000,140000,195000,210000,295000,415000,370000,330000,350000,320000],
        lineColor: '#3290be',
        marker: {
          backgroundColor: '#3290be'
        }
      }
    ]
  };

  function Arrow(nodeIndex) {
  return  {
    "size":0,
    "shadow":false,
    "alpha":0.55,
    "border-width":0,
    "from":{
      "hook":"node: plot=0,index=" + nodeIndex
    },
    "to":{
      "hook":"node: plot=1,index=" + nodeIndex
    },
    "gradient-stops":"0.25 0.75",
    "aspect": [0,0] // @here
  }
}
zingchart.bind(null, 'dataparse', function(e, oGraph) {
  var arrowArray = [];

  // light sanity checks for malformed JSON
  if (oGraph && oGraph.graphset && oGraph.graphset[0]) {
    if(oGraph.graphset[0].series && oGraph.graphset[0].series[0]) {
      oGraph.graphset[0].series[0].values.forEach(function(curVal, curIndex) {
        arrowArray.push(new Arrow(curIndex));
      });
      oGraph.graphset[0].arrows = arrowArray;
    }
  }
  return oGraph;
});

  // render chart with width and height to
  // fill the parent container CSS dimensions
  zingchart.render({
    id: 'myChart',
    data: chartConfig,
    height: '100%',
    width: '100%'
  });

  /*
* define Marker class to construct
* markers on the fly easier.
*/
  function Marker(_index) {
    return {
      type: 'line',
      flat: false,
      lineColor: '#a3aeb8',
      lineWidth: '3px',
      range: [_index]
    }
  }

  /*
  * define Label class to construct
  * labels on the fly easier.
  */
  function Label(_text, _id, _offsetX, _offsetY) {
    return {
      id: _id,
      text: _text,
      angle: 0,
      padding: '5px 10px 5px 10px',
      backgroundColor: '#eeeeee',
      cursor: 'pointer',
      flat: false,
      fontSize: '13px',
      fontStyle: 'bold',
      offsetX: _offsetX,
      offsetY: _offsetY ? _offsetY : 0,
      textAlign: 'left',
      wrapText: true
    }
  }

  // format the label text
  let formatLabelText = (_nodeindex, _scaleText) => {
    let plotInfo = null;
    let nodeInfo;
    let seriesText = '';
    let labelString = isNaN(_scaleText) ? _scaleText + '<br>' : '';
    let color = '';
    let plotLength = zingchart.exec('myChart', 'getplotlength', {
      graphid: 0
    });

    for (let i = 0; i < plotLength; i++) {
      plotInfo = zingchart.exec('myChart', 'getobjectinfo', {
        object: 'plot',
        plotindex: i
      });
      nodeInfo = zingchart.exec('myChart', 'getobjectinfo', {
        object: 'node',
        plotindex: i,
        nodeindex: _nodeindex
      });
      color = plotInfo.lineColor ? plotInfo.lineColor : plotInfo.backgroundColor1;
      seriesText = plotInfo.text ? plotInfo.text : ('Series ' + (i + 1));
      labelString += '<span style="color:' + color + '">' + seriesText + ':</span>' +
        ' ' + nodeInfo.value + '<br>';
    }

    return labelString;
  };

  // global array for markers since you can only update the whole array
  let markersArray = [];
  let labelsArray = [];

  // hash table for markers
  let markerHashTable = {};

  /*
  * Register a graph click event and then render a chart with the markers
  */
  zingchart.bind('myChart', 'click', (e) => {
    let xyInformation;
    let nodeIndex;
    let scaleText;

    // make sure not a node click and click happend in plotarea
    if (e.target != 'node' && e.plotarea) {
      xyInformation = zingchart.exec('myChart', 'getxyinfo', {
        x: e.ev.clientX,
        y: e.ev.clientY
      });

      // if anything is found, 0 corresponds to scale-x
      if (xyInformation && xyInformation[0] && xyInformation[2]) {
        nodeIndex = xyInformation[0].scalepos;
        scaleText = xyInformation[0].scaletext;

        // check hash table. Add marker
        if (!markerHashTable['nodeindex' + nodeIndex]) {
          let nodeInfo = zingchart.exec('myChart', 'getobjectinfo', {
            object: 'node',
            nodeindex: nodeIndex,
            plotindex: 0
          });

          let labelText = formatLabelText(nodeIndex, scaleText);
          let labelId = 'label_' + nodeIndex;
          // create a marker
          let newMarker = new Marker(nodeIndex);
          let newLabel = new Label(labelText, labelId, nodeInfo.x, nodeInfo.y);

          markerHashTable['nodeindex' + nodeIndex] = true;
          markersArray.push(newMarker);

          labelsArray.push(newLabel);

          // render the marker
          chartConfig.scaleX.markers = markersArray;
          chartConfig.labels = labelsArray;
          zingchart.exec('myChart', 'setdata', {
            data: chartConfig
          });
        } else {
          console.log('---marker already exists----');
        }
      }
    }


  /*
  * Register a node_click event and then render a chart with the markers
  */
  zingchart.bind('myChart', 'node_click', (e) => {
    // check hash table. Add marker
    if (!markerHashTable['nodeindex' + e.nodeindex]) {
      let labelText = formatLabelText(e.nodeindex, e.scaletext);
      let labelId = 'label_' + e.nodeindex;
      // create a marker
      let newMarker = new Marker(e.nodeindex, labelText, e.plotindex);
      let newLabel = new Label(labelText, labelId, e.ev.layerX, e.ev.layerY);

      markerHashTable['nodeindex' + e.nodeindex] = true;
      markersArray.push(newMarker);

      labelsArray.push(newLabel);

      // render the marker
      chartConfig.scaleX.markers = markersArray;
      chartConfig.labels = labelsArray;
      zingchart.exec('myChart', 'setdata', {
        data: chartConfig
      });
    } else {
      console.log('---marker already exists----');
    }
  });

  let labelMouseDown = false;
  let labelId = null;

  /*
  * bind mousedown event for dragging label
  */
  zingchart.bind('myChart', 'label_mousedown', (e) => {
    labelMouseDown = true;
    labelId = e.labelid;
    zingchart.exec('myChart', 'hideguide');
  });

  zingchart.bind('myChart', 'mousemove', (e) => {
    if (labelMouseDown && labelId) {
      zingchart.exec('myChart', 'updateobject', {
        type: 'label',
        data: {
          id: labelId,
          offsetY: e.ev.layerY
        }
      });
    }
  });

  zingchart.bind('myChart', 'mouseup', () => {
    labelMouseDown = false;
    labelId = null;
    zingchart.exec('myChart', 'showguide');
  });

  zingchart.bind('myChart', 'doubleclick', (e) => {
    console.log(e);
  });
});
