import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Switch, Upload, message, Tag, Row, Col, } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Account } from "../../../types/account";
import { GetAllUser, GetRole } from "../../../services/user";
import { AccoutnRole } from "../../../types/accountrole";

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [roles, setRoles] = useState<AccoutnRole[]>([]);


  useEffect(() => {
    GetRole().then(({ data }) => setRoles(data));
  }, []);


  useEffect(() => {
    GetAllUser().then(({ data }) => {
      try {
        setAccounts(data.map((color: any) => ({
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


  const columns: ColumnsType<Account> = [
    {
      title: "Tên Đăng Nhập",
      dataIndex: "tenDangNhap",
      key: "tenDangNhap",
    },
    {
      title: "Họ Tên",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Vai Trò",
      dataIndex: "idVaiTro",
      key: "idVaiTro",
      render: (value) => value?.ten || "Không xác định",
    },
    {
      title: "Giới Tính",
      dataIndex: "gioiTinh",
      key: "gioiTinh",
      render: (value) => (value === true ? "Nam" : value === false ? "Nữ" : "Khác"),
    },
    {
      title: "Ngày Sinh",
      dataIndex: "ngaySinh",
      key: "ngaySinh",
      render: (value) => dayjs(value).format("DD/MM/YYYY")
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "sdt",
      key: "sdt",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng Thái",
      dataIndex: "tt",
      key: "tt",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>{value ? "Hoạt động" : "Bị khóa"}</Tag>
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
              setEditingAccount(record);
              form.setFieldsValue({
                ...record,
                gioiTinh: record.gioiTinh === true ? true : record.gioiTinh === false ? false : null,
                idVaiTro: record.idVaiTro?.id,
                ngaySinh: dayjs(record.ngaySinh),
              });
              setIsModalOpen(true);
            }} >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)} >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
    message.success("Xóa tài khoản thành công!");
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedAccount = {
        ...values,
        gioiTinh: values.gioiTinh,
        ngaySinh: values.ngaySinh.format("DD/MM/YYYY"),
        id: editingAccount?.id || Date.now(),
        idVaiTro: roles.find((role) => role.id === values.idVaiTro) || null, // Tìm vai trò từ danh sách roles
        ngayTao: editingAccount ? editingAccount.ngayTao : dayjs().format("DD/MM/YYYY"),
        ngayCapNhat: dayjs().format("DD/MM/YYYY"),
      };

      if (editingAccount) {
        setAccounts((prev) =>
          prev.map((account) =>
            account.id === editingAccount.id ? updatedAccount : account
          )
        );
      } else {
        setAccounts((prev) => [...prev, updatedAccount]);
      }

      form.resetFields();
      setEditingAccount(null);
      setIsModalOpen(false);
      message.success("Lưu tài khoản thành công!");
    });
  };


  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="default"
          onClick={() => {
            form.resetFields();
            setEditingAccount(null);
            setIsModalOpen(true);
          }}>
          Thêm Tài Khoản
        </Button>
      </Space>
      <Table dataSource={accounts} columns={columns} rowKey="id" bordered />

      <Modal
        title={editingAccount ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okType="default"
        okText="Lưu"
        cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên Đăng Nhập"
                name="tenDangNhap"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Họ Tên"
                name="ten"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày Sinh"
                name="ngaySinh">
                <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giới Tính"
                name="gioiTinh"
                rules={[{ required: false, message: "Vui lòng chọn giới tính" }]}>
                <Select>
                  <Select.Option value={true}>Nam</Select.Option>
                  <Select.Option value={false}>Nữ</Select.Option>
                  <Select.Option value={null}>Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="CCCD"
                name="cccd"
                rules={[{ message: "Vui lòng nhập số CCCD" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: "email", message: "Email không hợp lệ" },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Số Điện Thoại"
                name="sdt"
                rules={[{ message: "Vui lòng nhập số điện thoại" }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Vai Trò"
                name="idVaiTro"
                rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
                <Select>
                  {roles.map((role) => (
                    <Select.Option key={role.id} value={role.id}>{role.ten}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng Thái"
                name="tt"
                valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </div>
  );
};

export default AccountManagement;
