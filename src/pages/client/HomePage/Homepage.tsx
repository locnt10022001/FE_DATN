import { Carousel, Row, Col, Typography, Button, Card, message, Input, Select, Pagination, Divider } from "antd";
import { Link } from "react-router-dom";
import "./home.css";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(6);
  useEffect(() => {
    GetAllProductDetail().then(({ data }) => {
      setProducts(data);
    });
  }, []);

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
    const sortedProducts = [...products].sort((a, b) => {
      if (value === "asc") return a.donGia - b.donGia;
      return b.donGia - a.donGia;
    });
    setProducts(sortedProducts);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Paginate products
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mx-auto mt-6">
      <div className="search-bar mb-10">
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={() => handleSearch(query)}
        />
      </div>
      <Carousel autoplay className="mb-6 rounded-lg overflow-hidden shadow-lg">
        <img src="https://bansinonbaohiem.com/wp-content/uploads/2018/07/banner-ban-si-non-bao-hiem-hcm.jpg" alt="Banner 1" className="carousel-img" onClick={console.log} />
        <img src="https://img.freepik.com/free-psd/rider-concept-banner-template_23-2148634991.jpg?t=st=1733675458~exp=1733679058~hmac=7cb8baaebccb217a3e8b6e609892baa6d4d47f813ecd1b2d4636407c9920135f&w=2000" alt="Banner 2" className="carousel-img" onClick={console.log} />
        <img src="https://img.freepik.com/free-vector/gradient-racing-template-design_23-2150152645.jpg?t=st=1733675512~exp=1733679112~hmac=c84655a064b69fabab34d2219ff4fc246f738b8f440cd79fbdebe2c21c798ce8&w=2000" alt="Banner 3" className="carousel-img" onClick={console.log} />
        <img src="https://img.freepik.com/premium-psd/psd-black-friday-super-sale-web-banner-template_428858-1461.jpg?w=2000" alt="Banner 4" className="carousel-img" onClick={console.log} />
      </Carousel>
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={8}>
          <Card hoverable cover={<img alt="Mũ bảo hiểm" src="https://i.pinimg.com/736x/ef/f9/6a/eff96a76042db1a2bf0ca44d07721146.jpg" style={{ height: "200px", maxHeight: "200px", objectFit: "cover" }} />} className="shadow-md">
            <Title level={5} className="text-center">Mũ bảo hiểm</Title>
            <div className="text-center">
              <Link to="/collections/helmet">
                <Button type="default">Xem ngay</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable cover={<img alt="Phụ kiện" src="https://media.istockphoto.com/id/1196940598/photo/winter-ski-accessories-comosition-on-white-wooden-table-with-free-space-in-the-middle-for.jpg?s=612x612&w=0&k=20&c=fCjaVSmWXzaQPvdDUuaYOfymL-gF5gA7xeSA9oeyUPg=" style={{ maxHeight: "200px", objectFit: "cover" }} />} className="shadow-md">
            <Title level={5} className="text-center">Phụ kiện</Title>
            <div className="text-center">
              <Link to="/collections/accessories">
                <Button type="default">Khám phá</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable cover={<img alt="Khuyến mãi" src="https://img.freepik.com/free-psd/black-friday-super-sale-facebook-cover-template_106176-1558.jpg?t=st=1733675408~exp=1733679008~hmac=2bdccf171537c6b9b4dca9b8ad834b6c73428e2c4fe34df334b149acb9a3260a&w=2000" style={{ height: "200px", maxHeight: "200px", objectFit: "cover" }} />} className="shadow-md">
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
        <Divider><Title level={3} className="text-center mb-6">Bộ sưu tập nổi bật</Title></Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card hoverable cover={<img alt="Collection 1" src="https://media.istockphoto.com/id/891419012/vi/anh/quang-c%E1%BA%A3nh-c%C3%A1c-ph%E1%BB%A5-ki%E1%BB%87n-ng%C6%B0%E1%BB%9Di-%C4%91i-xe-m%C3%A1y-%C4%91%C6%B0%E1%BB%A3c-%C4%91%E1%BA%B7t-tr%C3%AAn-b%C3%A0n-g%E1%BB%97-tr%E1%BA%AFng.jpg?s=1024x1024&w=is&k=20&c=hXrLDPrS7zArJoCW0g6srYg7GWt5jrLSanwLUqOJhRk=" style={{ height: "250px", maxHeight: "250px", objectFit: "cover" }} />} className="shadow-md">
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
            <Card hoverable cover={<img alt="Collection 2" src="https://media.istockphoto.com/id/821513208/vi/anh/%C4%91%E1%BA%B7t-thi%E1%BA%BFt-b%E1%BB%8B-xe-%C4%91%E1%BA%A1p-tr%C3%AAn-n%E1%BB%81n-gi%E1%BA%A5y-tr%E1%BA%AFng.jpg?s=1024x1024&w=is&k=20&c=T-tnS-fLhgPy3pP1JZAVNSPIu4rLR3q9TmoM7tLhye0=" style={{ height: "250px", maxHeight: "250px", objectFit: "cover" }} />} className="shadow-md">
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
      </div>
      <div className="mt-8 mb-12">
        <Divider><Title level={1} className="text-center mb-6">Tất cả sản phẩm</Title></Divider>
        <div className="filter-section ml-3 mb-6">
          <Select
            defaultValue="asc"
            style={{ width: 200 }}
            onChange={handleSortChange}
          >
            <Option value="asc">Giá: Thấp đến Cao</Option>
            <Option value="desc">Giá: Cao đến Thấp</Option>
          </Select>
        </div>
        <ItemProduct products={paginatedProducts} />
        <div className="pagination mt-8 text-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={products.length}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;