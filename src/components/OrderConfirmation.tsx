import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Input, Typography, Divider, Select, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProductDetails } from "../types/productdetails";
import { OrderRequest } from '../types/order';
import { SubmitOrderConfirmation } from '../services/bill';

const { Title, Text } = Typography;

const OrderConfirmation = () => {
  const [orderInfo, setOrderInfo] = useState<{
    province: string | null;
    district: string | null;
    ward: string | null;
    street: string;
    phoneNumber: string;
    paymentMethod: string;
    products: ProductDetails[];
    totalAmount: number;
    voucher: string | null;
  }>({
    province: null,
    district: null,
    ward: null,
    street: '',
    phoneNumber: '',
    paymentMethod: 'COD',
    products: [],
    totalAmount: 0,
    voucher: null,
  });

  const user = localStorage.getItem("user");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  type StateType = {
    products: ProductDetails[];
    totalAmount: number;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as StateType;

  // Fetch danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        message.error('Không thể tải danh sách tỉnh/thành phố.');
      }
    };
    fetchProvinces();
  }, []);

  // Fetch danh sách quận/huyện
  useEffect(() => {
    if (orderInfo.province) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${orderInfo.province}?depth=2`
          );
          setDistricts(response.data.districts || []);
        } catch (error) {
          console.error('Error fetching districts:', error);
          message.error('Không thể tải danh sách quận/huyện.');
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
    setWards([]);
  }, [orderInfo.province]);

  // Fetch danh sách xã/phường khi quận thay đổi
  useEffect(() => {
    if (orderInfo.district) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(`https://provinces.open-api.vn/api/d/${orderInfo.district}?depth=2`);
          setWards(response.data.wards || []);
        } catch (error) {
          console.error('Error fetching wards:', error);
          message.error('Không thể tải danh sách xã/phường.');
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [orderInfo.district]);

  // Fetch thông tin sản phẩm từ location.state
  useEffect(() => {
    if (state) {
      const { products, totalAmount } = state;
      setOrderInfo((prevState) => ({
        ...prevState,
        products,
        totalAmount,
      }));
    } else {
      message.error("Không tìm thấy thông tin sản phẩm. Quay lại giỏ hàng.");
      navigate('/cart');
    }
  }, [state, navigate]);

  const isFormValid = () => {
    return (
      orderInfo.province &&
      orderInfo.district &&
      orderInfo.ward &&
      orderInfo.street.trim() !== '' &&
      orderInfo.phoneNumber
    );
  };

  const handleOrderConfirm = async () => {
    if (!isFormValid()) {
      message.warning('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const sanPham = orderInfo.products.map((product) => ({
      id: product.id,
      ma: product.ma,
      idSanPham: product.idSanPham,
      idThuongHieu: product.idThuongHieu,
      idChatLieuVo: product.idChatLieuVo,
      idLoaiMu: product.idLoaiMu,
      idKichThuoc: product.idKichThuoc,
      idKhuyenMai: product.idKhuyenMai,
      idLoaiKinh: product.idLoaiKinh,
      idChatLieuDem: product.idChatLieuDem,
      idMauSac: product.idMauSac,
      sl: product.sl,
      donGia: product.donGia,
      moTaCT: product.moTaCT,
      anh: product.anh,
      tt: product.tt,
      xuatXu: product.xuatXu,
      nguoiTao: product.nguoiTao,
      ngayTao: product.ngayTao,
      nguoiCapNhat: product.nguoiCapNhat,
      ngayCapNhat: product.ngayCapNhat,
      formattedGia: product.formattedGia
    }));

    const request: OrderRequest = {
      gioHangId: 0,
      idTaiKhoan: 1,
      diachi: `${orderInfo.street}, ${orderInfo.ward}, ${orderInfo.district}, ${orderInfo.province} - SĐT: ${orderInfo.phoneNumber}`,
      sanPhamList: sanPham,
    };

    try {
      const response = await SubmitOrderConfirmation(request);

      if (response.data === "Thanh cong") {
        message.success('Đơn hàng của bạn đã được xác nhận!');
        navigate('/success');
      } else {
        message.error('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || 'Không thể kết nối đến server, vui lòng thử lại.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Title level={1}>Xác Nhận Đơn Hàng</Title>
      <Divider />
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Thông Tin Sản Phẩm">
            <div style={{ height: '600px', overflowY: 'auto' ,overflowX:'hidden' }}>
              {orderInfo.products.map((product) => (
                <Row gutter={16} style={{ marginBottom: 20 }} key={product.id}>
                  <Col span={6}>
                    <img src={product.anh} alt={product.anh} style={{ width: '100%' }} />
                  </Col>
                  <Col span={16}>
                    <Title level={3}>{product.idSanPham.ten}</Title>
                    <Text>Số lượng: {product.sl}</Text>
                    <br />
                    <Text>{`Đơn giá: ${product.formattedGia}`}</Text>
                    <br />
                    <Title level={5}>Tổng: {`${(product.donGia * product.sl).toLocaleString()} đ`}</Title>
                  </Col>
                </Row>
              ))}
            </div>
            <Divider />
            <Row>
              <Col span={24}>
                <Title level={2}>Tổng tiền: {`${orderInfo.totalAmount.toLocaleString()} đ`}</Title>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Thông Tin Người Nhận">
          <div style={{ height: '700px'}}>
            <Row>
              <Text strong>Tên người nhận: {user ? JSON.parse(user).name:""}</Text>
            </Row>
            <Row>
              <Text strong>Tỉnh/Thành phố:</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn tỉnh/thành phố"
                showSearch
                optionFilterProp="label"
                onSelect={(value, option: any) =>
                  setOrderInfo({ ...orderInfo, province: value, district: null, ward: null })
                }
                options={provinces.map((province) => ({
                  label: province.name,
                  value: province.code,
                }))}
              />
            </Row>
            <Row>
              <Text strong>Quận/Huyện:</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn quận/huyện"
                showSearch
                optionFilterProp="label"
                disabled={!orderInfo.province}
                onChange={(value, option: any) =>
                  setOrderInfo({ ...orderInfo, district: value, ward: null })
                }
                options={districts.map((district) => ({
                  label: district.name,
                  value: district.code,
                }))}
              />
            </Row>
            <Row>
              <Text strong>Xã/Phường:</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn xã/phường"
                showSearch
                optionFilterProp="label"
                disabled={!orderInfo.district}
                onChange={(value, option: any) =>
                  setOrderInfo({ ...orderInfo, ward: value })
                }
                options={wards.map((ward) => ({
                  label: ward.name,
                  value: ward.code,
                }))}
              />
            </Row>
            <Row>
              <Text strong>Số nhà và đường:</Text>
              <Input
                value={orderInfo.street}
                onChange={(e) => setOrderInfo({ ...orderInfo, street: e.target.value })}
              />
            </Row>
            <Row>
              <Text strong>Số điện thoại:</Text>
              <Input
                value={orderInfo.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[0-9]*$/.test(value)) {
                    setOrderInfo({ ...orderInfo, phoneNumber: value });
                  } else {
                    message.warning("Số điện thoại chỉ chứa ký tự số.");
                  }
                }}
              />
            </Row>
            <Row>
              <Text strong>Phương thức thanh toán:</Text>
                <Select
                  value={orderInfo.paymentMethod}
                  onChange={(value) => setOrderInfo({ ...orderInfo, paymentMethod: value })}
                  options={[
                    { value: 'COD', label: 'Thanh toán khi nhận hàng' },
                    { value: 'BANK', label: 'Chuyển khoản' },
                  ]} />
            </Row>
          
            <Divider />
            <Row style={{ textAlign: 'center' }}>
              <Col span={24}>
                <Button
                  className="mb10"
                  type="default"
                  size="large"
                  danger
                  onClick={handleOrderConfirm}
                  disabled={!isFormValid()}
                  style={{ width: '200px', fontSize: '16px' }}>
                  Xác Nhận Đơn Hàng
                </Button>
                <Button size="large" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>
                  Quay Lại
                </Button>
              </Col>
            </Row>
             </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderConfirmation;