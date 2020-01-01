import React from 'react';
import { Table } from 'antd';
class Tables extends React.Component {
  state = {};
  table = (columns, data) => {
    console.log(data, 'data');
    if (!data) return <div></div>;
    const tableHeader = (
      <thead>
        <tr>
          <th style={{ width: '100px' }}>#</th>
          {columns.map(item => (
            <th>{item}</th>
          ))}
        </tr>
      </thead>
    );
    const tableBody = (
      <tbody>
        <tr></tr>
      </tbody>
    );
    return (
      <table border="1">
        {tableHeader}
        {tableBody}
      </table>
    );
  };

  render() {
    const { columns, data, loading } = this.props;
    // return this.table(columns, data);
    console.log(data, 'data');
    return (
      <Table
        bordered
        columns={columns}
        rowKey={record => record.id}
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
