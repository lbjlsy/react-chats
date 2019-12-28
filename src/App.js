import React from 'react';
import logo from './logo.svg';
import './App.css';
import DraggableList from './Draggable';
import UploadCSV from './Upload';
import Tables from './Table';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
class App extends React.Component {
  state = {
    columns: [],
    data: [],
    tableLoading: false
  };
  uploadProcess = boolean => {
    this.setState({
      tableLoading: boolean
    });
  };
  uploadSuccess = ({ tableHeader, tableBody }) => {
    let columns = [];
    tableHeader.forEach((item, idx) => {
      columns.push({ title: item, dataIndex: item, key: idx });
    });
    this.setState({
      columns,
      data: tableBody
    });
  };
  render() {
    const { data, columns, tableLoading } = this.state;
    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{textAlign: 'center'}}>
            <UploadCSV
              uploadProcess={this.uploadProcess}
              uploadSuccess={this.uploadSuccess}
            />
          </Header>
          <Layout style={{margin: '20px'}}>
            <Sider width="350" style={{ backgroundColor: '#f0f2f5' }}>
              <div className="left">
                <span>chart</span>
                <DraggableList />
              </div>
            </Sider>
            <Content>
              <Tables data={data} columns={columns} loading={tableLoading} />
            </Content>
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
