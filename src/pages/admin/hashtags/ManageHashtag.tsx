import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Space, Tag, Select, Switch, message, } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";
import { Promotion } from "../../../types/promotions";
import { GetAllPromotion } from "../../../services/voucher";
import Title from "antd/es/typography/Title";
import intansce from "../../../services/intansce";
import { GetAllProductDetail } from "../../../services/product";
import { ProductDetails } from "../../../types/productdetails";

dayjs.extend(localizedFormat);
dayjs.locale("vi");

const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>( null);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);


  useEffect(() => {

    GetAllProductDetail().then(({ data }) => {
      setProducts((data))
    });

    GetAllPromotion().then(({ data }) => {
      try {
        setPromotions(
          data.map((pro: any) => ({
            ...pro,
            ngayBD: dayjs(pro.ngayBD),
            ngayKT: dayjs(pro.ngayKT),
          }))
        );
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        message.error("Không thể tải danh sách khuyến mãi.");
      }
    });
  }, []);

  const columns: ColumnsType<Promotion> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã Khuyến Mãi",
      dataIndex: "ma",
      key: "ma",
    },
    {
      title: "Tên Khuyến Mãi",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Giá Trị Khuyến Mãi",
      dataIndex: "giaTri",
      key: "giaTri",
      render: (value) => `${value} đ`,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "ngayBD",
      key: "ngayBD",
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "ngayKT",
      key: "ngayKT",
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingPromotion(record);
              form.setFieldsValue({
                ...record,
                ngayBD: dayjs(record.ngayBD),
                ngayKT: dayjs(record.ngayKT),
                products: record.productDetailIds || [],
              });
              // setSelectedProducts(record.productDetailIds);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    setPromotions((prev) => prev.filter((promotion) => promotion.id !== id));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
  
      const now = dayjs().format("YYYY-MM-DDTHH:mm:ss"); // Thời gian hiện tại
  
      const payload: Promotion = {
        id: editingPromotion?.id || Date.now(), // Sử dụng ID cũ hoặc tạo ID tạm thời
        ma: values.ma,
        ten: values.ten,
        giaTri: values.giaTri,
        ngayBD: values.ngayBD.format("YYYY-MM-DDTHH:mm:ss"),
        ngayKT: values.ngayKT.format("YYYY-MM-DDTHH:mm:ss"),
        ptkm: values.ptkm,
        dkkm: values.dkkm,
        nguoiTao: editingPromotion ? editingPromotion.nguoiTao : "Admin",
        nguoiCapNhat: "Admin",
        ngayTao: editingPromotion ? editingPromotion.ngayTao : now,
        ngayCapNhat: now,
        tt:true,
        productDetailIds: selectedProducts.map((product) => parseInt(product, 10)),
      };
  
      if (editingPromotion) {
        await intansce.put("/khuyenmai/sua-khuyen-mai", payload);
        message.success("Cập nhật khuyến mãi thành công!");
        setPromotions((prev) =>
          prev.map((promotion) => (promotion.id === editingPromotion.id ? payload : promotion))
        );
      } else {
        const response = await intansce.post("/khuyenmai/khuyen-mai", payload);
        message.success("Thêm khuyến mãi thành công!");
        setPromotions((prev) => [...prev, { ...payload, id: response.data.id }]);
      }
  
      form.resetFields();
      setSelectedProducts([]);
      setEditingPromotion(null);
      setIsModalOpen(false);
    } catch (validationError) {
      console.error("Validation Failed:", validationError);
    }
  };

  return (
    <div>
      <Title level={3}>Quản Lý Khuyến Mãi</Title>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="default"
          onClick={() => {
            form.resetFields();
            setEditingPromotion(null);
            setSelectedProducts([]);
            setIsModalOpen(true);
          }}
        >
          Thêm Khuyến Mãi
        </Button>
      </Space>
      <Table dataSource={promotions} columns={columns} rowKey="id" bordered />
      <Modal
        title={editingPromotion ? "Chỉnh Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã Khuyến Mãi"
            name="ma"
            rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Khuyến Mãi"
            name="ten"
            rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá Trị Khuyến Mãi"
            name="giaTri"
            rules={[{ required: true, message: "Vui lòng nhập giá trị khuyến mãi" }]}
          >
            <InputNumber min="0" />
          </Form.Item>
          <Form.Item
            label="Ngày Bắt Đầu"
            name="ngayBD"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Ngày Kết Thúc"
            name="ngayKT"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Phương Thức Khuyến Mãi"
            name="ptkm"
            rules={[
              { required: true, message: "Vui lòng chọn phương thức khuyến mãi" },
            ]}
          >
            <Select>
              <Select.Option value="Giảm giá theo phần trăm">
                Giảm giá theo phần trăm
              </Select.Option>
              <Select.Option value="Giảm giá cố định">
                Giảm giá cố định
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Chọn Sản Phẩm" name="products">
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              value={selectedProducts}
              onChange={setSelectedProducts}>
              {products.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.idSanPham.ten} - {product.ma} - {product.idKichThuoc.ten} - {product.idMauSac.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Điều Kiện Khuyến Mãi"
            name="dkkm">
            <Input.TextArea rows={3} />
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
