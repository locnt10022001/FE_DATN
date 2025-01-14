import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Space, Tag, Switch, message, } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Voucher } from "../../../types/voucher";
import { GetAllVoucher } from "../../../services/voucher";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";

dayjs.extend(localizedFormat);
dayjs.locale("vi");

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
  }, [])

  const columns: ColumnsType<Voucher> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã Voucher",
      dataIndex: "ma",
      key: "ma",
    },
    {
      title: "Tên Voucher",
      dataIndex: "ten",
      key: "ten",
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
      key: "giaTri",
      render: (value) => `${value}`,
    },
    {
      title: "Giá Trị Tối Đa",
      dataIndex: "giaTriMax",
      key: "giaTriMax",
      render: (value) => `${value} VND`,
    },
    {
      title: "Số Lượng",
      dataIndex: "gioihan",
      key: "gioihan",
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
              setEditingVoucher(record);
              form.setFieldsValue({
                ...record,
                ngayBD: dayjs(record.ngayBD).format("DD/MM/YYYY"),
                ngayKT: dayjs(record.ngayKT).format("DD/MM/YYYY"),
              });
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
    setVouchers((prev) => prev.filter((voucher) => voucher.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedVoucher = {
        ...values,
        ngayBD: values.ngayBD.format("DD/MM/YYYY"),
        ngayKT: values.ngayKT.format("DD/MM/YYYY"),
        id: editingVoucher?.id,
      };
  
      if (editingVoucher) {
        setVouchers((prev) =>
          prev.map((voucher) =>
            voucher.id === editingVoucher.id ? updatedVoucher : voucher
          )
        );
      } else {
        setVouchers((prev) => [...prev, updatedVoucher]);
      }
  
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
          Thêm Voucher
        </Button>
      </Space>
      <Table
        dataSource={vouchers}
        columns={columns}
        rowKey="id"
        bordered
      />
      <Modal
        title={editingVoucher ? "Chỉnh Sửa Voucher" : "Thêm Voucher"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okType="default"
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã Voucher"
            name="ma"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Voucher"
            name="ten"
            rules={[{ required: true, message: "Vui lòng nhập tên voucher" }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="Ngày Bắt Đầu"
            name="ngayBD"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Ngày Kết Thúc"
            name="ngayKT"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
          >
            <DatePicker />
          </Form.Item> */}
          <Form.Item
            label="Giá Trị Voucher (%)"
            name="giaTri"
            rules={[{ required: true, message: "Vui lòng nhập giá trị voucher" }]}>
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item
            label="Giá Trị Tối Đa (VND)"
            name="giaTriMax"
            rules={[{ required: true, message: "Vui lòng nhập giá trị tối đa" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Giới Hạn Số Lượng"
            name="gioihan"
            rules={[{ required: true, message: "Vui lòng nhập giới hạn số lượng" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="Trạng Thái"
            name="tt"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Mô Tả"
            name="moTa"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;

