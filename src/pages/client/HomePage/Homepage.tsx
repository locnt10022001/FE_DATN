import { SearchOutlined } from "@ant-design/icons";
import { Carousel, Input, message } from "antd";
import { useState } from "react";
import {
  FindProductByPrice,
  SearchProductByName,
} from "../../../services/product";
import { IProduct } from "../../../types/product";
import { Link } from "react-router-dom";
import ListProductByCategories from "../../../components/ListProductByCategories";
import FilterProductByPrice from "../../../components/FilterProductByPrice";
import SearchProduct from "../../../components/SearchProduct";
const Homepage = () => {
  const [query, setQuery] = useState<any>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const handleSearch = async (value: string) => {
    try {
      setQuery(value);
      const response = await SearchProductByName(value);
      message.success("Tìm kiếm sản phẩm thành công");
      setProducts(response.data);
    } catch (error: any) {
      message.warning("Không tìm thấy dữ liệu");
    }
  };
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const handleFilter = async () => {
    try {
      setQuery([minPrice, maxPrice]);
      const response = await FindProductByPrice(minPrice, maxPrice);
      message.success("Tìm kiếm sản phẩm thành công");
      setProducts(response.data);
    } catch (error: any) {
      message.warning("Không tìm thấy dữ liệu");
    }
  };
  return (
    <section className="py-20 pt-0 bg-gray-50 font-poppins dark:bg-gray-800 ">
      <div className="banner">
        <Carousel autoplay>
          <img
            src="https://theme.hstatic.net/1000376021/1000834008/14/slideshow_4.jpg?v=3691"
            alt=""
          />
          <img
            src="https://theme.hstatic.net/1000376021/1000834008/14/slideshow_5.jpg?v=3691"
            alt=""
          />
          <img
            src="https://theme.hstatic.net/1000376021/1000834008/14/slideshow_6.jpg?v=3691"
            alt=""
          />
          <img
            src="https://file.hstatic.net/1000376021/file/1920x720_copy_42b3f822c4ca4cd099bfb116931e6361.png"
            alt=""
          />
        </Carousel>
      </div>
      <div className=" py-4 mx-auto max-w-7xl lg:py-6 ">
        <div className="p-4 mb-5 dark:border-gray-900 dark:bg-gray-900">
          <nav id="store" className="w-full z-30 top-0 py-1">
            <div className="w-full container flex justify-between items-center">
              <Link
                className="mr-4 uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl "
                to=""
              >
                Store
              </Link>
              <div className="flex items-center" id="store-nav-content">
                <div className="relative flex items-center">
                  <Input.Search
                    className="w-full max-w-xs p-2 rounded-full bg-[#5765be] focus:bg-white"
                    placeholder="search product"
                    onSearch={handleSearch}
                    enterButton={<SearchOutlined />}
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="flex flex-wrap mb-24 -mx-3">
          <div className="w-full pr-4 lg:w-1/4 lg:block">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="text-gray-700 dark:text-gray-400 font-semibold mb-2">
                  Min Price:
                </label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="text-gray-700 dark:text-gray-400 font-semibold mb-2">
                  Max Price:
                </label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  onClick={handleFilter}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
          <div className="w-full px-3 lg:w-3/4">
            {query ? (
              <FilterProductByPrice productsByPrice={products} />
            ) : (
              <ListProductByCategories />
            )}
            {!query ? (
              <SearchProduct products={products} />
            ) : (
              <ListProductByCategories />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
