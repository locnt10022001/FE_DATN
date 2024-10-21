import { Table, Button, Empty, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import IComment from '../../../types/comment';
import { GetAllComment, RemoveComment } from '../../../services/comments';
import { DeleteOutlined } from "@ant-design/icons"

const ManageComment = () => {
  const [comments, setcomments] = useState<IComment[]>([])
  useEffect(() => {
    GetAllComment().then(({ data }) => setcomments(data))
  }, [])
  const HandleRemoveComment = async (id: string) => {
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
            const response = await RemoveComment(id);
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = comments.filter((data) => data._id !== id);
              setcomments(dataNew);
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
      title: 'content',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'product',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'action',
      render: (item: IComment) => <>
        <button type="button"
          onClick={() => HandleRemoveComment(item.key)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <DeleteOutlined />
        </button>
      </>
    },
  ];

  const listData = comments.map((item: IComment, index: number) => {
    return {
      index: index + 1,
      key: item._id,
      content: item.content,
      createdAt: item.createdAt,
      product: item.Product_id
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

export default ManageComment