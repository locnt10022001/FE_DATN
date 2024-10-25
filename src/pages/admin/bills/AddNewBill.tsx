import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddBill from '../../../types/bill';
import { useState } from 'react';
import { PlusOutlined } from "@ant-design/icons"
import { AddNewBill } from '../../../services/bill';
import { Customer, ItemBillState } from '../../../types/saferidebill';
const AddMoreBill= () => {
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
  const onFinish = async (values: Customer) => {
    const key = 'loading'
    try {
      const loading = await message.loading({ content: 'loading!', key, duration: 2 })
      if (loading) {
        const response = await AddNewBill();
        console.log(response);
        setIsModalOpen(false);
        message.success('Successfully create bill', 3);
        navigate('/admin/order/bill')
      }

    } catch (error: any) {
      message.error(error, 5);
    }

  };
  return (
    <>
      <Button className="rounded-md flex space-x-2 font-normal text-sm leading-3 text-indigo-700 bg-white border border-indigo-700 focus:outline-none focus:bg-gray-200 hover:bg-gray-200 duration-150 justify-center items-center" onClick={showModal}>
      Them Don Hang
      </Button>
      <Modal open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
        <div className="title">
          <h2 className='text-center text-[24px] font-bold'>Create new bill</h2>
        </div>
        <Form layout="vertical" autoComplete="off" form={form} onFinish={onFinish}>
          <Col span={12}>
            <Form.Item
              label="Ten Khach Hang"
              name="name"
              rules={[{ message: 'Không được bỏ trống!', required: true, min: 1}]}>
              <Input className='w-[450px]' />
            </Form.Item>
            
          </Col>
          <Col span={12}>
          <Form.Item
              label="So dien thoai "
              name="phone">
              <Input className='w-[450px]' />
            </Form.Item>
            </Col>
          <Row>
            <Button type="primary" className="bg-blue-500" htmlType="submit">
              Them don hang
            </Button>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default AddMoreBill