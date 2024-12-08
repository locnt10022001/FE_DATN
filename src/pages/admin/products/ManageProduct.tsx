import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Select, InputNumber, Row, Col, Modal, Upload, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IProducts } from "../../../types/products";
import { GetAllProduct, GetAllProductDetail } from "../../../services/product";
import { ColumnType } from "antd/es/table";
import { ProductDetails } from "../../../types/productdetails";
import Title from "antd/es/typography/Title";

const { Option } = Select;

const ProductManagement = () => {
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductTableData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    GetAllProductDetail().then(({ data }) => {
      setProducts(data);
    });
  }, []);

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (selectedProduct) {
        setProducts((prev) =>
          prev.map((prod) =>
            prod.id === selectedProduct.id ? { ...prod, ...values, Anh: imagePreview } : prod
          )
        );
      } else {
        setProducts((prev) => [
          ...prev,
          { id: Date.now(), ...values, Anh: imagePreview },
        ]);
      }
      form.resetFields();
      setImagePreview(null);
      setSelectedProduct(null);
      setIsModalVisible(false);
    });
  };

  const handleClearForm = () => {
    form.resetFields();
    setImagePreview(null);
    setSelectedProduct(null);
    setIsModalVisible(true);
  };

  const handleRowClick = (product: ProductTableData) => {
    setSelectedProduct(product);
    form.setFieldsValue(product);
    setImagePreview(product.Anh || null);
    setIsModalVisible(true);
  };

  const handleImageUpload = (info: any) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const columns: Array<ColumnType<ProductTableData>> = [
    { title: "ID", dataIndex: "id", key: "id", fixed: "left", width: 70, align: "center" },
    { title: "Tên Sản Phẩm", dataIndex: "ten", key: "ten", width: 200 },
    { title: "Thương Hiệu", dataIndex: "ID_ThuongHieu", key: "ID_ThuongHieu", width: 150 },
    { title: "Chất Liệu Vỏ", dataIndex: "ID_ChatLieuVo", key: "ID_ChatLieuVo", width: 150 },
    { title: "Loại Mũ", dataIndex: "ID_LoaiMu", key: "ID_LoaiMu", width: 150 },
    { title: "Số Lượng", dataIndex: "SoLuong", key: "SoLuong", align: "right", width: 100 },
    { title: "Đơn Giá", dataIndex: "DonGia", key: "DonGia", align: "right", width: 120 },
    { title: "Xuất Xứ", dataIndex: "XuatXu", key: "XuatXu", width: 150 },
    { title: "Mô Tả Chi Tiết", dataIndex: "MoTaChiTiet", key: "MoTaChiTiet", width: 200 },
    {
      title: "Trạng Thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      width: 120,
      render: (status) => (status === "active" ? "Hoạt động" : "Không hoạt động"),
    },
    {
      title: "Ảnh",
      dataIndex: "Anh",
      key: "Anh",
      width: 150,
      render: (src) => (
        <div
          style={{
            width: "100px",
            height: "100px",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: src ? "none" : "#f5f5f5",
          }}
        >
          {src ? (
            <img src={src} alt="product" style={{ maxWidth: "100%", maxHeight: "100%" }} />
          ) : (
            "No Image"
          )}
        </div>
      ),
    },
  ];

  interface ProductTableData {
    id: number;
    ten: string;
    ID_ThuongHieu: string;
    ID_ChatLieuVo: string;
    ID_LoaiMu: string;
    SoLuong: number;
    DonGia: number;
    XuatXu: string;
    MoTaChiTiet: string;
    TrangThai: string;
    Anh: string;
  }

  const listData: ProductTableData[] = Array.isArray(products)
    ? products.map((item) => ({
      id: item.id,
      ten: item.idSanPham?.ten || "",
      ID_ThuongHieu: item.idThuongHieu?.ten || "",
      ID_ChatLieuVo: item.idChatLieuVo?.ten || "",
      ID_LoaiMu: item.idLoaiMu?.ten || "",
      SoLuong: item.sl,
      DonGia: item.donGia,
      XuatXu: item.xuatXu || "",
      MoTaChiTiet: item.moTaCT || "",
      TrangThai: item.tt || "inactive",
      Anh: item.anh || "",
    }))
    : [];


  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f9f9f9",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
    <Title level={1}>Quản lý sản phẩm</Title>
      <Divider />
      {/* Nút tạo mới */}
      <Button
        type="default"
        style={{ width: "150px", marginBottom: "16px" }}
        onClick={handleClearForm}>Tạo mới sản phẩm</Button>
      {/* Bảng sản phẩm */}
      <div style={{ flex: "1", overflowY: "auto", backgroundColor: "#fff", borderRadius: "8px" }}>
        <Table<ProductTableData>
          dataSource={listData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
      {/* Modal Form */}
      <Modal
        width={1000}
        title={selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" danger onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="save" type="default" onClick={handleSave}>
            Lưu
          </Button>,]}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ten: "",
            ID_ThuongHieu: "",
            ID_ChatLieuVo: "",
            ID_LoaiMu: "",
            SoLuong: 0,
            DonGia: 0,
            Anh: "",
            XuatXu: "",
            MoTaChiTiet: "",
            TrangThai: "",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ten" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="ID_ThuongHieu" label="Thương hiệu">
                <Select placeholder="Chọn thương hiệu">
                  <Option value="1">Thương hiệu A</Option>
                  <Option value="2">Thương hiệu B</Option>
                </Select>
              </Form.Item>
              <Form.Item name="SoLuong" label="Số lượng">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="DonGia" label="Đơn giá">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ảnh">
                <Upload
                  listType="picture"
                  showUploadList={false}
                  beforeUpload={() => false} // Disable automatic upload
                  onChange={handleImageUpload}>
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    border: "1px solid #d9d9d9",
                    marginTop: "16px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: imagePreview ? "none" : "#f5f5f5",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "100%" }} />
                  ) : (
                    "No Image"
                  )}
                </div>
              </Form.Item>
              <Form.Item name="XuatXu" label="Xuất xứ">
                <Input />
              </Form.Item>
              <Form.Item name="MoTaChiTiet" label="Mô tả chi tiết">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="TrangThai" label="Trạng thái">
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
