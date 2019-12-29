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
    dateOption: ['year', 'month', 'date']
  };
  uploadProcess = boolean => {
    this.setState({
      tableLoading: boolean
    });
  };
  uploadSuccess = ({ tableHeader, tableBody }) => {
    let columns = [];
    let columnsOption = [];
    let selectedOption = [];
    tableHeader.forEach((item, idx) => {
      columns.push({ title: item, dataIndex: item, key: idx });
      columnsOption.push(item);
      if (item) {
        selectedOption.push(item);
      }
    });
    this.setState({
      columns,
      data: tableBody,
      tableHeader,
      tableBody,
      columnsOption,
      selectedOption
    });
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

  covertColumns = data => {
    const keys = Object.keys(data);
    keys.forEach(key => {
      const brandKeys = Object.keys(data[key]);
      brandKeys.forEach(brandKey => {
        data[key][brandKey].sort(function(a, b) {
          const aMonth = a.DATE.slice(0, a.DATE.lastIndexOf('/'));
          const bMonth = b.DATE.slice(0, b.DATE.lastIndexOf('/'));
          return new Date(aMonth) > new Date(bMonth) ? 1 : -1;
        });
      });
    });
  };
  columnHandleChange = value => {
    console.log(value, 'value');
    if (value === 'month') {
      const brand = {};
      const { data } = this.state;
      data.map((item, idx) => {
        if (!brand[item.BRAND]) {
          brand[item.BRAND] = [];
          brand[item.BRAND].push(item);
        } else {
          brand[item.BRAND].push(item);
        }
      });

      const keys = Object.keys(brand);
      keys.forEach(key => {
        const brandType = {};
        brand[key].forEach(item => {
          if (!brandType[item.TYPE]) {
            brandType[item.TYPE] = [];
            brandType[item.TYPE].push(item);
          } else {
            brandType[item.TYPE].push(item);
          }
        });
        brand[key] = brandType;
      });
      this.covertColumns(brand);
      console.log(brand, 'brand');
    }
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
      data,
      columns,
      tableLoading,
      columnsOption,
      selectedOption,
      dateOption
    } = this.state;
    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Layout style={{ margin: '20px' }}>
            <Sider
              width="300"
              style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}
            >
              <div className="left">
                <span>Chart Type</span>
                <DraggableList handleStopBar={this.handleStopBar} />
              </div>
            </Sider>
            <Content>
              <Row>
                <Col span={19}>
                  <div style={{ textAlign: 'center' }}>
                    <UploadCSV
                      uploadProcess={this.uploadProcess}
                      uploadSuccess={this.uploadSuccess}
                    />
                  </div>
                  <Tables
                    data={data}
                    columns={columns}
                    loading={tableLoading}
                  />
                </Col>
                <Col span={4} offset={1}>
                  Properties
                  <Form layout="vertical">
                    <Form.Item label="Columns Fields" required>
                      <Select
                        placeholder="Please select"
                        onChange={this.columnHandleChange}
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
                </Col>
              </Row>
              <div style={{ width: '100%', minHeight: '50vh' }}>
                <div id="bar" style={{ width: '830px', height: '530px' }}></div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
