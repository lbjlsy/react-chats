import React from 'react';
import { Table } from 'antd';
class Tables extends React.Component {
  state = {};
  render() {
    const { columns, data, loading } = this.props;
    return (
      <Table
        columns={columns}
        rowKey={record => record.key}
        loading={loading}
        style={{
          padding: '20px',
          minWidth: '800px',
          marginTop: '20px',
          backgroundColor: '#ffffff'
        }}
        dataSource={data}
      />
    );
  }
}

export default Tables;
