import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, Select, message,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GetAllCategory } from '../../../services/categories';
import { ICategory } from '../../../types/category';
import IhashTag from '../../../types/hashtag';
import { IProduct } from '../../../types/product';
import { GetAllHashtag } from '../../../services/hashtags';
import { GetOneProduct, UpdateProduct } from '../../../services/product';

type Size = {
  size: string,
  quantity: number,
};
const ManagementProductUpdate = () => {
  const { id }: string | any = useParams()
  const navigate = useNavigate();
  const [product, setproduct] = useState<IProduct>();
  useEffect(() => {
    GetOneProduct(id).then(({ data }) => setproduct(data))
  }, []);
  const [categories, setcategories] = useState<ICategory[]>([]);
  useEffect(() => {
    GetAllCategory().then(({ data }) => setcategories(data))
  }, []);
  const [hashtags, sethashtags] = useState<IhashTag[]>([]);
  useEffect(() => {
    GetAllHashtag().then(({ data }) => sethashtags(data))
  }, []);
  const [files, setFiles]: any = useState([]);
  const [sizes, setSizes] = useState<Size[]>([{ size: '', quantity: 0 }]);

  const onDrop = (acceptedFiles: any) => {
    setFiles((prev: any) => [...prev, ...acceptedFiles]);
  };
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
          _id: values._id,
          name: values.name,
          price: values.price,
          images: images,
          description: values.description,
          CategoryId: values.CategoryId,
          tags: values.tags,
          sizes: sizes,
        }
        const key = 'loading'
        const loading = await message.loading({ content: 'loading!', key, duration: 2 })
        if (loading) {
          const response = await UpdateProduct(DataNew);
          if (response)
            message.success(response.data.message, 3);
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

  if (!product) return null;

  const initial = {
    _id: product._id,
    name: product.name,
    price: product.price,
    images: product.images,
    description: product.description,
    tags: product.tags.map(tag => tag.name),
    CategoryId: product.CategoryId.map(cate => cate.name),
    sizes: product.sizes
  };
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onFinish={onFinish}
      initialValues={initial}
    >
      <Form.Item hidden
        label="_id"
        name="_id"
      >
        <Input />
      </Form.Item>
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
        {product.sizes.map((size, index) => (
          <div className="flex space-x-4 mb-4 mt-8" key={index}>
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
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ManagementProductUpdate;