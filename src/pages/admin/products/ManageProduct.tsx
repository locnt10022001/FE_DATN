import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Divider, message, Upload, Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { ProductResponse } from '../../../types/productresponse';
import { IProducts } from '../../../types/products';
import { ProductDetails } from '../../../types/productdetails';
import { AddNewDetailProduct, AddNewProduct, GetAllProductDetail, GetManageProduct, UpdateProduct } from '../../../services/product';
import Title from 'antd/es/typography/Title';

const ManageProduct: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ProductDetails | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');

  const isValidUrl = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9]+([\\-\\.]{1}[a-zA-Z0-9]+)*\\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\\/.*)?$');
    return pattern.test(url);
  };


  useEffect(() => {
    if (selectedDetail && selectedDetail.anh) {
      setImageUrl(selectedDetail.anh);
    }
  }, [selectedDetail]);

  const handleUrlChange = (e: { target: { value: any; }; }) => {
    const url = e.target.value;
    setImageUrl(url);
  };

  const handleAddProduct = () => {
    form.resetFields();

    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  useEffect(() => {
    GetManageProduct().then(({ data }) => {
      setProducts(data);
    });
  }, [])

  const handleEditProduct = (product: IProducts) => {
    form.setFieldsValue(product);
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddDetail = (product: IProducts) => {
    form.resetFields();
    setImageUrl("")
    setSelectedProduct(product);
    setSelectedDetail(null);
    setIsDetailModalOpen(true);
  };

  const handleEditDetail = (product: IProducts, detail: ProductDetails) => {
    form.setFieldsValue(detail);
    setSelectedProduct(product);
    setSelectedDetail(detail);
    setIsDetailModalOpen(true);
  };

  const handleSaveProduct = async (product: IProducts) => {
    try {
      if (selectedProduct) {
        product.tt = selectedProduct.tt
        const response = await UpdateProduct(selectedProduct.id, product);
        if (response.status === 200) {
          message.success('Cập nhật sản phẩm thành công.');
        } else {
          message.error('Cập nhật sản phẩm thất bại, hãy thử lại sau. ');
        }
      } else {
        const response = await AddNewProduct(product);
        if (response.status === 200) {
          message.success('Thêm sản phẩm thành công.');
        } else {
          message.error('Thêm sản phẩm thất bại, hãy thử lại sau.');
        }
      }
    } catch (error) {
      message.error(`Có lỗi xảy ra: ${error}`);
    }
    setIsProductModalOpen(false);
    window.location.reload();
  };

  const handleSaveDetail = async (values: ProductDetails) => {
    try {
      if (selectedDetail) {
        // const response = await UpdateProductDetail(selectedProduct.id, values);
        // if (response.status === 200) {
        //   message.success('Cập nhật sản phẩm thành công.');
        // } else {
        //   message.error('Cập nhật sản phẩm thất bại, hãy thử lại sau. ');
        // }
      } else {
        const detailProduct = {
          "id": 100,
          "ma": values.ma,
          "idSanPham": values.idSanPham,
          "idThuongHieu": values.idThuongHieu,
          "idChatLieuVo": values.idChatLieuVo,
          "idLoaiMu": values.idLoaiMu,
          "idKichThuoc": values.idKichThuoc,
          "idKhuyenMai": values.idKhuyenMai,
          "idLoaiKinh": values.idLoaiKinh,
          "idChatLieuDem": values.idChatLieuDem,
          "idMauSac": values.idMauSac,
          "sl": values.sl,
          "donGia": values.donGia,
          "moTaCT": values.moTaCT,
          "anh": values.anh,
          "tt": "Còn hàng",
          "xuatXu": "Việt Nam",
          "nguoiTao": "null",
          "nguoiCapNhat": "null",
          "ngayTao": "",
          "ngayCapNhat": "",
          "formattedGia": "",
          "giaGiam":0
        }

        const response = await AddNewDetailProduct(detailProduct);
        if (response.status === 200) {
          message.success('Thêm sản phẩm thành công.');
        } else {
          message.error('Thêm sản phẩm thất bại, hãy thử lại sau.');
        }
      }
    } catch (error) {
      message.error(`Có lỗi xảy ra: ${error}`);
    }
    setIsDetailModalOpen(false);
    window.location.reload();

  };

  const handleDeleteDetail = (productId: number, detailId: number) => {
    setProducts(prev =>
      prev.map(prod =>
        prod.sanPham.id === productId
          ? {
            ...prod,
            chiTietList: prod.chiTietList.filter(detail => detail.id !== detailId),
          }
          : prod
      )
    );
  };

  const productColumns: ColumnsType<IProducts> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
      sorter: (a, b) => a.ten.localeCompare(b.ten),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'tt',
      key: 'tt',
      sorter: (a, b) => a.tt.localeCompare(b.tt),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, product) => (
        <Space>
          <Button type="primary"
            style={{ backgroundColor: "cadetblue", color: 'white' }}
            onClick={() => handleEditProduct(product)}>
            Sửa
          </Button>
          <Button type="primary"
            style={{ backgroundColor: "forestgreen", color: 'white' }} onClick={() => handleAddDetail(product)}>
            Thêm chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const detailColumns: ColumnsType<ProductDetails> = [
    {
      title: 'Mã',
      dataIndex: 'ma',
      key: 'ma',
      width: 70,
    },
    {
      title: "Ảnh",
      dataIndex: "anh",
      key: "anh",
      width: 80,
      align: "center",
      render: (src) => (
        <div
          style={{
            width: "55px",
            height: "55px",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            background: src ? "none" : "#f5f5f5",
          }}>
          {src ? (
            <img src={src} alt="product" style={{ maxWidth: "100%", maxHeight: "100%" }} />
          ) : (
            "No Image"
          )}
        </div>
      ),
    },
    {
      title: 'Mô tả chi tiết',
      dataIndex: 'moTaCT',
      key: 'moTaCT',
      width: 300,
      ellipsis: true,
      render: (text) => (
        <div style={{ whiteSpace: 'normal', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Màu sắc',
      dataIndex: 'mauSac',
      key: 'mauSac',
      width: 70,
    },
    {
      title: 'Kích thước',
      dataIndex: 'kichThuoc',
      key: 'kichThuoc',
      width: 75,
    },
    {
      title: 'Loại mũ',
      dataIndex: 'loaiMu',
      key: 'loaiMu',
      width: 75,
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'thuongHieu',
      key: 'thuongHieu',

      width: 90,
    }, {
      title: 'Số lượng',
      dataIndex: 'sl',
      key: 'sl',
      width: 75,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'formattedGia',
      key: 'formattedGia',
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, detail) => (
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: "cadetblue", color: 'white' }}
            onClick={() => handleEditDetail(selectedProduct!, detail)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chi tiết này?"
            okType='default'
            onConfirm={() => handleDeleteDetail(selectedProduct!.id, detail.id)}>
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Title level={1}>Quản lý sản phẩm</Title>
      <Divider />
      <Button type="default"
        onClick={handleAddProduct} style={{ marginBottom: 16, backgroundColor: "forestgreen", color: 'white' }}>
        Thêm sản phẩm
      </Button>
      <Table
        bordered
        dataSource={products.map(prod => ({ ...prod.sanPham, chiTietList: prod.chiTietList }))}
        columns={productColumns}
        rowKey="id"
        expandable={{
          expandedRowRender: product => (
            <Table
              bordered
              dataSource={(product as any).chiTietList}
              columns={detailColumns}
              rowKey="id"
              pagination={false} />
          ),
        }}
      />

      <Modal
        title={selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        open={isProductModalOpen}
        onCancel={() => setIsProductModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsProductModalOpen(false)}
            style={{
              backgroundColor: '#FF4D4F',
              color: 'white',
              border: 'none',
              fontWeight: 'bold',
            }}>
            Hủy
          </Button>,
          <Button
            key="ok"
            onClick={() => form.submit()}
            type="primary"
            style={{
              backgroundColor: '#4CAF50',
              borderColor: '#4CAF50',
              fontWeight: 'bold',
            }}>
            Lưu
          </Button>,
        ]}
        width={600}
        centered>
        <Form form={form} onFinish={handleSaveProduct} initialValues={selectedProduct || undefined}>
          <Form.Item
            name="ten"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]} >
            <Input />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedDetail ? 'Sửa chi tiết' : 'Thêm chi tiết'}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsDetailModalOpen(false)}
            style={{
              backgroundColor: '#FF4D4F',
              color: 'white',
              border: 'none',
              fontWeight: 'bold',
            }}>
            Hủy
          </Button>,
          <Button
            key="ok"
            onClick={() => form.submit()}
            type="primary"
            style={{
              backgroundColor: '#4CAF50',
              borderColor: '#4CAF50',
              fontWeight: 'bold',
            }}>
            Lưu
          </Button>,
        ]}
        width={600}
        centered >

        <Form form={form} onFinish={handleSaveDetail} initialValues={selectedDetail || undefined}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ma"
                label="Mã chi tiết"
                rules={[{ required: true, message: 'Vui lòng nhập mã chi tiết' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="mauSac"
                label="Màu sắc"
                rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="kichThuoc"
                label="Kích thước"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="loaiMu"
                label="Loại mũ"
                rules={[{ required: true, message: 'Vui lòng nhập loại mũ' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="idThuongHieu.ten"
                label="Thương hiệu"
                rules={[{ required: true, message: 'Vui lòng nhập thương hiệu' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="sl"
                label="Số lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="donGia"
                label="Đơn giá"
                rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}>
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="moTaCT"
                label="Mô tả chi tiết"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả chi tiết' }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="anh"
                label="Ảnh"
                rules={[
                  { required: true, message: 'Vui lòng nhập một liên kết ảnh!' },
                  { validator: (_, value) => value && !isValidUrl(value) ? Promise.reject('Liên kết ảnh không hợp lệ!') : Promise.resolve(), },]}>
                <Input.TextArea rows={6}
                  placeholder="Nhập liên kết ảnh"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {imageUrl && isValidUrl(imageUrl) && (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={imageUrl}
                    alt="Ảnh tải lên"
                    style={{ maxWidth: '260px', maxHeight: '260px', objectFit: 'contain',  borderRadius: '8px' }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageProduct;

