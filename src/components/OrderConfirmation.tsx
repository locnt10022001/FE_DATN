import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Input, Typography, Divider, Select, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProductDetails } from "../types/productdetails";
import { OrderRequest } from '../types/order';
import { SubmitOrderConfirmation } from '../services/bill';
import { GetAllVoucher } from '../services/voucher';
import { Voucher } from '../types/voucher';

const { Title, Text } = Typography;
const user = localStorage.getItem("user");
const accountId = user ? JSON.parse(user).id : "";


const OrderConfirmation = () => {
  const [orderInfo, setOrderInfo] = useState<{
    province: string | null;
    district: string | null;
    ward: string | null;
    street: string;
    provinceCode: string | null;
    districtCode: string | null;
    wardCode: string | null;
    phoneNumber: string;
    paymentMethod: string;
    products: ProductDetails[];
    totalAmount: number;
    originalTotalAmount: number;
    voucher: number | null;
  }>({
    province: null,
    district: null,
    ward: null,
    street: '',
    provinceCode: null,
    districtCode: null,
    wardCode: null,
    phoneNumber: '',
    paymentMethod: 'COD',
    products: [],
    totalAmount: 0,
    originalTotalAmount: 0,
    voucher: null,
  });

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
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

  useEffect(() => {
    if (orderInfo.provinceCode) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${orderInfo.provinceCode}?depth=2`
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

  useEffect(() => {
    if (orderInfo.districtCode) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(`https://provinces.open-api.vn/api/d/${orderInfo.districtCode}?depth=2`);
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

  useEffect(() => {
    if (state) {
      const { products, totalAmount } = state;
      setOrderInfo((prevState) => ({
        ...prevState,
        products,
        totalAmount,
        originalTotalAmount: totalAmount
      }));
    } else {
      message.error("Không tìm thấy thông tin sản phẩm. Quay lại giỏ hàng.");
      navigate('/cart');
    }
  }, [state, navigate]);
  useEffect(() => {
    GetAllVoucher()
      .then(({ data }) => { setVouchers(data); })
      .catch((error) => {
        console.error('Error fetching vouchers:', error);
        message.error('Không thể tải danh sách voucher.');
      });
  }, []);

  const isFormValid = () => {
    return (
      orderInfo.province &&
      orderInfo.district &&
      orderInfo.ward &&
      orderInfo.street.trim() !== ''
    );
  };

  const handleVoucherChange = (voucherId: number) => {
    const selectedVoucher = vouchers.find((vc: any) => vc.id === voucherId);

    if (selectedVoucher) {
      const discountValue = Math.min((state.totalAmount * selectedVoucher.giaTri) / 100, selectedVoucher.giaTriMax);
      setOrderInfo((prevState) => ({
        ...prevState,
        voucher: voucherId,
        totalAmount: Math.max(0, prevState.originalTotalAmount - discountValue),
      }));
    }
  };


  const handleOrderConfirm = async () => {
    if (!isFormValid()) {
      message.warning('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const sanPham = orderInfo.products.map((pd) => ({
      id: pd.id,
      ma: pd.ma,
      idSanPham: pd.idSanPham,
      idThuongHieu: pd.idThuongHieu,
      idChatLieuVo: pd.idChatLieuVo,
      idLoaiMu: pd.idLoaiMu,
      idKichThuoc: pd.idKichThuoc,
      idKhuyenMai: pd.idKhuyenMai,
      idLoaiKinh: pd.idLoaiKinh,
      idChatLieuDem: pd.idChatLieuDem,
      idMauSac: pd.idMauSac,
      sl: pd.sl,
      donGia: pd.donGia,
      moTaCT: pd.moTaCT,
      anh: pd.anh,
      tt: pd.tt,
      xuatXu: pd.xuatXu,
      nguoiTao: pd.nguoiTao,
      ngayTao: pd.ngayTao,
      nguoiCapNhat: pd.nguoiCapNhat,
      ngayCapNhat: pd.ngayCapNhat,
      formattedGia: pd.formattedGia,
      giaGiam: pd.giaGiam
    }));

    const request: OrderRequest = {
      voucherId: orderInfo.voucher,
      idTaiKhoan: accountId,
      diachi: ` ${orderInfo.street}, ${orderInfo.ward}, ${orderInfo.district}, ${orderInfo.province}`,
      sanPhamList: sanPham,
    };

    try {
      const response = await SubmitOrderConfirmation(request);

      if (response.data === 'Thanh cong') {
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
            <Row>
              <Text strong>Voucher:</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn voucher"
                onChange={handleVoucherChange}
                options={vouchers
                  .sort((a: Voucher, b: Voucher) => b.giaTriMax - a.giaTriMax)
                  .map((voucher: Voucher) => ({
                    label: `${voucher.ten} - Giảm: ${voucher.giaTri}% (Tối đa: ${voucher.giaTriMax.toLocaleString()} đ) - Còn lại: ${voucher.gioihan}`,
                    value: voucher.id,
                  }))}
              />
            </Row>
            <Divider />
            <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
              {orderInfo.products.map((product) => (
                <Row gutter={16} style={{ marginBottom: 20 }} key={product.id}>
                  <Col span={6}>
                    <img src={product.anh} alt={product.anh} style={{ width: '100%' }} />
                  </Col>
                  <Col span={16}>
                    <Title level={3}>{product.idSanPham.ten}</Title>
                    <Text>{product.idMauSac.ten} - {product.idKichThuoc.ten} </Text>
                    <br />
                    <Text>Số lượng: <b>{product.sl}</b> - Đơn giá: <b>{product.formattedGia}</b></Text>
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
            <div style={{ height: '700px' }}>
              <Row>
                <Text strong>Tên người nhận: {user ? JSON.parse(user).name : ""}</Text>
              </Row>
              <Row>
                <Text strong>Tỉnh/Thành phố:</Text>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Chọn tỉnh/thành phố"
                  showSearch
                  optionFilterProp="label"
                  onSelect={(value, option: any) =>
                    setOrderInfo({
                      ...orderInfo,
                      province: option.label, // Lưu tên tỉnh
                      provinceCode: value, // Lưu mã tỉnh
                      district: null,
                      districtCode: null,
                      ward: null,
                      wardCode: null,
                    })
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
                    setOrderInfo({
                      ...orderInfo,
                      district: option.label, // Lưu tên huyện
                      districtCode: value, // Lưu mã huyện
                      ward: null,
                      wardCode: null,
                    })
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
                    setOrderInfo({
                      ...orderInfo,
                      ward: option.label, // Lưu tên xã
                      wardCode: value, // Lưu mã xã
                    })
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