import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, DatePicker, } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Title from "antd/es/typography/Title";
import { Brand } from "../../../types/brand";
import { GetAllBrand, GetAllColor } from "../../../services/productingredients";

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    GetAllBrand().then(({ data }) => {
      try {
        setBrands(data.map((color: any) => ({
          ...color,
          ngayTao: dayjs(color.ngayTao).format("DD/MM/YYYY"),
          ngayCapNhat: dayjs(color.ngayCapNhat).format("DD/MM/YYYY"),
        })));
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        message.error("Không thể tải danh sách màu sắc.");
      }
    });
  }, [])

  const showAddModal = () => {
    setIsEditing(false);
    setCurrentBrand(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: Brand) => {
    setIsEditing(true);
    setCurrentBrand(record);
    form.setFieldsValue({
      ...record,
      ngayTao: dayjs(record.ngayTao),
      ngayCapNhat: dayjs(record.ngayCapNhat),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== id));
    message.success("Xóa thương hiệu thành công!");
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const newBrand = {
          ...values,
          id: isEditing && currentBrand ? currentBrand.id : Date.now(),
          ngayTao: values.ngayTao.format("YYYY-MM-DD"),
          ngayCapNhat: values.ngayCapNhat.format("YYYY-MM-DD"),
        };

        if (isEditing) {
          setBrands((prev) =>
            prev.map((brand) =>
              brand.id === currentBrand?.id ? { ...newBrand } : brand
            )
          );
          message.success("Cập nhật thương hiệu thành công!");
        } else {
          setBrands((prev) => [...prev, newBrand]);
          message.success("Thêm thương hiệu mới thành công!");
        }

        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        message.error("Vui lòng kiểm tra lại thông tin.");
      });
  };

  const columns: ColumnsType<Brand> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên Thương Hiệu",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Mô Tả",
      dataIndex: "moTa",
      key: "moTa",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "ngayTao",
      key: "ngayTao",
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "ngayCapNhat",
      key: "ngayCapNhat",
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title>Quản Lý Thương Hiệu</Title>
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={showAddModal}
        style={{ marginBottom: 20 }}>
        Thêm Thương Hiệu
      </Button>
      <Table columns={columns} dataSource={brands} rowKey="id" />
      <Modal
        title={isEditing ? "Chỉnh Sửa Thương Hiệu" : "Thêm Thương Hiệu"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText={isEditing ? "Cập Nhật" : "Thêm Mới"}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ ngayTao: dayjs(), ngayCapNhat: dayjs() }}
        >
          <Form.Item
            label="Tên Thương Hiệu"
            name="ten"
            rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô Tả"
            name="moTa"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManagement;
