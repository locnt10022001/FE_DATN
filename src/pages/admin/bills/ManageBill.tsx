import { Table, Empty, message, Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
import { GetAllBill, RemoveBill } from '../../../services/bill';
import IBill from '../../../types/bill';
import ListItemsOrder from '../../../components/ListItemsOrder';
import AddMoreBill from './AddNewBill';
const ManageBill = () => {
  const [bills, setbills] = useState<IBill[]>([])
  useEffect(() => {
    GetAllBill().then(({ data }) => setbills(data))
  }, [])
  const HandleRemoveBill = async (id: number) => {
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
              const dataNew = bills.filter((data) => data.id !== id);
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
      title: 'STT',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: 'Ma HD',
      dataIndex: 'maHoaDon',
      key: 'maHoaDon'
    },
    {
      title: 'Loai HD',
      dataIndex: 'loaiHD',
      key: 'loaiHD'
    },
    {
      title: 'Tong Tien',
      dataIndex: 'tien',
      key: 'tien'
    },
    {
      title: 'So Tien Da Tra',
      dataIndex: 'soTien',
      key: 'soTien'
    },
    {
      title: 'Ngay Tao',
      dataIndex: 'ngayTao',
      key: 'ngayTao'
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
      title: 'Trang Thai',
      dataIndex: 'tt',
      key: 'tt'
    },
    {
      title: 'Hanh Dong',
      key: 'hanhDong',
      render: (item: IBill) =>
        <>
          <Link to={`/admin/order/bill/${item.id}/update`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
          </Link>
          <button type="button"
            onClick={() => HandleRemoveBill(item.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <DeleteOutlined />
          </button>
        </>
    },
  ];

  const listData = bills.map((item: IBill, index: number) => {
    return {
      index: index + 1,
      maHoaDon: item.ma,
      loaiHD: item.loaiHoaDon,
      tien: item.tongTien,
      soTien: item.soTienDaTra,
      ngayTao: item.ngayTao,
      tt: item.tt,
    }
  })
  if (listData.length == 0)
    return (
      <>
        <AddMoreBill />
        <Empty description={false} />
      </>
    )
  return (
    <>
      <AddMoreBill />
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