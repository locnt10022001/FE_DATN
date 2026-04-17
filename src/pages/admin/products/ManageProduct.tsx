import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Divider, message, Select, Row, Col } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { ProductResponse } from '../../../types/productresponse';
import { IProducts } from '../../../types/products';
import { ProductDetails } from '../../../types/productdetails';
import { AddNewDetailProduct, AddNewProduct, GetManageProduct, UpdateProduct, UpdateProductDetails } from '../../../services/product';
import { GetAllBrand, GetAllColor, GetAllCushionMaterial, GetAllHelmetGlass, GetAllHelmetType, GetAllShellMaterial, GetAllSize } from '../../../services/productingredients';
import { HelmetType } from '../../../types/helmettype';
import { Brand } from '../../../types/brand';
import { Color } from '../../../types/helmetcolor';
import { HelmetSize } from '../../../types/helmetsize';
import { HelmetGlasses } from '../../../types/helmetglasses';
import { ShellMaterial } from '../../../types/shellmaterial';
import { CushionMaterial } from '../../../types/cushionmaterial';
const user = localStorage.getItem("user");

const ManageProduct: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ProductDetails | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [loaiMu, setLoaiMu] = useState<HelmetType[]>([]);
  const [thuongHieu, setThuongHieu] = useState<Brand[]>([]);
  const [mauSac, setMauSac] = useState<Color[]>([]);
  const [kichThuoc, setKichThuoc] = useState<HelmetSize[]>([]);
  const [loaiKinh, setLoaiKinh] = useState<HelmetGlasses[]>([]);
  const [chatLieuVo, setChatLieuVo] = useState<ShellMaterial[]>([]);
  const [chatLieuDem, setChatLieuDem] = useState<CushionMaterial[]>([]);

  const isValidUrl = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9]+([\\-\\.]{1}[a-zA-Z0-9]+)*\\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\\/.*)?$');
    return pattern.test(url);
  };

  const fetchIngredients = async () => {
    try {
      const [helmetTypes, brands, colors, sizes, helmetGlasses, shellMaterials, cushionMaterials] = await Promise.all([
        GetAllHelmetType(),
        GetAllBrand(),
        GetAllColor(),
        GetAllSize(),
        GetAllHelmetGlass(),
        GetAllShellMaterial(),
        GetAllCushionMaterial()
      ]);

      setLoaiMu(helmetTypes.data);
      setThuongHieu(brands.data);
      setMauSac(colors.data);
      setKichThuoc(sizes.data);
      setLoaiKinh(helmetGlasses.data);
      setChatLieuVo(shellMaterials.data);
      setChatLieuDem(cushionMaterials.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      message.error('Không thể tải dữ liệu thành phần');
    }
  };
  useEffect(() => {
    fetchIngredients();
  }, []);

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
    form.resetFields()
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

  const handleSaveDetail = async (values: any) => {
    try {
      let response;

      if (selectedDetail) {
        response = await UpdateProductDetails(selectedDetail.id, {
          ...values,
          idSanPham: selectedDetail.idSanPham.id,
          idKichThuoc: (values.kichThuoc === selectedDetail.idKichThuoc.ten) ? selectedDetail.idKichThuoc.id : kichThuoc.find(item => item.id === values.kichThuoc)?.id,
          idThuongHieu: (values.thuongHieu === selectedDetail.idThuongHieu.ten) ? selectedDetail.idThuongHieu.id : thuongHieu.find(item => item.id === values.thuongHieu)?.id,
          idChatLieuVo: (values.chatLieuVo === selectedDetail.idChatLieuVo.ten) ? selectedDetail.idChatLieuVo.id : chatLieuVo.find(item => item.id === values.thuongHieu)?.id,
          idChatLieuDem: (values.chatLieuDem === selectedDetail.idChatLieuDem.ten) ? selectedDetail.idChatLieuDem.id : chatLieuDem.find(item => item.id === values.chatLieuDem)?.id,
          idLoaiMu: (values.loaiMu === selectedDetail.idLoaiMu.ten) ? selectedDetail.idLoaiMu.id : loaiMu.find(item => item.id === values.loaiMu)?.id,
          idLoaiKinh: (values.loaiKinh === selectedDetail.idLoaiKinh.ten) ? selectedDetail.idLoaiKinh.id : loaiKinh.find(item => item.id === values.loaiKinh)?.id,
          idMauSac: (values.mauSac === selectedDetail.idMauSac.ten) ? selectedDetail.idMauSac.id : mauSac.find(item => item.id === values.mauSac)?.id,

          tt: "Còn hàng",
          xuatXu: "Việt Nam",
          nguoiTao: user ? JSON.parse(user).name : '',
          nguoiCapNhat: user ? JSON.parse(user).name : '',
        });
      } else {
        if (!selectedProduct) {
          message.error('Vui lòng chọn một sản phẩm trước khi thêm chi tiết.');
          return;
        }
        response = await AddNewDetailProduct({
          ...values,
          idKichThuoc: values.kichThuoc,
          idSanPham: selectedProduct.id,

          idThuongHieu: values.thuongHieu,
          idChatLieuVo: values.chatLieuVo,
          idChatLieuDem: values.chatLieuDem,
          idLoaiMu: values.loaiMu,
          idLoaiKinh: values.loaiKinh,
          idMauSac: values.mauSac,

          tt: "Còn hàng",
          xuatXu: "Việt Nam",
          nguoiTao: user ? JSON.parse(user).name : '',
          nguoiCapNhat: user ? JSON.parse(user).name : '',
        });
      }
      if (response.data === "Thanh cong") {
        message.success(
          selectedDetail
            ? 'Cập nhật chi tiết sản phẩm thành công.'
            : 'Thêm chi tiết sản phẩm thành công.'
        );
      } else {
        message.error('Đã xảy ra lỗi khi lưu chi tiết sản phẩm, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error('Lỗi kết nối API. Vui lòng kiểm tra và thử lại.');
    } finally {
      window.location.reload()
      setIsDetailModalOpen(false);
    }
  };

  // const handleDeleteDetail = (productId: number, detailId: number) => {
  //   setProducts(prev =>
  //     prev.map(prod =>
  //       prod.sanPham.id === productId
  //         ? {
  //           ...prod,
  //           chiTietList: prod.chiTietList.filter(detail => detail.id !== detailId),
  //         }
  //         : prod
  //     )
  //   );
  // };

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
      sorter: (a, b) => {
        const ttA = a.tt || '';
        const ttB = b.tt || '';
        return ttA.localeCompare(ttB);
      },
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
      dataIndex: 'idMauSac',
      key: 'idMauSac',
      render: (idMauSac) => {
        const color = mauSac.find(item => item.id === idMauSac.id);
        return color ? color.ten : 'Chưa có màu';
      },
    },
    {
      title: 'Kích thước',
      dataIndex: 'idKichThuoc',
      key: 'idKichThuoc',
      render: (idKichThuoc) => {
        const color = kichThuoc.find(item => item.id === idKichThuoc.id);
        return color ? color.ten : 'Chưa có màu';
      }
    },
    {
      title: 'Loại mũ',
      dataIndex: 'idLoaiMu',
      key: 'idLoaiMu',
      render: (idLoaiMu) => {
        const color = loaiMu.find(item => item.id === idLoaiMu.id);
        return color ? color.ten : 'Chưa có màu';
      }
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'idThuongHieu',
      key: 'idThuongHieu',
      render: (idThuongHieu) => {
        const color = thuongHieu.find(item => item.id === idThuongHieu.id);
        return color ? color.ten : 'Chưa có màu';
      }
    }, {
      title: 'Số lượng',
      dataIndex: 'sl',
      key: 'sl',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'formattedGia',
      key: 'formattedGia',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, detail) => (
        <Space >
          <Button
            type="primary"
            style={{ backgroundColor: "cadetblue", color: 'white' }}
            onClick={() => handleEditDetail(selectedProduct!, detail)}>
            Sửa
          </Button>

          {/* <Popconfirm
            title="Bạn có chắc chắn muốn xóa chi tiết này?"
            okType='default'
            onConfirm={() => {
              if (selectedProduct?.id && detail.id) {
                handleDeleteDetail(selectedProduct.id, detail.id);
              } else {
                message.error('Không có thông tin chi tiết để xóa.');
              }
            }}>
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm> */}
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
                label="Màu sắc"
                name="mauSac"
                initialValue={selectedDetail ? mauSac.find(item => item.id === selectedDetail.idMauSac.id)?.ten : undefined}>
                <Select>
                  {mauSac.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kích thước"
                name="kichThuoc"
                initialValue={selectedDetail ? kichThuoc.find(item => item.id === selectedDetail.idKichThuoc.id)?.ten : undefined}>
                <Select>
                  {kichThuoc.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại mũ"
                name="loaiMu"
                initialValue={selectedDetail ? loaiMu.find(item => item.id === selectedDetail.idLoaiMu.id)?.ten : undefined}>
                <Select>
                  {loaiMu.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thương hiệu" name="thuongHieu"
                initialValue={selectedDetail ? thuongHieu.find(item => item.id === selectedDetail.idThuongHieu.id)?.ten : undefined}>
                <Select>
                  {thuongHieu.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Chất liệu đệm"
                name="chatLieuDem"
                initialValue={selectedDetail ? chatLieuDem.find(item => item.id === selectedDetail.idChatLieuDem.id)?.ten : undefined}>
                <Select>
                  {chatLieuDem.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chất liệu vỏ"
                name="chatLieuVo"
                initialValue={selectedDetail ? chatLieuVo.find(item => item.id === selectedDetail.idChatLieuVo.id)?.ten : undefined}>
                <Select>
                  {chatLieuVo.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Loại kính"
                name="loaiKinh"
                initialValue={selectedDetail ? loaiKinh.find(item => item.id === selectedDetail.idLoaiKinh.id)?.ten : undefined}>
                <Select>
                  {loaiKinh.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sl"
                label="Số lượng"

                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                <Input type="number" min={1} />
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
                    style={{ maxWidth: '260px', maxHeight: '260px', objectFit: 'contain', borderRadius: '8px' }}
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
