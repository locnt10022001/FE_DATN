import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import IhashTag from '../../../types/hashtag';
import { CreateHashtag } from '../../../services/hashtags';
import { useState } from 'react';
import { PlusOutlined } from "@ant-design/icons"
const ManageHashtagCreate = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (values: IhashTag) => {
    const key = 'loading'
    try {
      const loading = await message.loading({ content: 'loading!', key, duration: 2 })
      if (loading) {
        const response = await CreateHashtag(values);
        if (response)
          setIsModalOpen(false);
        message.success('successfully create hashtags', 3);
        navigate('/admin/hashtags')
      }

    } catch (error: any) {
      message.error(error.response.data.message, 5);
    }

  };
  return (
    <>
      <Button className="rounded-md flex space-x-2 w-24 h-10 font-normal text-sm leading-3 text-indigo-700 bg-white border border-indigo-700 focus:outline-none focus:bg-gray-200 hover:bg-gray-200 duration-150 justify-center items-center" onClick={showModal}>
        <PlusOutlined />
      </Button>
      <Modal open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
        <div className="title">
          <h2 className='text-center text-[24px] font-bold'>Create hashtag</h2>
        </div>
        <Form layout="vertical" autoComplete="off" form={form} onFinish={onFinish}>
          <Col span={12}>
            <Form.Item
              label="name"
              name="name"
              rules={[{ message: 'Không được bỏ trống!', required: true, min: 3 }]}
            >
              <Input className='w-[450px]' />
            </Form.Item>
          </Col>
          <Row>
            <Button type="primary" className="bg-blue-500" htmlType="submit">
              Thêm hashtag
            </Button>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default ManageHashtagCreate