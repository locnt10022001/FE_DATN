import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
import { GetAllBill, RemoveBill } from '../../../services/bill';
import IBill from '../../../types/bill';
import ListItemsOrder from '../../../components/ListItemsOrder';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Table,
  TreeSelect,
  Layout,
  Modal,
  Divider
} from 'antd';
import React from 'react';
import { Space, Tag } from 'antd';
import type { TableProps } from 'antd';
const { Sider, Content } = Layout;

type SizeType = Parameters<typeof Form>[0]['size'];

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columnsGioHang: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
];

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Add</a>
      </Space>
    ),
  },
];
const dataGioHang: DataType[] = [];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];


const layoutStyle = {
  borderRadius: 10,
  innerWidth: 100
};
const contentStyle: React.CSSProperties = {
  background: '#FFFFFF',
};

const siderStyle: React.CSSProperties = {
  background: '#FFFFFF',
  height: '100%',
  paddingLeft: 20,
  display: "flex",
};


const NewBill = () => {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  return (
    <Layout style={layoutStyle}>
      <Content style={contentStyle}>
        <Input width="330%" enterKeyHint='search'></Input>
        <Divider>Gio Hang</Divider>
        <Table<DataType>
          columns={columnsGioHang}
          bordered dataSource={dataGioHang} />
        <Table<DataType> columns={columns} dataSource={data} size='small'
          title={() => 'Sản Phầm'} />
      </Content>
      <Sider width="35%" style={siderStyle}>
        <Form
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          style={{ width: "100%" }}>
          <Form.Item label="Tổng tiền">"1 triệu"</Form.Item>

          <Form.Item label="Tổng tiền">"1 triệu"</Form.Item>
          <Form.Item label="Người Bán"> "user.username"</Form.Item>
          <Form.Item label="Ngày Bán"> 20/10/2024</Form.Item>


          <Form.Item label="PTTT">
            <Select>
              <Select.Option value="1">Tiền mặt</Select.Option>
              <Select.Option value="2">Chuyển Khoản</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item ><Button>Thanh Toán</Button></Form.Item>
        </Form>
      </Sider>
    </Layout >

  )
}

export default NewBill