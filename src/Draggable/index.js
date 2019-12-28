import React from 'react';
import Draggable from 'react-draggable';
const echarts = require('echarts');

class DraggableList extends React.Component {
  handleStart = e => {
    console.log(e, 'handleStart');
  };
  handleDrag = e => {
    console.log(e, 'handleDrag');
  };
  handleStop = e => {
    console.log(e, 'handleStop');
  };
  componentDidMount() {
    this.initEchats();
  }
  initEchats = () => {
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    let option = {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['product', '2015', '2016', '2017'],
        source: [
          { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
          { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
          { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
          {
            product: 'Walnut Brownie',
            '2015': 72.4,
            '2016': 53.9,
            '2017': 39.1
          }
        ]
      },
      xAxis: { type: 'category' },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    };
    myChart.setOption(option);
  };
  render() {
    return (
      <Draggable
        handle=".handle"
        // defaultPosition={{ x: 10, y:110 }}
        position={{ x: 25, y:0 }}
        grid={[25, 25]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div>
          {/* <div>This readme is really dragging on...</div> */}
          <div className="handle" id="main" style={{ width: '230px', height: '230px' }}>
            Drag from here
          </div>
        </div>
      </Draggable>
    );
  }
}
export default DraggableList;
