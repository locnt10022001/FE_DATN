import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, message } from 'antd';
import { ICategory } from '../../../types/category';
import { GetOneCategory, UpdateCategory } from '../../../services/categories';

const ManageCategoryUpdate = () => {
  const navigate = useNavigate();
  const { id }:string | any = useParams();
  const onFinish = async (values: ICategory) => {
    const key = 'loading';
    try {
      const loading = await message.loading({ content: 'loading!', key, duration: 2 });
      if (loading) {
        const response = await UpdateCategory(values);
        if (response)
          message.success('successfully update categories', 3);
          navigate('/admin/categories');
      }
    } catch (error:any) {
      message.error(error.response.data.message,5);
    }
  };
  const [categorie, setcategorie] = useState<ICategory>();
  useEffect(() => {
    GetOneCategory(id).then(({ data }) => setcategorie(data));
  }, []);
  if (!categorie) return null;
  const initial = {
    _id: categorie._id,
    name: categorie.name,
  };
  return (
    <Form layout="vertical" autoComplete="off" onFinish={onFinish} initialValues={initial}>
      <Row gutter={50}>
        <Col span={12}>
          <Form.Item hidden
            label="_id"
            name="_id"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ message: 'Không được bỏ trống!', required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Button type="primary" className="bg-blue-500" htmlType="submit">
        cập nhật
      </Button>
    </Form>
  );
};

export default ManageCategoryUpdate;
