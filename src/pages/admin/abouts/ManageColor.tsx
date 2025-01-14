import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, DatePicker, message, Space, } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Color } from "../../../types/helmetcolor";
import { GetManageProduct } from "../../../services/product";
import { GetAllColor } from "../../../services/productingredients";
import Title from "antd/es/typography/Title";

const ColorManagement: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentColor, setCurrentColor] = useState<Color | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    GetAllColor().then(({ data }) => {
      try {
        setColors(data.map((color: any) => ({ 
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
    setCurrentColor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: Color) => {
    setIsEditing(true);
    setCurrentColor(record);
    form.setFieldsValue({
      ...record,
      ngayTao: dayjs(record.ngayTao),
      ngayCapNhat: dayjs(record.ngayCapNhat),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/mausac/${id}`);
      setColors((prev) => prev.filter((color) => color.id !== id));
      message.success("Xóa màu sắc thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa màu sắc:", error);
      message.error("Không thể xóa màu sắc.");
    }
  };

  const handleSave = async () => {
    form
      .validateFields()
      .then(async (values) => {
        const newColor = {
          ...values,
          id: isEditing && currentColor ? currentColor.id : Date.now(),
          ngayTao: values.ngayTao.format("YYYY-MM-DD"),
          ngayCapNhat: values.ngayCapNhat.format("YYYY-MM-DD"),
        };

        try {
          if (isEditing) {
            await axios.put(`/mausac/${currentColor?.id}`, newColor);
            setColors((prev) =>
              prev.map((color) =>
                color.id === currentColor?.id ? { ...newColor } : color
              )
            );
            message.success("Cập nhật màu sắc thành công!");
          } else {
            const response = await axios.post("/mausac", newColor);
            setColors((prev) => [...prev, response.data]);
            message.success("Thêm màu sắc mới thành công!");
          }
        } catch (error) {
          console.error("Lỗi khi lưu màu sắc:", error);
          message.error("Không thể lưu màu sắc.");
        }

        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        message.error("Vui lòng kiểm tra lại thông tin.");
      });
  };

  const columns: ColumnsType<Color> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Mã Màu", dataIndex: "ma", key: "ma" },
    { title: "Tên Màu", dataIndex: "ten", key: "ten" },
    { title: "Mô Tả", dataIndex: "moTa", key: "moTa" },
    { title: "Ngày Tạo", dataIndex: "ngayTao", key: "ngayTao" },
    { title: "Ngày Cập Nhật", dataIndex: "ngayCapNhat", key: "ngayCapNhat" },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>Sửa</Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản Lý Màu Sắc</Title>
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={showAddModal}
        style={{ marginBottom: 20 }}>
        Thêm Màu Sắc
      </Button>
      <Table columns={columns} dataSource={colors} bordered rowKey="id" />
      <Modal
        title={isEditing ? "Chỉnh Sửa Màu Sắc" : "Thêm Màu Sắc"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText={isEditing ? "Cập Nhật" : "Thêm Mới"}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ ngayTao: dayjs(), ngayCapNhat: dayjs() }}>
          <Form.Item
            label="Mã Màu"
            name="ma"
            rules={[{ required: true, message: "Vui lòng nhập mã màu" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Màu"
            name="ten"
            rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô Tả"
            name="moTa"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ColorManagement;
