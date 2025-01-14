import React, { useState } from "react";
import {Card,Form,Input,DatePicker,Select,Button,Avatar,Upload,message,Row,Col,} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface Profile {
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  sdt: string;
  email: string;
  cccd: string;
  avatar: string;
}

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<Profile>({
    hoTen: "Nguyễn Văn A",
    ngaySinh: "1990-01-01",
    gioiTinh: "Nam",
    sdt: "0987654321",
    email: "example@gmail.com",
    cccd: "123456789",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false); 

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedProfile = {
          ...values,
          ngaySinh: values.ngaySinh.format("YYYY-MM-DD"),
        };
        setProfile(updatedProfile);
        setIsEditing(false);
        message.success("Cập nhật hồ sơ thành công!");
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        message.error("Cập nhật hồ sơ thất bại, vui lòng kiểm tra lại.");
      });
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ chấp nhận tệp hình ảnh!");
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info: any) => {
      if (info.file.status === "done" || info.file.status === "removed") {
        message.success("Tải ảnh lên thành công!");
      }
    },
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} style={{ textAlign: "center" }}>
            <Avatar
              size={128}
              src={profile.avatar || undefined}
              icon={<UserOutlined />}
              style={{ marginBottom: 20 }}
            />
            <Upload {...uploadProps} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Col>
          <Col xs={24} md={16}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ...profile,
                ngaySinh: dayjs(profile.ngaySinh),
              }}
              disabled={!isEditing}
            >
              <Form.Item
                label="Họ Tên"
                name="hoTen"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ngày Sinh"
                name="ngaySinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                label="Giới Tính"
                name="gioiTinh"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select>
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Số Điện Thoại"
                name="sdt"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="CCCD"
                name="cccd"
                rules={[{ required: true, message: "Vui lòng nhập số CCCD" }]}
              >
                <Input />
              </Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        form.resetFields();
                      }}
                    >
                      Hủy
                    </Button>
                    <Button type="default" onClick={handleSave}>
                      Lưu
                    </Button>
                  </>
                ) : (
                  <Button type="default"  disabled={false} onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProfilePage;
