import React from 'react';
import Draggable from 'react-draggable';
const echarts = require('echarts');

class DraggableList extends React.Component {
  handleStartBar = e => {
    // console.log(e, 'handleStartBar');
  };
  handleDragBar = e => {
    // console.log(e, 'handleDragBar');
  };
  handleStopBar = e => {
    // console.log(e, 'handleStopBar');
    const { handleStopBar } = this.props
    handleStopBar(e)
  };
  componentDidMount() {
    this.initEchats();
  }
  initEchats = () => {
    var myChart = echarts.init(document.getElementById('model-bar'));
    // 绘制图表
    let option = {
      color: ['#76CE8E', '#8C56D3'],
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['product', '2018', '2019'],
        source: [
          { product: 'Matcha Latte', '2018': 85.8, '2019': 93.7 },
          { product: 'Milk Tea', '2018': 73.4, '2019': 55.1 },
          { product: 'Cheese Cocoa', '2018': 65.2, '2019': 82.5 },
          {
            product: 'Walnut Brownie',
            '2018': 53.9,
            '2019': 39.1
          }
        ]
      },
      xAxis: { type: 'category' },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: 'bar' }, { type: 'bar' }]
    };
    myChart.setOption(option);
  };
  render() {
    return (
      <Draggable
        handle=".handle"
        position={{ x: 25, y: 0 }}
        grid={[25, 25]}
        scale={1}
        onStart={this.handleStartBar}
        onDrag={this.handleDragBar}
        onStop={this.handleStopBar}
        id="model-bar"
      >
        <div
          className="handle"
          id="model-bar"
          style={{ width: '250px', height: '250px' }}
        ></div>
      </Draggable>
    );
  }
}
export default DraggableList;
