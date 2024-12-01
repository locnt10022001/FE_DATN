// src/pages/ProductManagement.jsx
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import { IProducts } from "../../../types/products";

const ProductManagement = () => {
  const [product, setProducts] = useState<IProducts[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProducts>();

  const [form] = Form.useForm();

  const showAddModal = () => {
    setEditingProduct(undefined);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (product: React.SetStateAction<IProducts | undefined>) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setProducts(product.filter((product: { id: number; }) => product.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        // Edit product
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id ? { ...product, ...values } : product
          )
        );
      } else {
        // Add new product
        setProducts((prev) => [
          ...prev,
          { id: Date.now(), ...values },
        ]);
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Sản Phẩm', dataIndex: 'ten', key: 'ten' },
    { title: 'Mô Tả', dataIndex: 'moTa', key: 'moTa' },
    { title: 'Số Lượng', dataIndex: 'soluong', key: 'soluong' },
    { title: 'Trạng Thái', dataIndex: 'tt', key: 'tt' },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, product: IProducts) => (
        <>
          <Button
            type="link"
            onClick={() => showEditModal(product)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(product.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý sản phẩm</h2>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
        Thêm sản phẩm
      </Button>
      <Table
        dataSource={product}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: "", price: 0 }}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              { type: "number", min: 0, message: "Giá phải là số dương!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;