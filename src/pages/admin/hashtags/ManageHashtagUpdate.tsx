import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, message } from 'antd';
import { GetOneHashtag, UpdateHashtag } from '../../../services/hashtags';
import IhashTag from '../../../types/hashtag';


const ManageHashtagUpdate = () => {
  const navigate = useNavigate();
  const { id }: string | any = useParams();
  const [hashtag, sethashtag] = useState<IhashTag>()
  useEffect(() => {
    GetOneHashtag(id).then(({ data }) => sethashtag(data))
  }, [])
  const onFinish = async (values: IhashTag) => {
    const key = 'loading';
    try {
      const loading = await message.loading({ content: 'loading!', key, duration: 2 });
      if (loading) {
        const response = await UpdateHashtag(values);
        if (response)
          message.success('successfully update hashtags', 3);
        navigate('/admin/hashtags');
      }
    } catch (error: any) {
      message.error(error.response.data.message, 5);
    }
  };

  if (!hashtag) return null;
  const initial = {
    _id: hashtag._id,
    name: hashtag.name,
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

export default ManageHashtagUpdate;
