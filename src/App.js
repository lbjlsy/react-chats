import React from 'react';
import './App.css';
import DraggableList from './Draggable';
import UploadCSV from './Upload';
import Tables from './Table';
import { Select, Form, message } from 'antd';
const { Option } = Select;
const echarts = require('echarts');
class App extends React.Component {
  state = {
    columns: [],
    data: [],
    tableLoading: false,
    tableHeader: [],
    tableBody: [],
    columnsOption: [],
    selectedOption: [],
    dateOption: ['year', 'month'],
    selectedColumnsOption: [],
    monthHeader: [],
    echartBarData: [],
    echartData: {},
    echartIsRender: false
  };
  uploadProcess = boolean => {
    this.setState({
      tableLoading: boolean
    });
  };
  uploadSuccess = ({ tableHeader, tableBody }) => {
    let columns = [];
    let columnsOption = [];
    tableHeader.forEach((item, idx) => {
      columns.push({ title: item, dataIndex: item, key: idx });
      columnsOption.push(item);
    });
    this.setState({
      columns,
      data: tableBody,
      tableHeader,
      tableBody,
      columnsOption,
      selectedOption: ['COUNT', 'PRICE'],
      selectedColumnsOption: ['month']
    });
    this.columnHandleChange('month');
  };
  initEchartBar = () => {
    const { echartBarData, echartData } = this.state;
    const typeKeys = Object.keys(echartData);
    const finalEchartData = { SUV: [], Car: [] };
    typeKeys.forEach(typeKey => {
      echartData[typeKey].map(list => {
        echartBarData.forEach((monthKey, idx) => {
          list.forEach(item => {
            for (const key in item) {
              if (item.hasOwnProperty(key) && key.indexOf('PRICE') !== -1) {
                if (key.indexOf(monthKey) !== -1) {
                  if (!finalEchartData[typeKey][idx]) {
                    finalEchartData[typeKey][idx] = 0
                  }
                  finalEchartData[typeKey][idx] += Number(item[key])
                }
              }
            }
          });
        });
      });
    });
    let myChart = echarts.init(document.getElementById('bar'));
    let option = {
      color: ['#76CE8E', '#8C56D3'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['Car', 'SUV', '平均温度']
      },
      xAxis: [
        {
          type: 'category',
          data: echartBarData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        },
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Car',
          type: 'bar',
          data: finalEchartData.Car
        },
        {
          name: 'SUV',
          type: 'bar',
          data: finalEchartData.SUV
        }
      ]
    };
    myChart.setOption(option);
    this.setState({
      echartIsRender: true
    })
  };
  handleStopBar = event => {
    // 480 430
    const {
      clientX,
      clientY,
      target: {
        parentNode: {
          parentNode: { id }
        }
      }
    } = event;
    const { data } = this.state;
    if (!data.length) {
      message.warn('请上传CSV格式数据!', 1);
      return;
    }
    if (clientX > 480 && clientY > 230) {
      if (id.indexOf('bar') > -1) {
        this.initEchartBar();
      }
    }
  };
  currentDataFormat = (item, type) => {
    if (type === 'month') {
      return item.DATE.slice(0, item.DATE.lastIndexOf('/'));
    } else if (type === 'year') {
      return item.DATE.slice(0, item.DATE.indexOf('/'));
    }
  };
  covertRowDataField = (data, monthHeader, dateType) => {
    const { currentDataFormat } = this;
    const keys = Object.keys(data);
    keys.forEach(key => {
      const typeKeys = Object.keys(data[key]);
      typeKeys.forEach(brandKey => {
        const monthData = {};
        data[key][brandKey].forEach((item, idx) => {
          if (!monthData[item.NAME]) {
            monthData[item.NAME] = [];
            monthData[item.NAME].push(item);
          } else {
            monthData[item.NAME].push(item);
          }
        });
        const monthDataKeys = Object.keys(monthData);
        monthDataKeys.forEach(key => {
          const itemData = {};
          const itemArr = [];
          monthHeader.forEach(month => {
            monthData[key].forEach(item => {
              if (month === currentDataFormat(item, dateType)) {
                if (!itemData[month]) {
                  itemData[month] = month;
                  itemData[month] = {
                    [`${month}PRICE`]: Number(item.PRICE),
                    [`${month}COUNT`]: Number(item.COUNT)
                  };
                } else {
                  itemData[month][`${month}PRICE`] += Number(item.PRICE);
                  itemData[month][`${month}COUNT`] += Number(item.COUNT);
                }
              }
            });
            if (!itemData[month]) {
              itemData[month] = { [`${month}PRICE`]: 0, [`${month}COUNT`]: 0 };
            }
            itemArr.push(itemData[month]);
          });
          monthData[key] = itemArr;
        });
        data[key][brandKey] = monthData;
      });
    });
  };
  sortColumns = (data, dateType) => {
    const { currentDataFormat } = this;
    const date = [];
    data.forEach((item, idx) => {
      let currentDate;
      currentDate = currentDataFormat(item, dateType);
      if (!date.includes(currentDate)) {
        date.push(currentDate);
      }
    });
    date.sort((a, b) => (new Date(a) > new Date(b) ? 1 : -1));
    return date;
  };
  covertTableHeader = (columns, rows) => {
    let data = [
      { title: 'Model', dataIndex: 'name', key: 'id', className: 'model-class' }
    ];
    columns.forEach((list, idx) => {
      const row = rows.map((item, idx) => {
        const column = {};
        column.title = item;
        column.dataIndex = `${list}${item}`;
        column.key = `${list}${item}`;
        return column;
      });
      data.push({ title: list, children: row, key: list });
    });
    return data;
  };
  columnHandleChange = value => {
    const tableBodyData = {};
    const { data } = this.state;
    const monthHeader = this.sortColumns(data, value);
    this.setState({
      echartBarData: monthHeader
    });
    data.forEach((item, idx) => {
      if (!tableBodyData[item.BRAND]) {
        tableBodyData[item.BRAND] = [];
        tableBodyData[item.BRAND].push(item);
      } else {
        tableBodyData[item.BRAND].push(item);
      }
    });

    const keys = Object.keys(tableBodyData);
    keys.forEach(key => {
      const brandType = {};
      tableBodyData[key].forEach(item => {
        if (!brandType[item.TYPE]) {
          brandType[item.TYPE] = [];
          brandType[item.TYPE].push(item);
        } else {
          brandType[item.TYPE].push(item);
        }
      });
      tableBodyData[key] = brandType;
    });
    this.covertRowDataField(tableBodyData, monthHeader, value);
    let id = 0;
    const brandKeys = Object.keys(tableBodyData);
    const echartData = { SUV: [], Car: [] };
    const finalData = brandKeys.map(brandKey => {
      const typeKeys = Object.keys(tableBodyData[brandKey]);
      const typeData = typeKeys.map(typeKey => {
        const nameKeys = Object.keys(tableBodyData[brandKey][typeKey]);
        const typeArr = nameKeys.map(nameKey => {
          const nameArr = tableBodyData[brandKey][typeKey][nameKey].reduce(
            (acc, cur) => {
              return Object.assign(acc, cur);
            }
          );
          return { name: nameKey, ...nameArr, id: ++id };
        });
        if (typeKey === 'Car') {
          echartData.Car.push(typeArr);
        } else if (typeKey === 'SUV') {
          echartData.SUV.push(typeArr);
        }
        return { name: typeKey, children: typeArr, id: ++id };
      });
      return { name: brandKey, children: typeData, id: ++id };
    });
    const {
      covertTableHeader,
      state: { selectedOption }
    } = this;
    this.setState({
      selectedColumnsOption: value,
      monthHeader: covertTableHeader(monthHeader, selectedOption),
      tableBodyData: finalData,
      echartData
    }, () => {
        if (this.state.echartIsRender) {
          this.initEchartBar()
        }
    });
    
  };
  rowHandleChange = value => {
    let columns = [];
    value.forEach((item, idx) => {
      columns.push({ title: item, dataIndex: item, key: idx });
    });
    this.setState({
      selectedOption: value,
      columns
    });
  };
  render() {
    const {
      tableBodyData,
      monthHeader,
      tableLoading,
      columnsOption,
      selectedColumnsOption,
      selectedOption,
      dateOption
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 4 }
    };
    return (
      <div className="App" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', overflow: 'hidden' }}>
          <UploadCSV
            uploadProcess={this.uploadProcess}
            uploadSuccess={this.uploadSuccess}
          />
          <Form layout="vertical" style={{ margin: '20px' }}>
            <Form.Item label="Columns Fields" {...formItemLayout} required>
              <Select
                placeholder="Please select"
                onChange={this.columnHandleChange}
                value={selectedColumnsOption}
              >
                {dateOption.map((item, idx) => (
                  <Option key={idx} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item {...formItemLayout} label="Rows Fields" required>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                disabled
                placeholder="Please select"
                value={selectedOption}
                onChange={this.rowHandleChange}
              >
                {columnsOption.map((item, idx) => (
                  <Option key={idx} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <Tables
          data={tableBodyData}
          columns={monthHeader}
          loading={tableLoading}
        />
        <div>
          <span style={{ marginLeft: '30px' }}>Chart Type</span>
          <DraggableList handleStopBar={this.handleStopBar} />
          <div style={{ width: '100%', minHeight: '50vh' }}>
            <div id="bar" style={{ minWidth: '100vw', height: '530px' }}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
