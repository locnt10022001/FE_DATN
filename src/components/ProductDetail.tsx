import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Rate, InputNumber, Tabs, Card, message, Select, Divider, Modal, } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import "./DetailProduct.css";
import { GetProductById } from "../services/product";
import { AddProductToCart } from "../services/bill";
import { ProductResponse } from "../types/productresponse";
import { Signin } from "../services/auth";
import SignupPage from "../pages/client/SignupPage";
import SigninPage from "../pages/client/SigninPage";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ProductDetail: React.FC = () => {
    const [productResponse, setProductResponse] = useState<ProductResponse | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const { id } = useParams<{ id: string }>();
    const productId = id ? parseInt(id, 10) : null;
    const user = localStorage.getItem("user");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const accountId = user ? JSON.parse(user).id : "";

    useEffect(() => {
        if (productId !== null && !isNaN(productId)) {
            setLoading(true);
            GetProductById(productId)
                .then(({ data }) => {
                    setProductResponse(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Lỗi khi tải sản phẩm.");
                    setLoading(false);
                });
        }
    }, [productId]);

    useEffect(() => {
        if (productResponse?.chiTietList && productResponse.chiTietList.length > 0) {
            const uniqueColors = Array.from(
                new Set(productResponse.chiTietList.map((detail) => detail.idMauSac.ten))
            );
            setSelectedColor(uniqueColors[0]);
        }
    }, [productResponse]);

    useEffect(() => {
        if (selectedColor && productResponse?.chiTietList) {
            const sizesForColor = productResponse.chiTietList
                .filter((detail) => detail.idMauSac.ten === selectedColor)
                .map((detail) => detail.idKichThuoc.ten);
            setAvailableSizes(sizesForColor);
            setSelectedSize(sizesForColor[0] || null);
        }
    }, [selectedColor, productResponse]);

    const getProductDetails = () => {
        if (!productResponse?.chiTietList) return null;
        return productResponse.chiTietList.find(
            (detail) => detail.idMauSac.ten === selectedColor && detail.idKichThuoc.ten === selectedSize
        );
    };

    const selectedDetail = getProductDetails();
    const handleAddToCart = async () => {
        if (!selectedDetail || quantity < 1) {
            message.error("Vui lòng chọn đầy đủ thông tin sản phẩm.");
            return;
        }
        try {
            if (!user) {
                message.error({ content: "Bạn phải đăng nhập trước" });
            } else {
                const loading = await message.loading({ content: "Đang thêm sản phẩm vào giỏ hàng...", key: 'loading', duration: 2 });
                if (loading) {
                    const response = await AddProductToCart(selectedDetail.id, accountId, quantity);
                    if (response) {
                        message.success({ content: "Thêm sản phẩm vào giỏ hàng thành công.", key: 'loading', duration: 3 });
                    }
                }
            }
        } catch {
            message.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
        }
    };

    const handleBuyNow = () => {
        message.success("Đang chuyển đến trang thanh toán...");
    };

    return (
        <div className="container mx-auto mt-6 detail-product-page">
            <Title level={2}>Chi Tiết Sản Phẩm</Title>
            <Divider />
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <Row gutter={16}>
                        <Col xs={24} sm={13} md={13}>
                            <Card hoverable className="product-gallery" style={{ textAlign: 'center' }}>
                                {selectedDetail?.anh ? (
                                    <img src={selectedDetail.anh} alt={selectedDetail.idSanPham.ten} style={{
                                        width: '100%',
                                        height: '420px',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }} />
                                ) : (
                                    <p style={{
                                        width: '100%',
                                        height: '420px',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }} ><b>Không có hình ảnh</b></p>
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} sm={11} md={11}>
                            <Card className="product-info-box">
                                <Title level={4}>{selectedDetail?.idSanPham.ten}</Title>
                                <Rate allowHalf defaultValue={5} disabled />
                                <Text> ({100} đánh giá)</Text>

                                {selectedDetail?.giaGiam || 0 > 0 ? (
                                    <div>
                                        <Title delete level={3} style={{ color: "#888" }}>{selectedDetail?.formattedGia || "Loading..."}</Title>
                                        <Title type="danger" style={{ fontWeight: "bold" }} level={1}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedDetail?.giaGiam || 0)}</Title>
                                    </div>
                                ) : (
                                    <div>
                                        <Title style={{ fontWeight: "bold" }}level={1}>{selectedDetail?.formattedGia || "Loading..."}</Title>
                                    </div>
                                )}
                                <div className="color-size-section">
                                    <div className="form-row">
                                        <Text>Màu sắc:</Text>
                                        <Select
                                            value={selectedColor}
                                            style={{ width: 120 }}
                                            onChange={(value) => setSelectedColor(value)}>
                                            {Array.from(
                                                new Set(
                                                    productResponse?.chiTietList.map((detail) => detail.idMauSac.ten)
                                                )
                                            ).map((color) => (
                                                <Option key={color} value={color}>
                                                    {color}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="form-row">
                                        <Text>Kích cỡ:</Text>
                                        <Select
                                            value={selectedSize}
                                            style={{ width: 120 }}
                                            onChange={(value) => setSelectedSize(value)}
                                            disabled={!availableSizes.length}>
                                            {availableSizes.map((size) => (
                                                <Option key={size} value={size}>
                                                    {size}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="form-row">
                                        <Text>Số lượng:</Text>
                                        <InputNumber
                                            min={1}
                                            max={selectedDetail?.sl}
                                            value={quantity}
                                            onChange={(value) => setQuantity(value || 1)}
                                        />
                                        <Text> (Còn lại: {selectedDetail?.sl || 0})</Text>
                                    </div>
                                </div>
                                <div className="button-group mt-20" >
                                    <Button
                                        type="default"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCart}
                                        style={{ marginRight: 10 }}
                                        disabled={!selectedColor || !selectedSize}>
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Link
                                        to="/checkout"
                                        state={{
                                            products: [
                                                {
                                                    id: selectedDetail?.id,
                                                    ma: selectedDetail?.ma,
                                                    idSanPham: selectedDetail?.idSanPham,
                                                    idThuongHieu: selectedDetail?.idThuongHieu,
                                                    idChatLieuVo: selectedDetail?.idChatLieuVo,
                                                    idLoaiMu: selectedDetail?.idLoaiMu,
                                                    idKhuyenMai: selectedDetail?.idKhuyenMai,
                                                    idLoaiKinh: selectedDetail?.idLoaiKinh,
                                                    idChatLieuDem: selectedDetail?.idChatLieuDem,
                                                    moTaCT: selectedDetail?.moTaCT,
                                                    tt: selectedDetail?.tt,
                                                    xuatXu: selectedDetail?.xuatXu,
                                                    nguoiTao: selectedDetail?.nguoiTao,
                                                    ngayTao: selectedDetail?.ngayTao,
                                                    nguoiCapNhat: selectedDetail?.nguoiCapNhat,
                                                    ngayCapNhat: selectedDetail?.ngayCapNhat,
                                                    giaGiam: selectedDetail?.giaGiam,
                                                    sl: quantity || 1,
                                                    donGia: selectedDetail?.donGia || 0,
                                                    anh: selectedDetail?.anh || "",
                                                    idMauSac: {
                                                        id: selectedDetail?.idMauSac?.id || 0,
                                                        ten: selectedColor || "",
                                                    },
                                                    idKichThuoc: {
                                                        id: selectedDetail?.idKichThuoc?.id || 0,
                                                        ten: selectedSize || "",
                                                    },
                                                    formattedGia: selectedDetail?.formattedGia
                                                },
                                            ],
                                            totalAmount: (selectedDetail?.donGia || 0) * (quantity || 1),
                                        }}>
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={handleBuyNow}
                                            disabled={!selectedColor || !selectedSize} >
                                            Mua ngay
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <div className="product-info-tabs mt-8">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Chi tiết sản phẩm" key="1">
                                <Card>
                                    <p>{selectedDetail?.moTaCT || "Không có thông tin chi tiết."}</p>
                                </Card>
                            </TabPane>
                            <TabPane tab="Đánh giá" key="2">
                                <p>Đang cập nhật...</p>
                            </TabPane>
                        </Tabs>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetail;
