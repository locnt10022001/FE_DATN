import { Table, Empty, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import IhashTag from '../../../types/hashtag';
import { GetAllHashtag, RemoveHashtag } from '../../../services/hashtags';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import ManageHashtagCreate from './ManageHashtagCreate';

const ManageHashtag = () => {
  const [hashtags, sethashtags] = useState<IhashTag[]>([])
  useEffect(() => {
    GetAllHashtag()
      .then(({ data }) => sethashtags(data))
  }, [])

  const HandleRemoveHashtag = async (id: string) => {
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
            const response = await RemoveHashtag(id);
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = hashtags.filter((data) => data._id !== id);
              sethashtags(dataNew);
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
      title: 'created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'action',
      render: (item: IhashTag) =>
        <>
          <Link to={`/admin/hashtags/${item.key}/update`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
          </Link>
          <button type="button"
            onClick={() => HandleRemoveHashtag(item.key)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <DeleteOutlined />
          </button>
        </>
    },
  ];

  const data = hashtags.map((item: IhashTag, index: number) => {
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
      <ManageHashtagCreate />
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 4, showQuickJumper: true }}
      />
    </>
  )
}

export default ManageHashtag