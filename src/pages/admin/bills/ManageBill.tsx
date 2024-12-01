import { Table, Empty, message, Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
import { GetAllBill, RemoveBill } from '../../../services/bill';
import IBill from '../../../types/bill';
import AddMoreBill from './AddNewBill';
import { format, parseISO } from 'date-fns';
import { ProductDetails } from '../../../types/productdetails';
import ListItemsOrder from '../../../components/ListItemsOrder';

const ManageBill = () => {
  const [bills, setBills] = useState<IBill[]>([]);
  useEffect(() => {
    GetAllBill().then(({ data }) => setBills(data))
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
              setBills(dataNew);
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
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Ma HD',
      dataIndex: 'ma',
      key: 'ma'
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
      title: 'San Pham',
      key: 'items',
      render: (bill: ProductDetails) =>
        <>
          {/* <ListItemsOrder bill={bill} /> */}
        </>
    },
    {
      title: 'Trang Thai',
      dataIndex: 'tt',
      key: 'tt'
    },
    {
      title: 'Hanh Dong',
      render: (item: IBill) =>
        <>
          <Link to={`/admin/order/bill/${item.ma}/update`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
          </Link>
          <button type="button"
            disabled={true}
            onClick={() => HandleRemoveBill(item.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <DeleteOutlined />
          </button>
        </>
    },
  ];

  const listData = Array.isArray(bills) ? bills.map((item: IBill, index: number) => {
    if (parseInt(item.loaiHoaDon) == 1) { item.loaiHoaDon = "HD Tai Quay" } else { item.loaiHoaDon = "Hoa Don Online" }
    if (item.ngayTao != null) { item.ngayTao = format(parseISO(item.ngayTao), 'HH:mm:ss dd-MM-yyyy'); }
    return {
      id: index + 1,
      ma: item.ma,
      loaiHD: item.loaiHoaDon,
      tien: item.tongTien,
      soTien: item.soTienDaTra,
      ngayTao: item.ngayTao,
      tt: item.tt,
    }
  }) : [];
  if (listData.length === 0) {
    return (
      <>
        <AddMoreBill />
        <Empty description={false} />
      </>
    )
  } else {
    return (
      <>
        <AddMoreBill />
        <Table
          columns={columns}
          dataSource={listData}
          bordered
          pagination={{
            pageSize: 10, showQuickJumper: true
          }}
        />
      </>
    )
  }
}

export default ManageBill 