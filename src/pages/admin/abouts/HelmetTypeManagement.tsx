import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { HelmetType } from "../../../types/helmettype";
import { GetAllHelmetType } from "../../../services/productingredients";
import Title from "antd/es/typography/Title";

const HelmetTypeManagement: React.FC = () => {
  const [loaiMu, setLoaiMu] = useState<HelmetType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLoaiMu, setCurrentLoaiMu] = useState<HelmetType | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    GetAllHelmetType().then(({ data }) => {
        setLoaiMu(
          data.map((item: HelmetType) => ({
            ...item,
            ngayTao: dayjs(item.ngayTao).format("YYYY-MM-DD"),
            ngayCapNhat: dayjs(item.ngayCapNhat).format("YYYY-MM-DD"),
          }))
        );
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        message.error("Không thể tải danh sách loại mũ.");
      });
  }, []);

  const showAddModal = () => {
    setIsEditing(false);
    setCurrentLoaiMu(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: HelmetType) => {
    setIsEditing(true);
    setCurrentLoaiMu(record);
    form.setFieldsValue({
      ...record,
      ngayTao: dayjs(record.ngayTao),
      ngayCapNhat: dayjs(record.ngayCapNhat),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    // API DELETE nếu có
    setLoaiMu((prev) => prev.filter((item) => item.id !== id));
    message.success("Xóa loại mũ thành công!");
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const newLoaiMu = {
          ...values,
          id: isEditing && currentLoaiMu ? currentLoaiMu.id : Date.now(),
          ngayTao: values.ngayTao.format("YYYY-MM-DD"),
          ngayCapNhat: values.ngayCapNhat.format("YYYY-MM-DD"),
        };

        if (isEditing) {
          setLoaiMu((prev) =>
            prev.map((item) =>
              item.id === currentLoaiMu?.id ? { ...newLoaiMu } : item
            )
          );
          message.success("Cập nhật loại mũ thành công!");
        } else {
          setLoaiMu((prev) => [...prev, newLoaiMu]);
          message.success("Thêm loại mũ mới thành công!");
        }

        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        message.error("Vui lòng kiểm tra lại thông tin.");
      });
  };

  const columns: ColumnsType<HelmetType> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Mã Loại Mũ", dataIndex: "ma", key: "ma" },
    { title: "Tên Loại Mũ", dataIndex: "ten", key: "ten" },
    { title: "Mô Tả", dataIndex: "moTa", key: "moTa" },
    { title: "Ngày Tạo", dataIndex: "ngayTao", key: "ngayTao" , render: (value)=>dayjs(value).format("DD/MM/YYYY")},
    { title: "Ngày Cập Nhật", dataIndex: "ngayCapNhat", key: "ngayCapNhat",render: (value)=>dayjs(value).format("DD/MM/YYYY") },
    {title: "Hành Động",
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
      <Title level={3} >Quản Lý Loại Mũ</Title>
      <Button
        type="default"
        onClick={showAddModal}
        style={{ marginBottom: 20 }}>
       <PlusOutlined /> Thêm Loại Mũ
      </Button>
      <Table columns={columns} bordered dataSource={loaiMu} rowKey="id" />

      <Modal
        title={isEditing ? "Chỉnh Sửa Loại Mũ" : "Thêm Loại Mũ"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okType="default"
        okText={isEditing ? "Cập Nhật" : "Thêm Mới"}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ ngayTao: dayjs(), ngayCapNhat: dayjs() }}
        >
          <Form.Item
            label="Mã Loại Mũ"
            name="ma"
            rules={[{ required: true, message: "Vui lòng nhập mã loại mũ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Loại Mũ"
            name="ten"
            rules={[{ required: true, message: "Vui lòng nhập tên loại mũ" }]}
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

export default HelmetTypeManagement;
