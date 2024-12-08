import { Row, Col, Typography, Button, Rate, InputNumber, Tabs, Card, message, Select, Divider } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useState, useEffect, Key } from "react";
import { Link, useParams } from "react-router-dom";
import "./DetailProduct.css";
import { GetProductById } from "../services/product";
import { ProductDetails } from "../types/productdetails";
import { AddProductToCart } from "../services/bill";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ProductDetail = () => {
    const [product, setProduct] = useState<ProductDetails>();
    const [quantity, setQuantity] = useState<number | null>(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const { id } = useParams<{ id: string }>();
    const productId = id ? parseInt(id, 10) : null;
    const user = localStorage.getItem("user");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId !== null && !isNaN(productId)) {
            setLoading(true);
            GetProductById(productId).then(({ data }) => {
                setProduct(data);
                setLoading(false);
            })
                .catch((err) => {
                    setError(err.message || "Something went wrong");
                    setLoading(false);
                });
        }

    }, [productId]);

    const handleAddToCart = async () => {
        if (!product || !quantity || !selectedColor || !selectedSize) {
            message.error("Vui lòng chọn đầy đủ thông tin sản phẩm.");
            return;
        }
        try {
            const key = "loading";
            message.loading({ content: "Đang thêm sản phẩm vào giỏ hàng...", key });
            const accountId = user ? JSON.parse(user).id : "";
            const response = await AddProductToCart(
                product.idSanPham.id,
                accountId,
                quantity
            );
            console.log("Phản hồi API:", response);
            message.success({ content: "Thêm sản phẩm vào giỏ hàng thành công.", key, duration: 3 });
            window.location.reload();
        } catch (error) {
            console.error("Lỗi thêm sản phẩm:", error);
            message.error({ content: "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng." });
        }
    };
    const handleBuyNow = () => {
        message.success("Proceeding to checkout");
    };

    return (
        <div className="container mx-auto mt-6 detail-product-page">
            <Title level={2}>Chi Tiết Sản Phẩm</Title>
            <Divider />
            <Row gutter={16}>
                <Col xs={24} sm={13} md={13}>
                    <Card hoverable className="product-gallery">
                        <div className="image-container">
                            {product?.anh ? (<img src={product.anh} alt={product.idSanPham.ten} className="main-product-image" />
                            ) : (<span className="placeholder-text">Image Not Available</span>)}
                        </div>
                        <div className="thumbnail-gallery">
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={11} md={11} >
                    <Card className="product-info-box">
                        <Title level={4}>{product?.idSanPham.ten}</Title>
                        <Rate allowHalf defaultValue={5} />
                        <Text className="review-count">  ({100} reviews)</Text>
                        <br />
                        <div className="price-section mt-10 mb-10">
                            <Title level={1} className="discounted-price">
                                {`${product?.formattedGia}`}
                            </Title>
                        </div>
                        <div className="color-size-section">
                            <div className="form-row">
                                <Text className="form-label">Màu sắc:</Text>
                                <Select
                                    placeholder="Chọn màu"
                                    style={{ width: 120 }}
                                    onChange={(value) => setSelectedColor(value)}>
                                    {product?.idMauSac && (
                                        <Option key={product.idMauSac.id} value={product.idMauSac.ten}>
                                            {product.idMauSac.ten}
                                        </Option>
                                    )}
                                </Select>
                            </div>

                            <div className="form-row">
                                <Text className="form-label">Kích cỡ:</Text>
                                <Select
                                    placeholder="Chọn size"
                                    style={{ width: 120 }}
                                    onChange={(value) => setSelectedSize(value)}>
                                    {product?.idKichThuoc && (
                                        <Option key={product.idKichThuoc.id} value={product.idKichThuoc.ten}>
                                            {product.idKichThuoc.ten}
                                        </Option>
                                    )}
                                </Select>
                            </div>

                            <div className="form-row">
                                <Text className="form-label">Số lượng:</Text>
                                <InputNumber
                                    min={1}
                                    max={product?.sl}
                                    value={quantity}
                                    onChange={setQuantity}
                                />
                                <Text className="stock-count">(Còn lại: {product?.sl})</Text>
                            </div>
                        </div>

                        <div className="button-group mt-20">
                            <Button
                                type="default"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                className="add-to-cart-button"
                                disabled={!selectedColor || !selectedSize} >
                                Thêm vào giỏ hàng
                            </Button>
                            <Link
                                to="/checkout"
                                state={{
                                    products: [
                                        {
                                            id: product?.id,
                                            idSanPham: {
                                                id: product?.idSanPham.id,
                                                ten: product?.idSanPham.ten,
                                            },
                                            sl: quantity || 1,
                                            donGia: product?.donGia || 0,
                                            anh: product?.anh || "",
                                            idMauSac: {
                                                id: product?.idMauSac?.id || 0,
                                                ten: selectedColor || "",
                                            },
                                            idKichThuoc: {
                                                id: product?.idKichThuoc?.id || 0,
                                                ten: selectedSize || "",
                                            },
                                            formattedGia: product?.formattedGia
                                        },
                                    ],
                                    totalAmount: (product?.donGia || 0) * (quantity || 1),
                                }}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    onClick={handleBuyNow}
                                    className="buy-now-button"
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
                            <p>{product?.moTaCT}</p>
                        </Card>
                    </TabPane>
                    <TabPane tab="Đánh giá" key="2">
                        Comming soon...
                        {/* {product.reviews.map((review, index) => (
              <div key={index} className="review">
                <Text strong>{review.user}</Text>
                <Rate allowHalf defaultValue={review.rating} disabled />
                <p>{review.comment}</p>
              </div>
            ))} */}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default ProductDetail;
