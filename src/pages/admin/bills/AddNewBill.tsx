import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddBill from '../../../types/bill';
import { useState } from 'react';
import { PlusOutlined } from "@ant-design/icons"
import { AddNewBill, GetAllBill } from '../../../services/bill';
import { Customer, ItemBillState } from '../../../types/saferidebill';
const AddMoreBill = () => {
  const onFinish = async () => {
    const key = 'loading'
    try {
      const loading = await message.loading({ content: 'loading!', key, duration: 2 })
      if (loading) {
        const response = await AddNewBill();
        console.log(response);
        message.success('Tạo hoá đơn thành công.', 3);
        window.location.reload()
      }
    } catch (error: any) { message.error(error, 5); }
  };
  return (
    <>
      <Button onClick={onFinish} type="default" htmlType="submit" style={{ marginBottom: 20 }}>
        Thêm đơn hàng
      </Button>
    </>
  )
}

export default AddMoreBill