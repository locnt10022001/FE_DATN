import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Space, Tag, Select, Switch, message, } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";
import { Promotion } from "../../../types/promotions";
import { GetAllPromotion } from "../../../services/voucher";
import Title from "antd/es/typography/Title";

dayjs.extend(localizedFormat);
dayjs.locale("vi");

const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );

  const [products, setProducts] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {

    
    setProducts(["Sản phẩm A", "Sản phẩm B", "Sản phẩm C", "Sản phẩm D"]);

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
      title: "Giá Trị Khuyến Mãi (%)",
      dataIndex: "giaTri",
      key: "giaTri",
      render: (value) => `${value}%`,
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
      title: "Trạng Thái",
      dataIndex: "tt",
      key: "tt",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>{value ? "Kích hoạt" : "Vô hiệu"}</Tag>
      ),
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
                // products: record.products || [],
              });
              // setSelectedProducts(record.products || []);
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

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedPromotion = {
          ...values,
          ngayBD: values.ngayBD.format("YYYY-MM-DD"),
          ngayKT: values.ngayKT.format("YYYY-MM-DD"),
          products: selectedProducts,
          id: editingPromotion?.id,
        };

        if (editingPromotion) {
          setPromotions((prev) =>
            prev.map((promotion) =>
              promotion.id === editingPromotion.id ? updatedPromotion : promotion
            )
          );
        } else {
          setPromotions((prev) => [...prev, updatedPromotion]);
        }

        form.resetFields();
        setSelectedProducts([]);
        setEditingPromotion(null);
        setIsModalOpen(false);
      })
      .catch((info) => console.error("Validate Failed:", info));
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
            label="Giá Trị Khuyến Mãi (%)"
            name="giaTri"
            rules={[{ required: true, message: "Vui lòng nhập giá trị khuyến mãi" }]}
          >
            <InputNumber min={0} max={100} />
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
              onChange={setSelectedProducts}
            >
              {products.map((product) => (
                <Select.Option key={product} value={product}>
                  {product}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Điều Kiện Khuyến Mãi"
            name="dkkm"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Trạng Thái"
            name="tt"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
