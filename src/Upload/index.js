import React from 'react';
import { Upload, message, Button, Icon } from 'antd';
const d3 = require('d3-dsv');
const { getJsDateFromExcel } = require('excel-date-to-js');
class UploadCSV extends React.Component {
  state = {
    tableHeader: [],
    tableBody: [],
    cacheData: ''
  };

  formatDate(time, format) {
    const year = time.getFullYear() + '';
    const month = time.getMonth() + 1 + '';
    const date = time.getDate();
    if (format && format.length === 1) {
      return year + format + month + format + date;
    }
    return (
      year +
      (month < 10 ? '0' + month : month) +
      (date < 10 ? '0' + date : date)
    );
  }
  textToCsv = data => {
    const { formatDate } = this;
    const { uploadProcess, uploadSuccess } = this.props;
    this.setState({ tableHeader: [], cacheData: data });
    let tableHeader = [];
    let tableBody = [];
    var allRows = data.split(/\n/);
    for (var singleRow = 0; singleRow < allRows.length - 1; singleRow++) {
      var rowCells = allRows[singleRow].split(',');
      for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
        if (singleRow === 0) {
          // 表格的标题
          let columns = rowCells[rowCell].split(';');
          tableHeader = columns;
        } else {
          let itemArr = rowCells[rowCell].split(';');
          // 表格内容
          let data = {};
          /* eslint-disable */

          itemArr.forEach((item, idx) => {
            if (idx === 9) {
              data[tableHeader[idx]] = formatDate(
                getJsDateFromExcel(item),
                '/'
              );
            } else {
              data[tableHeader[idx]] = item;
            }
            data.key = item;
          });
          tableBody.push(data);
        }
      }
    }

    this.setState(
      {
        tableHeader: tableHeader,
        tableBody: tableBody
      },
      () => {
        uploadProcess(false);
      }
    );
    uploadSuccess({ tableHeader, tableBody });
  };
  render() {
    const {
      textToCsv,
      props: { uploadProcess }
    } = this;
    const props = {
      name: 'file',
      showUploadList: false,
      customRequest: info => {
        uploadProcess(true);
        const reader = new FileReader();
        reader.readAsText(info.file, 'gb2312');
        reader.onload = function() {
          var html = '';
          html = reader.result;
          textToCsv(html);
        };
      },
      accept: '.csv'
    };
    return (
      <Upload {...props}>
        <Button style={{ marginTop: '10px'}}>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
    );
  }
}

export default UploadCSV;
