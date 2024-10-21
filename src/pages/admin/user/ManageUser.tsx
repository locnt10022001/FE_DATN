import { Table, Button, Empty, Input, message, Popconfirm, Modal } from 'antd';
import { useEffect, useState } from 'react';
import IUser from '../../../types/user';
import { GetAllUser, RemoveUser } from '../../../services/user';
import { DeleteOutlined } from "@ant-design/icons"

const ManageUser = () => {
  const [users, setusers] = useState<IUser[]>([])
  useEffect(() => {
    GetAllUser().then(({ data }) => setusers(data))
  }, [])

  const HandleRemoveUser = async (id: string) => {
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
            const response = await RemoveUser(id);
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = users.filter((data) => data._id !== id);
              setusers(dataNew);
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
      title: 'role',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'action',
      render: (item: IUser) => <>
        {item.role === 'admin' ? <Button hidden>delete</Button> :
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => HandleRemoveUser(item.key)} ><DeleteOutlined /></button>
        }
      </>
    },
  ];

  const data = users.map((item: IUser, index: number) => {
    return {
      index: index + 1,
      key: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      createdAt: item.createdAt,
    }
  })
  if (data.length == 0)
    return (
      <Empty description={false} />
    )
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 4, showQuickJumper: true }}
      />
    </>
  )
}

export default ManageUser