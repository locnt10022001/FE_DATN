import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, Select, message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, } from 'antd';
import { ICategory } from '../../../types/category';
import { IProduct } from '../../../types/product';
import { CreateProduct, GetAllProduct } from '../../../services/product';
import IhashTag from '../../../types/hashtag';
import useFetchData from '../../../hooks/useFetchData';

type Size = {
  size: string,
  quantity: number,
};

const ManagementProductCreate = () => {
  const { data: categories } = useFetchData(`/categories`);
  const { data: hashtags } = useFetchData(`/hashtags`);

  const [open, setOpen] = useState(false);
  const [files, setFiles]: any = useState([]);
  const [sizes, setSizes] = useState<Size[]>([{ size: '', quantity: 0 }]);
  const onDrop = (acceptedFiles: any) => {
    setFiles((prev: any) => [...prev, ...acceptedFiles]);
  };
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', quantity: 0 }]);
  };

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index: number, fieldName: 'size' | 'quantity', value: string | number) => {
    const newSizes: any = [...sizes];
    newSizes[index][fieldName] = value;
    setSizes(newSizes);
  };

  const onFinish = async (values: IProduct) => {
    try {
      const uploaders = await files.map((file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'demo_upload');
        formData.append('cloud_name', 'dpy2w5vus');
        formData.append('folder', 'project');
        return axios.post(
          `https://api.cloudinary.com/v1_1/dpy2w5vus/image/upload`,
          formData
        );
      });
      try {
        const responses: any = await axios.all(uploaders);
        const images = responses.map((response: any) => response.data.secure_url);
        const DataNew: any = {
          name: values.name,
          price: values.price,
          salePrice: values.salePrice,
          images: images,
          description: values.description,
          CategoryId: values.CategoryId,
          tags: values.tags,
          sizes: sizes,
        }
        const key = 'loading'
        const loading = await message.loading({ content: 'loading!', key, duration: 2 })
        if (loading) {
          const response = await CreateProduct(DataNew);
          if (response)
            setOpen(false);
          message.success('create successfully Product', 3);
          navigate('/admin/products');
        }
      } catch (error) {
        console.error(error);
      }
    }
    catch (error: any) {
      message.error(error.response.data.message, 5);
    }
  };

  return (
    <>
      <Button className="rounded-md flex space-x-2 w-24 h-10 font-normal text-sm leading-3 text-indigo-700 bg-white border border-indigo-700 focus:outline-none focus:bg-gray-200 hover:bg-gray-200 duration-150 justify-center items-center" onClick={() => setOpen(true)}>
        <PlusOutlined />
      </Button>
      <Modal
        title="Create product"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={null}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={onFinish}
        >
          <Form.Item name="name" label="Name" rules={[{ message: 'Please enter name!', required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ message: 'Please enter price!', required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item name="salePrice" label="salePrice">
            <Input type='number' />
          </Form.Item>
          <Form.Item label="Image">
            <div className="mb-6">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <UploadOutlined />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </div>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ message: 'Please enter description!', required: true }]}>
            <Input.TextArea rows={8} />
          </Form.Item>
          <Form.Item label="Hashtag" name="tags" rules={[{ message: 'Please enter hashtags!', required: true }]}>
            <Select
              className="bg-gray-50 border mb-6 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              options={hashtags.map((list: IhashTag) => ({
                label: list.name,
                value: list._id,
              }))}
            />
          </Form.Item>
          <Form.Item label="Category" name="CategoryId" rules={[{ message: 'Please enter Categories!', required: true }]}>
            <Select
              className="bg-gray-50 border mb-6 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              options={categories.map((list: ICategory) => ({
                label: list.name,
                value: list._id,
              }))}
            />
          </Form.Item>
          <Form.Item label="Sizes" rules={[{ message: 'Please enter sizes!', required: true }]}>
            {sizes.map((size, index) => (
              <div className="flex space-x-4 mb-4" key={index}>
                <div>
                  <label htmlFor="">size</label>
                  <Input placeholder="Size" type='number' value={size.size} onChange={(e) => handleSizeChange(index, 'size', parseInt(e.target.value))} />
                </div>
                <div>
                  <label htmlFor="">quantity</label>
                  <Input placeholder="Quantity" type="number" value={size.quantity} onChange={(e) => handleSizeChange(index, 'quantity', parseInt(e.target.value))} />
                </div>
                <Button className='mt-6' type="primary" danger onClick={() => handleRemoveSize(index)}>Remove</Button>
              </div>
            ))}
            <Button type="dashed" onClick={handleAddSize}>Add Size</Button>
          </Form.Item>
          <Form.Item>
            <Button style={{ marginLeft: 165 }} type="primary" className="bg-blue-500" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManagementProductCreate;