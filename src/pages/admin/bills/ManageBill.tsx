import { Table, Empty, message, Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
import { GetAllBill, RemoveBill } from '../../../services/bill';
import IBill from '../../../types/bill';
import ListItemsOrder from '../../../components/ListItemsOrder';
const ManageBill = () => {
  const [bills, setbills] = useState<IBill[]>([])
  useEffect(() => {
    GetAllBill().then(({ data }) => setbills(data))
  }, [])
  const HandleRemoveBill = async (id: string) => {
    try {
      Modal.confirm({
        title: 'Confirm',
        content: 'Are you sure you want to delete this about?',
        okText: 'Yes',
        cancelText: 'No',
        okButtonProps: {
          className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" // áp dụng lớp CSS
        },
        onOk: async () => {
          const loading = message.loading({ content: 'Loading...', duration: 0 });
          setTimeout(async () => {
            if (loading) {
              loading();
            }
            const response = await RemoveBill(id);
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = bills.filter((data) => data._id !== id);
              setbills(dataNew);
            }
          }, 2000);
        },
        onCancel: () => {
          message.success('Canceled!');
        },
      });
    } catch (error: any) {
      message.error(error.response.data.message, 5);
    }
  };
  const columns = [
    {
      title: 'stt',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'total',
      dataIndex: 'total',
      key: 'total'
    },
    {
      title: 'items',
      key: 'items',
      render: (bill: IBill) =>
        <>
          <ListItemsOrder bill={bill} />
        </>
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'action',
      key: 'action',
      render: (item: IBill) =>
        <>
          <Link to={`/admin/order/bill/${item.key}/update`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
          </Link>
          <button type="button"
            onClick={() => HandleRemoveBill(item.key)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <DeleteOutlined />
          </button>
        </>
    },
  ];

  const listData = bills.map((item: IBill, index: number) => {
    return {
      index: index + 1,
      key: item._id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      createdAt: item.createdAt,
      total: item.total,
      items: item.items,
      status: item.status
    }
  })
  if (listData.length == 0)
    return (
      <Empty description={false} />
    )
  return (
    <>
  <Link to={"newbill"}><Button> Add New Bill</Button> </Link>
      <Table
        columns={columns}
        dataSource={listData}
        bordered
        pagination={{
          pageSize: 4, showQuickJumper: true
        }}
      />
    </>
  )
}

export default ManageBill