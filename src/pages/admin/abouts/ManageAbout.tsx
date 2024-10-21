import { Table, Empty, message, Image, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { GetAllAbout, RemoveAbout } from '../../../services/about';
import IAbout from '../../../types/about';
import { Link } from 'react-router-dom';

const ManageAbout = () => {
  // api comment 
  const [abouts, setabouts] = useState<IAbout[]>([])
  useEffect(() => {
    GetAllAbout().then(({ data }) => setabouts(data))
  }, [])
  const HandleRemoveAbout = async (id: string) => {
    const key = 'loading';
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
            const response = await RemoveAbout(id);
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = abouts.filter((about) => about._id !== id);
              setabouts(dataNew);
            }
          }, 2000);
        },
        onCancel: () => {
          message.success('Canceled!');
        },
      });
    } catch (error:any) {
          message.error(error.response.data.message,5);
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
    title: 'image',
    key: 'image',
    render: (item: IAbout) =>
      <Image style={{ width: 50, height: 50 }} src={item.image} alt="" />
  },
  {
    title: 'mô tả',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'action',
    render: (item: IAbout) =>
      <>
        <Link to={`/admin/abouts/${item.key}/update`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
        </Link>
        <button type="button"
          onClick={() => HandleRemoveAbout(item.key)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <DeleteOutlined />
        </button>
      </>
  },
];

const listData = abouts.map((item: IAbout, index: number) => {
  return {
    index: index + 1,
    key: item._id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    address: item.address,
    image: item.image,
    description: item.description,
  }
})
if (listData.length == 0)
  return (
    <Empty description={false} />
  )
return (
  <>
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

export default ManageAbout