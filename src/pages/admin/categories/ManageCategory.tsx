import { Table, Empty, message, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { ICategory } from '../../../types/category';
import { GetAllCategory, RemoveCategory } from '../../../services/categories';
import { Link } from 'react-router-dom';
import ManageCategoryAdd from './ManageCategoryCreate';
import { useEffect, useState } from 'react';

const ManageCategory = () => {
  const [categories, setcategories] = useState<ICategory[]>([])
  useEffect(() => {
    GetAllCategory().then(({ data }) => setcategories(data))
  }, [])
  const handleCategoryCreated = (newCategory: ICategory) => {
    setcategories([...categories, newCategory]);
  };
  const HandleRemoveCategory = async (id: string) => {
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
            const response = await RemoveCategory(id);
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = categories.filter((data) => data._id !== id);
              setcategories(dataNew);
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
      key: 'name',
    },
    {
      title: 'created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'action',
      render: (item: ICategory) =>
        <>
          <Link to={`/admin/categories/${item.key}/update`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
          </Link>
          <button type="button"
            onClick={() => HandleRemoveCategory(item.key)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <DeleteOutlined />
          </button>
        </>
    },
  ];

  const data = categories.map((item: ICategory, index: number) => {
    return {
      index: index + 1,
      key: item._id,
      name: item.name,
      createdAt: item.createdAt,

    }
  })
  if (data.length == 0)
    return (
      <Empty description={false} />
    )
  return (
    <>
      <ManageCategoryAdd onCategoryCreated={handleCategoryCreated} />
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 4, showQuickJumper: true }}
      />
    </>
  )
}

export default ManageCategory