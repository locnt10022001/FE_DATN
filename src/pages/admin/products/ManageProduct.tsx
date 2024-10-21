import { Table, Empty, Image, message, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { IProduct, ISizes } from '../../../types/product';
import { GetAllProduct, RemoveProduct } from '../../../services/product';
import { Link } from 'react-router-dom';
import ManagementProductCreate from './ManageProductCreate';
import { useEffect, useState } from 'react';

const ManagementProduct = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  useEffect(() => {
    GetAllProduct().then(({ data }) => setProducts(data))
  }, [])

  const HandleRemoveProduct = async (id: string) => {
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
            const response = await RemoveProduct(id);
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = products.filter((data) => data._id !== id);
              setProducts(dataNew);
            }
          }, 2000);
        },
        onCancel: () => {
          message.success('Canceled!');
        },
      });
    } catch (error:any) {
          message.error(error.response.data.message,5);
    }
  };
  const columns = [
    {
      title: 'stt',
      dataIndex: 'index',
      key: 'index',
      width: 5
    },
    {
      title: 'name',
      dataIndex: 'name',
      render: (t: any, r: any) => (
        <Link to={`/products/${r.key}`} target="_blank">{`${r.name}`}</Link>
      ),
    },
    {
      title: 'price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'salePrice',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 5
    },
    {
      title: "sizes",
      dataIndex: "sizes",
      render: (t: any, r: any) => (
        <div className="flex">
          <div className="border border-gray-300">
            <div className="border-b border-gray-300 font-semibold  px-3">
              Size
            </div>
            <div className="font-semibold text-center">quantity</div>
          </div>
          {r.sizes.map((item: any, index: number) => (
            <div
              key={index}
              className="border-b border-t border-r border-gray-300"
            >
              <div className="border-b border-gray-300 font-semibold px-3">
                {item.size}
              </div>
              <div className="text-center">{item.quantity}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'images',
      key: 'images',
      render: (item: IProduct) =>
        <>
          <Image.PreviewGroup
          >
            {item.images.map((image: string, index: number) => (
              <Image style={{ width: 50, height: 50 }} src={image} alt="" key={index} />
            ))}
          </Image.PreviewGroup>
        </>,
    },
    {
      title: 'action',
      render: (item: IProduct) =>
        <>
          <Link to={`/admin/products/${item.key}/update`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
          </Link>
          <button type="button"
            onClick={() => HandleRemoveProduct(item.key)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <DeleteOutlined />
          </button>
        </>
    },
  ];

  const listData = Array.from(products).map((item: IProduct, index: number) => ({
    key: item._id,
    index: index + 1,
    href: '/product/' + item._id,
    name: item.name,
    price: item.price,
    salePrice: item.salePrice,
    quantity: item.quantity,
    sizes: item.sizes,
    images: item.images,
    description: item.description,
    createdAt: item.createdAt,
    tags: item.tags,
    CategoryId: item.CategoryId,
  }));

  if (listData.length == 0)
    return (
      <Empty description={false} />
    )
  return (
    <>
      <ManagementProductCreate />
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

export default ManagementProduct