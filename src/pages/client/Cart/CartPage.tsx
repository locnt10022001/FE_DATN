import React, { useState, useEffect } from 'react';
import { Table, Checkbox, InputNumber, Button, Card, Row, Col, message, Modal, Select, Divider, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { GetCartProduct } from '../../../services/cart';
import { useNavigate } from 'react-router-dom';
import { ProductDetails } from '../../../types/productdetails';
import EmptyCart from '../../../components/EmptyCart';
const { Title } = Typography;

const { Option } = Select;

const user = localStorage.getItem("user");
const userId = user ? JSON.parse(user).id : "";
type Voucher = {
    id: number;
    code: string;
    discount: number;
};

const vouchers: Voucher[] = [
    { id: 1, code: 'DISCOUNT10', discount: 10 },
    { id: 2, code: 'DISCOUNT20', discount: 20 },
];

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<ProductDetails[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState<ProductDetails | null>(null);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    useEffect(() => {
        GetCartProduct(userId).then(({ data }) => {
            setCartItems(data)
        })
    }, []);

    const navigate = useNavigate();

    const handleCheckout = () => {
        const selectedProducts = cartItems.filter(item => selectedItems.includes(item.id));
        const totalAmount = selectedProducts.reduce((sum, item) => sum + (item.donGia * item.sl), 0);
        const orderInfo = {
            products: selectedProducts,
            totalAmount,
            selectedVoucher: selectedVoucher?.code,
        };

        navigate('/checkout', { state: orderInfo });
    };

    const handleQuantityChange = (value: number, item: ProductDetails) => {
        const newCartItems = cartItems.map(cartItem =>
            cartItem.id === item.id ? { ...cartItem, quantity: value } : cartItem
        );
        setCartItems(newCartItems);
    };

    const handleDelete = (id: number) => {
        const newCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(newCartItems);
        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    };

    const handleSelectItem = (id: number, checked: boolean) => {
        setSelectedItems(prev => checked ? [...prev, id] : prev.filter(itemId => itemId !== id));
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? cartItems.map(item => item.id) : []);
    };

    const handleVoucherSelect = (value: number) => {
        const selected = vouchers.find(voucher => voucher.id === value) || null;
        setSelectedVoucher(selected);
    };

    const handleOpenModal = (item: ProductDetails) => {
        setCurrentItem(item);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        if (currentItem) {
            const newCartItems = cartItems.map(cartItem =>
                cartItem.id === currentItem.id ? currentItem : cartItem
            );
            setCartItems(newCartItems);
        }
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleSizeChange = (size: string) => {
        if (currentItem) {
            setCurrentItem({ ...currentItem, });
        }
    };

    const handleColorChange = (color: string) => {
        if (currentItem) {
            setCurrentItem({ ...currentItem, });
        }
    };

    const totalAmount = selectedItems.reduce(
        (sum, itemId) => {
            const item = cartItems.find(item => item.id === itemId);
            return sum + (item ? item.donGia * item.sl : 0);
        },
        0
    );
    const discountedAmount = selectedVoucher
        ? totalAmount - (totalAmount * selectedVoucher.discount) / 100
        : totalAmount;

    const columns = [
        {
            title: <Checkbox onChange={e => handleSelectAll(e.target.checked)} />,
            dataIndex: 'select',
            render: (_: any, item: ProductDetails) => (
                <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={e => handleSelectItem(item.id, e.target.checked)}
                />
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            render: (_: any, item: ProductDetails) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={item.anh} alt={item.idSanPham.ten} style={{ width: 80, height: 80, marginRight: 8 }} />
                    <span>{item.idSanPham.ten}</span>
                </div>
            ),
        },
        {
            title: '',
            dataIndex: 'category',
            render: (_: any, item: ProductDetails) => (
                <Button type="link" onClick={() => handleOpenModal(item)}>
                    Phân loại hàng:<br />
                    {item.idKichThuoc.ten} - {item.idMauSac.ten}
                </Button>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            render: (_: any, item: ProductDetails) => `${item.donGia.toLocaleString()} đ`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            render: (_: any, item: ProductDetails) => (
                <InputNumber
                    min={1}
                    value={item.sl}
                    onChange={(value) => handleQuantityChange(value as number, item)}
                />
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            render: (_: any, item: ProductDetails) => `${(item.donGia * item.sl).toLocaleString()} đ`,
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: (_: any, item: ProductDetails) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <>
            {cartItems.length === 0 ? (
                <EmptyCart />
            ) : (
                <><Title level={1}>Giỏ Hàng</Title><Divider />
                    <Row gutter={16}>
                        <Col span={16}>
                            <Table
                                columns={columns}
                                dataSource={cartItems}
                                rowKey="id"
                                pagination={false}
                                footer={() => (
                                    <div style={{ textAlign: 'left', padding: '8px 16px' }}>
                                        <Checkbox
                                            onChange={e => handleSelectAll(e.target.checked)}
                                            checked={selectedItems.length === cartItems.length && selectedItems.length > 0}>
                                            Chọn tất cả
                                        </Checkbox>
                                        <span style={{ marginLeft: 16 }}>
                                            Đã chọn ({selectedItems.length} sản phẩm)
                                        </span>
                                    </div>
                                )} />
                        </Col>
                        <Col span={8}>
                            <Card title="Thông tin thanh toán" bordered>
                                <p>Tổng tiền hàng: {totalAmount.toLocaleString()} đ</p>
                                <Select
                                    placeholder="Chọn voucher"
                                    onChange={handleVoucherSelect}
                                    style={{ width: '100%', marginBottom: 16 }}
                                >
                                    {vouchers.map(voucher => (
                                        <Option key={voucher.id} value={voucher.id}>
                                            {voucher.code} - Giảm {voucher.discount}%
                                        </Option>
                                    ))}
                                </Select>
                                {selectedVoucher && (
                                    <p>Áp dụng voucher "{selectedVoucher.code}": -{selectedVoucher.discount}%</p>
                                )}
                                <br />
                                <p>Tổng thanh toán: {discountedAmount.toLocaleString()} đ</p>
                                <Button type="default" block disabled={!selectedItems.length} onClick={handleCheckout}>
                                    Mua hàng ({selectedItems.length})
                                </Button>
                            </Card>
                        </Col>
                    </Row><Modal
                        title="Chọn kích cỡ và màu sắc"
                        visible={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={handleModalCancel}
                        okButtonProps={{ type: 'default' }}
                        cancelButtonProps={{ danger: true }}>
                        <p>Kích cỡ:</p>
                        <Select value={currentItem?.idKichThuoc.ten} onChange={handleSizeChange} style={{ width: '100%' }}>

                        </Select>
                        <p style={{ marginTop: '16px' }}>Màu sắc:</p>
                        <Select value={currentItem?.idMauSac.ten} onChange={handleColorChange} style={{ width: '100%' }}>

                        </Select>
                    </Modal>
                </>
            )}
        </>
    );
};

export default CartPage;