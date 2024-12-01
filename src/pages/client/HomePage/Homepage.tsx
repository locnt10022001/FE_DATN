import { Carousel, Row, Col, Typography, Button, Card, message, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import './home.css';
import { useState, useEffect } from "react";
import { SearchProductByName, GetAllProductDetail } from "../../../services/product";
import { ProductDetails } from "../../../types/productdetails";
import ItemProduct from "../../../components/ItemProduct";

const { Title, Text } = Typography;
const { Option } = Select;

const Homepage = () => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const handleSearch = async (value: string) => {
    try {
      setQuery(value);
      const response = await SearchProductByName(value);
      if (response.data.length > 0) {
        message.success("Tìm kiếm sản phẩm thành công");
        setProducts(response.data);
      } else {
        message.warning("Không tìm thấy sản phẩm");
      }
    } catch (error) {
      message.error("Lỗi tìm kiếm sản phẩm");
    }
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    // const sortedProducts = [...products].sort((a, b) => {
    //   if (value === "asc") {
    //     return a.price - b.price;
    //   } else {
    //     return b.price - a.price;
    //   }
    // });
    // setProducts(sortedProducts);
  };

  // Load all products initially
  useEffect(() => {GetAllProductDetail().then(({ data }) => {
    setProducts(data);
  });
}, []);

  return (
    <div className="container mx-auto mt-6">
      <div className="search-bar mb-10">
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          value={query}       
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={() => handleSearch(query)} />
      </div>

      <Carousel autoplay className="mb-6 rounded-lg overflow-hidden shadow-lg">
        <img src="banner1.jpg" alt="Banner 1" className="carousel-img" />
        <img src="banner2.jpg" alt="Banner 2" className="carousel-img" />
        <img src="banner3.jpg" alt="Banner 3" className="carousel-img" />
        <img src="banner4.jpg" alt="Banner 4" className="carousel-img" />
      </Carousel>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={8}>
          <Card hoverable cover={<img alt="Mũ bảo hiểm" src="helmet.jpg" />} className="shadow-md">
            <Title level={5} className="text-center">Mũ bảo hiểm</Title>
            <div className="text-center">
              <Link to="/collections/helmet">
                <Button type="default">Xem ngay</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable cover={<img alt="Phụ kiện" src="accessories.jpg" />} className="shadow-md">
            <Title level={5} className="text-center">Phụ kiện</Title>
            <div className="text-center">
              <Link to="/collections/accessories">
                <Button type="default">Khám phá</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable cover={<img alt="Khuyến mãi" src="sale.jpg" />} className="shadow-md">
            <Title level={5} className="text-center">Khuyến mãi</Title>
            <div className="text-center">
              <Link to="/collections/sale">
                <Button type="default">Xem ngay</Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
      <div className="mt-8 mb-12">
        <Title level={3} className="text-center mb-6">Bộ sưu tập nổi bật</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card hoverable cover={<img alt="Collection 1" src="collection1.jpg" />} className="shadow-md">
              <Title level={5}>Dòng mũ cao cấp</Title>
              <Text>Bảo vệ tối ưu và phong cách độc đáo.</Text>
              <div className="text-center mt-4">
                <Link to="/collections/premium">
                  <Button type="default">Khám phá</Button>
                </Link>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card hoverable cover={<img alt="Collection 2" src="collection2.jpg" />} className="shadow-md">
              <Title level={5}>Dòng phụ kiện hiện đại</Title>
              <Text>Phụ kiện cá tính và tiện ích.</Text>
              <div className="text-center mt-4">
                <Link to="/collections/accessories">
                  <Button type="default">Xem chi tiết</Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="mt-8 mb-12">
          <Title level={2} className="text-center mb-6">Tất cả sản phẩm</Title>
          <div className="filter-section ml-3 mb-6">
            <div className="sort-by">
              <Select
                defaultValue="asc"
                style={{ width: 200 }}
                onChange={handleSortChange}>
                <Option value="asc">Giá: Thấp đến Cao</Option>
                <Option value="desc">Giá: Cao đến Thấp</Option>
              </Select>
            </div>
          </div>
          <ItemProduct products={products} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
