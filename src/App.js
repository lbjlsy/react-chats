import React from 'react';
import './App.css';
import DraggableList from './Draggable';
import UploadCSV from './Upload';
import Tables from './Table';
import { Layout, Select, Row, Col, Form, message } from 'antd';
const { Sider, Content } = Layout;
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
    dateOption: ['year', 'month', 'date'],
    selectedColumnsOption: [],
    monthHeader: []
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
  dateChange = () => {};
  initEchartBar = () => {
    var myChart = echarts.init(document.getElementById('bar'));
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
      series: [{ type: 'bar' }, { type: 'bar' }]
    };
    myChart.setOption(option);
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
    if (clientX > 480 && clientY > 430) {
      if (id.indexOf('bar') > -1) {
        this.initEchartBar();
      }
    }
  };
  currentDataFormat = (item, type) => {
    if (type === 'month') {
      return item.DATE.slice(0, item.DATE.lastIndexOf('/'))
    } else if (type === 'year') {
      return item.DATE.slice(0, item.DATE.indexOf('/'))
    }
  }
  covertDataField = (data, monthHeader, dateType) => {
    const { currentDataFormat } = this
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
  covertColumns = (data, dateType) => {
    const { currentDataFormat } = this
    const date = [];
    data.forEach((item, idx) => {
      let currentDate;
      currentDate = currentDataFormat(item, dateType)
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
    const monthHeader = this.covertColumns(data, value);
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
    this.covertDataField(tableBodyData, monthHeader, value);
    let id = 0;
    const brandKeys = Object.keys(tableBodyData);
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
      tableBodyData: finalData
    });
    console.log(finalData, 'brandData');
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
    return (
      <div className="App" style={{ minHeight: '100vh' }}>
        <Sider
          width="300"
          style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}
        >
          <div className="left">
            <span>Chart Type</span>
            <DraggableList handleStopBar={this.handleStopBar} />
          </div>
        </Sider>
        <div style={{ textAlign: 'center' }}>
          <UploadCSV
            uploadProcess={this.uploadProcess}
            uploadSuccess={this.uploadSuccess}
          />
        </div>
        <Tables
          data={tableBodyData}
          columns={monthHeader}
          loading={tableLoading}
        />
        Properties
        <Form layout="vertical">
          <Form.Item label="Columns Fields" required>
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
          <Form.Item label="Rows Fields" required>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
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
        <div style={{ width: '100%', minHeight: '50vh' }}>
          <div id="bar" style={{ width: '830px', height: '530px' }}></div>
        </div>
      </div>
    );
  }
}

export default App;
