import { Link } from "react-router-dom";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import { IProducts } from "../types/products";

type Props = {
  productsByPrice: IProducts[];
};

const FilterProductByPrice = (props: Props) => {
  return (
    <div className="flex flex-wrap">
      {props.productsByPrice.map((product) => (
        <div key={product.id} className="w-full px-3 mb-8 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Link to={`/products/${product.id}`}>
            <div className="bg-white p-4 shadow-lg rounded-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative overflow-hidden bg-gray-200 rounded-md">
                <img
                //   src={product.imageUrl}
                  alt={product.ten}
                  className="object-cover w-full h-56 mx-auto transition-transform duration-300 hover:scale-110"
                />
                {/* {product.salePrice > 0 && (
                  <div className="absolute top-0 left-0 m-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                    {((product.price - product.salePrice) / product.price * 100).toFixed(0)}% OFF
                  </div>
                )} */}
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                <h3 className="text-lg font-semibold truncate text-gray-800 dark:text-gray-300">
                  {product.ten}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  {/* <div className="text-lg font-semibold text-red-500">
                    {product.salePrice > 0 ? product.salePrice : product.price}₫
                    {product.salePrice > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {product.price}₫
                      </span>
                    )}
                  </div> */}
                  <div className="text-gray-500 dark:text-gray-400">
                    <EyeInvisibleOutlined className="mr-2" /> views
                  </div>
                </div>
                <button
                  className="mt-4 w-full py-2 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default FilterProductByPrice;
