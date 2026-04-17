import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from 'react-router-dom';
import { GetAllBill, GetOneBill, RemoveBill, AddProductToBill, ProcessPayment, GetProductOnBill } from '../../../services/bill';
import IBill, { ThanhToanRequest, ThemSanPhamRequest } from '../../../types/bill';
import { Button, Form, Input, Radio, Table, Layout, Divider, Modal, message } from 'antd';
import { GetAllProduct, GetAllProductDetail } from '../../../services/product';
import { IProducts } from '../../../types/products';
import { ProductOnBill } from '../../../types/productonbill';
import { BillResponse } from '../../../types/billresponse';
import { ProductDetails } from '../../../types/productdetails';
import intansce from '../../../services/intansce';
const user = localStorage.getItem("user");

const { Sider, Content } = Layout;
type SizeType = Parameters<typeof Form>[0]['size'];

const layoutStyle = {
  borderRadius: 10,
  innerWidth: 100,
};
const contentStyle: React.CSSProperties = {
  background: '#FFFFFF',
  marginRight: 20,
};

const siderStyle: React.CSSProperties = {
  background: '#FFFFFF',
  paddingLeft: 20,
  display: "flex",
  border: "1px solid #d9d9d9",
  borderRadius: 8,
  padding: 16,
  flexDirection: 'column',
};
const UpdateBill = () => {
  const { id }: string | any = useParams();
  const [orders, setOrders] = useState<BillResponse>();
  const [dataSP, setDataSP] = useState<ProductDetails[]>([]);
  const [dataGH, setDataGH] = useState<ProductOnBill[]>([]);
  const [filteredDataSP, setFilteredDataSP] = useState<ProductDetails[]>([]);
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [customerPaid, setCustomerPaid] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const totalAmount = Number(orders?.hoaDon.tongTien || 0);

  const isPaid = orders?.hoaDon.tt === 'Đã thanh toán';

  useEffect(() => {
    if (id) {
      GetOneBill(id).then(({ data }) => setOrders(data[0]));
      GetProductOnBill(id).then(({ data }) => setDataGH(data));
    }

    GetAllProductDetail().then(({ data }) => {
      setDataSP(data);
      setFilteredDataSP(data);
    });
  }, [id]);

  const handleDelete = async (idhd: number, idhdct: number) => {
    if (isPaid) return; // Không cho phép xóa khi đã thanh toán
    try {
      const key = 'deleting';
      await message.loading({ content: 'Đang xóa...', key, duration: 1 });
      const response = await intansce.delete(`/ban-hang/xoa/hdct/${idhd}/${idhdct}`);
      if (response.data == "Xóa thành công") {
        message.success('Xóa thành công.');
        window.location.reload(); 
      } else {
        const errorText = await response;
        throw new Error(`Xóa thất bại: ${errorText}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error('Xóa thất bại!', 3);
    }
  };

  const columnsGH = [
    { title: 'Tên Sản Phẩm', dataIndex: 'ten', key: 'ten' },
    { title: 'Mã', dataIndex: 'ma', key: 'ma' },
    { title: 'Phân loại', dataIndex: 'phanLoai', key: 'phanLoai' },
    { title: 'Số Lượng', dataIndex: 'soluong', key: 'soluong' },
    { title: 'Đơn Giá', dataIndex: 'dongia', key: 'dongia' },
    { title: 'Thành Tiền', dataIndex: 'thanhtien', key: 'thanhtien' },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_: any, record: ProductOnBill) => (
        !isPaid && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(orders?.hoaDon.id ? orders?.hoaDon.id : 0, record.id)}>
            Xóa
          </Button>
        )
      ),
    },
  ];

  const listDataGH: ProductOnBill[] = dataGH.map((item) => ({
    ...item,
    ma: item.idSPCT.ma,
    ten: item.idSPCT.idSanPham.ten,
    phanLoai: `${item.idSPCT.idKichThuoc.ten} - ${item.idSPCT.idMauSac.ten}`,
    soluong: item.sl,
    dongia: item.idSPCT.donGia,
    thanhtien: item.idSPCT.donGia * item.sl,
  }));

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Sản Phẩm', dataIndex: 'ten', key: 'ten' },
    { title: 'Mã', dataIndex: 'ma', key: 'ma' },
    { title: 'Phân loại', dataIndex: 'phanLoai', key: 'phanLoai' },
    { title: 'Số Lượng', dataIndex: 'soluong', key: 'soluong' },
    { title: 'Trạng Thái', dataIndex: 'tt', key: 'tt' },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_: any, product: IProducts) => (
        !isPaid && (
          <Button
            onClick={() => showModal(product)}
            disabled={product.tt === 'Hết hàng'} >
            <PlusCircleOutlined />
          </Button>
        )
      ),
    },
  ];
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const handleModalCancel = () => {
    setModalVisible(false);
    setQuantity(0);
  };
  const handlePaymentChange = (e: any) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);
    setIsCashPayment(selectedMethod === 'TM');
    if (selectedMethod === 'CK') {
      setCustomerPaid(totalAmount);
    } else {
      setCustomerPaid(0);
    }
  };

  const handleCustomerPaidChange = (e: { target: { value: string } }) => {
    const paidAmount = parseFloat(e.target.value) || 0;
    setCustomerPaid(paidAmount);
  };

  const listDataSP = Array.isArray(filteredDataSP) ? filteredDataSP.map((item: ProductDetails) => {
    return {
      id: item.id,
      ma: item.ma,
      ten: item.idSanPham.ten,
      soluong: `${item.sl ? item.sl : "0"}`,
      phanLoai: `${item.idKichThuoc.ten} - ${item.idMauSac.ten}`,
      tt: item.tt,
    };
  }) : [];

  const change = customerPaid - totalAmount > 0 ? customerPaid - totalAmount : 0;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const filteredProducts = dataSP.filter((product) =>
      product.ma.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDataSP(filteredProducts);
  };

  const showModal = (product: IProducts) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    if (selectedProduct) {
      if (!orders?.hoaDon.ma) {
        console.error('Hoa don khong ton tai!');
        return;
      }

      const request: ThemSanPhamRequest = {
        maHoaDon: orders.hoaDon.ma,
        sanPhamId: selectedProduct.id,
        soLuong: quantity,
      };

      try {
        const key = 'loading';
        const loading = await message.loading({ content: 'loading!', key, duration: 2 });

        if (loading) {
          const response = await AddProductToBill(request);
          console.log(response);
          setModalVisible(false);
          setQuantity(0);
          message.success('Tao Hoa Don Thanh Cong.', 3);
          window.location.reload();
        }

      } catch (error) {
        console.error('Loi them san pham:', error);
      }
    }
  };

  const handlePayment = async () => {
    if (!orders?.hoaDon.ma) {
      console.error('Hoa don khong ton tai!');
      return;
    }

    const request: ThanhToanRequest = {
      maHoaDon: orders.hoaDon.ma,
      soTienKhachTra: customerPaid,
    };

    try {
      const key = 'loading';
      const loading = await message.loading({ content: 'Processing payment...', key, duration: 2 });

      if (loading) {
        const response = await ProcessPayment(request);
        console.log(response);
        message.success('Thanh toán thành công!', 3);
        navigate('/admin/order/bill');
      }
    } catch (error) {
      console.error('Loi thanh toan:', error);
      message.error('Thanh toán thất bại, vui lòng thử lại.', 3);
    }
  };

  return (
    <Layout style={layoutStyle}>
      <Content style={contentStyle}>
        <Divider>Giỏ hàng</Divider>
          <Table columns={columnsGH} bordered size='middle' dataSource={listDataGH} pagination={{ pageSize: 5, showQuickJumper: false, hideOnSinglePage: true, }} style={{ height: '33%' }} />
        {!isPaid && (
          <>
           <Divider>Sản phẩm</Divider>
            <Input
              width="330%"
              style={{ marginBottom: 20 }}
              placeholder="Nhập tên sản phẩm"
              value={searchValue}
              onChange={handleSearch} />
            <Table bordered columns={columns} dataSource={listDataSP} size='small' pagination={{ pageSize: 5, showQuickJumper: true, hideOnSinglePage: true, }} style={{ height: '50%' }} />
          </>
        )}
      </Content>
      <Sider width="30%" style={siderStyle}>
        <Divider>THÔNG TIN HOÁ ĐƠN</Divider>
        <Form
          form={form}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={({ size }) => setComponentSize(size)}
          style={{}}>
          <Form.Item label="Mã hoá đơn" style={{ marginBottom: 20 }}>{orders?.hoaDon.ma}</Form.Item>
          <Form.Item label="Người Bán" style={{ marginBottom: 20 }}>{user ? JSON.parse(user).name : ''}</Form.Item>
          <Form.Item label="Ngày Bán" style={{ marginBottom: 20 }}>{orders?.hoaDon.ngayTao}</Form.Item>
          <Form.Item label="Tổng tiền" style={{ marginBottom: 20 }}>{orders?.hoaDon.formattedGia}</Form.Item>
          <Form.Item label="Trạng Thái" style={{ marginBottom: 20 }}>{orders?.hoaDon.tt}</Form.Item>
          {!isPaid && (
            <>
              <Form.Item label="PTTT" style={{ marginBottom: 20 }}>
                <Radio.Group onChange={handlePaymentChange}>
                  <Radio value="TM">Tiền mặt</Radio>
                  <Radio value="CK">Chuyển Khoản</Radio>
                </Radio.Group>
              </Form.Item>
              {isCashPayment && (
                <Form.Item label="Số tiền khách trả" style={{ marginBottom: 20 }}>
                  <Input
                    placeholder="Nhập số tiền khách trả"
                    value={isCashPayment ? customerPaid : totalAmount}
                    onChange={handleCustomerPaidChange}
                    disabled={!isCashPayment} />
                </Form.Item>
              )}
              <Form.Item label="Số tiền trả lại:" style={{ marginBottom: 20 }}>{change}</Form.Item>
              <Form.Item style={{ marginBottom: 20 }}>
                <Button
                  style={{ width: '100%' }}
                  onClick={handlePayment}
                  disabled={!paymentMethod}>
                  THANH TOÁN
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </Sider>

      <Modal
        title="Nhập số lượng"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel} danger>HUỶ</Button>,
          <Button
            key="submit"
            type="default"
            onClick={handleModalOk}
            disabled={quantity <= 0}>THÊM</Button>,
        ]}
      >
        <Input
          type="number"
          min={1}
          placeholder="Nhập số lượng"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
        />
      </Modal>
    </Layout>
  );
};

export default UpdateBill;

