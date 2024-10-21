import { useEffect, useState } from 'react';
import {
  Button, Form, Input, message,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import IAbout from '../../../types/about';
import { GetOneAbout, UpdateAbout } from '../../../services/about';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const ManageAboutUpdate = () => {
  const { id }: string | any = useParams()
  const [about, setabout] = useState<IAbout>();
  useEffect(() => {
    GetOneAbout(id).then(({ data }) => setabout(data))
  }, []);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = async (values: IAbout) => {
    try {
      if (fileList.length === 0) {
        throw new Error("vui lòng nhập hình ảnh!");
      }
      const cloud_name = "dpy2w5vus";
      const upload_preset = "demo_upload";
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append(`file`, file.originFileObj as Blob);
        formData.append('upload_preset', upload_preset);
        formData.append('cloud_name', cloud_name);
        formData.append('folder', 'project');
      });
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, formData, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
        .then(res => res.data);
      values.image = res.secure_url;
      const key = 'loading';
      const loading = await message.loading({ content: 'loading!', key, duration: 2 });
      if (loading) {
        const response = await UpdateAbout(values);
        if (response)
          message.success('successfully update', 3);
      }
      navigate('/admin/abouts');
    } catch (error: any) {
      message.error(error.response.data.message, 5);
    }
  };
  if (!about) return null;
  const initial = {
    _id: about._id,
    name: about.name,
    email: about.email,
    phone: about.phone,
    address: about.address,
    image: about.image,
    description: about.description,
  };
  return (
    <>
      <Form initialValues={initial}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        className="max-w-[1000px] mx-auto"
      >
        <Form.Item hidden
          label="_id"
          name="_id"
        >
          <Input />
        </Form.Item>
        <Form.Item name="name" label="name" rules={[{ message: 'vui lòng nhập name!', required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="email" rules={[{ message: 'vui lòng nhập email!', required: true }]}>
          <Input.TextArea rows={8} />
        </Form.Item>
        <Form.Item name="address" label="address" rules={[{ message: 'vui lòng nhập address!', required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Image">
          <div className="mb-6">
            <Upload
              action=""
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Form.Item>
        <Form.Item
          name="description"
          label="description"
          rules={[
            {
              message: 'vui lòng nhập description!',
              required: true,
            },
          ]}
        >
          <Input.TextArea className='border border-indigo-600 rounded-md px-4 py-2 text-lg' rows={4} />
        </Form.Item>
        <Form.Item>
          <Button style={{ marginLeft: 165 }} type="primary" className="bg-blue-500" htmlType="submit">
            cập nhật
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ManageAboutUpdate;
