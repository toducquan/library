import React from 'react';
import 'antd/dist/antd.css';
import { Table, Tag, Space } from 'antd';

const ListBook = ({bookList}) => {
    const columns = [
        {
          title: 'isbn',
          dataIndex: 'isbn',
          key: 'isbn',
          width: '100px'
        },
        {
          title: 'title',
          dataIndex: 'title',
          key: 'title',
          width: '100px'
        },
        {
          title: 'author',
          dataIndex: 'author',
          key: 'author',
          width: '100px'
        }
      ];
  return (
    <React.Fragment>
        <Table columns={columns} dataSource={bookList} />
    </React.Fragment>
  )
}

export default ListBook