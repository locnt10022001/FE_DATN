import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Space, message } from "antd";
import dayjs from "dayjs";
import { Voucher } from "../../../types/voucher";
import axios from "axios";
import { GetAllVoucher } from "../../../services/voucher";
import intansce from "../../../services/intansce";
import { ColumnsType } from "antd/es/table";

const VoucherManagement: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    GetAllVoucher().then(({ data }) => {
      try {
        setVouchers(data.map((vc: any) => ({
          ...vc,
          ngayBD: dayjs(vc.ngayBD).format("DD/MM/YYYY"),
          ngayKT: dayjs(vc.ngayKT).format("DD/MM/YYYY"),
        })));
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        message.error("Không thể tải danh sách màu sắc.");
      }
    });
  }, []);

  const columns: ColumnsType<Voucher> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Mã Voucher",
      dataIndex: "ma",
    },
    {
      title: "Tên Voucher",
      dataIndex: "ten",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "ngayBD",
      key: "ngayBD",
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "ngayKT",
      key: "ngayKT",
    },
    {
      title: "Giá Trị",
      dataIndex: "giaTri",
    },
    {
      title: "Giá Trị Tối Đa",
      dataIndex: "giaTriMax",
    },
    {
      title: "Số Lượng",
      dataIndex: "gioihan",
    },
    {
      title: "Action",
      key: "actions",
      render: (_: any, record: React.SetStateAction<Voucher | null>) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingVoucher(record);
              form.setFieldsValue({
                ...record,
              });
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          {/* <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button> */}
        </Space>
      ),
    },
  ];


  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedVoucher = {
        ...values,
        id: editingVoucher?.id,
      };

      if (editingVoucher) {
        intansce.put(`/voucher/update/${editingVoucher.id}`, updatedVoucher)
          .then(({ data }) => {
            setVouchers((prev) => prev.map((voucher) => voucher.id === data.id ? data : voucher));
            message.success("Voucher updated successfully.");
          })
          .catch((error) => {
            console.error("Error updating voucher:", error);
            message.error("Failed to update voucher.");
          });
      } else {
        intansce.post("/voucher/add", updatedVoucher)
          .then(({ data }) => {
            setVouchers((prev) => [...prev, data]); 
            message.success("Voucher added successfully.");
          })
          .catch((error) => {
            console.error("Error adding voucher:", error);
            message.error("Failed to add voucher.");
          });
      }

      // Close the modal and reset the form
      form.resetFields();
      setEditingVoucher(null);
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="default"
          onClick={() => {
            form.resetFields();
            setEditingVoucher(null);
            setIsModalOpen(true);
          }}
        >
          Add Voucher
        </Button>
      </Space>
      <Table
        dataSource={vouchers}
        columns={columns}
        rowKey="id"
      />
      <Modal
        title={editingVoucher ? "Edit Voucher" : "Add Voucher"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Voucher Code"
            name="ma"
            rules={[{ required: true, message: "Please enter voucher code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Voucher Name"
            name="ten"
            rules={[{ required: true, message: "Please enter voucher name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Voucher Value (%)"
            name="giaTri"
            rules={[{ required: true, message: "Please enter voucher value" }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item
            label="Max Value (VND)"
            name="giaTriMax"
            rules={[{ required: true, message: "Please enter max value" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Quantity Limit"
            name="gioihan"
            rules={[{ required: true, message: "Please enter quantity limit" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;
