import { Link } from 'react-router-dom'
import { IProduct } from '../types/product'
import { EyeInvisibleOutlined } from "@ant-design/icons"
type Props = {
    productsByPrice: IProduct[]
}
const FilterProductByPrice = (props: Props) => {
    return (
        <div className="flex flex-wrap items-center ">
            {props.productsByPrice.map((product) => (
                <div key={product._id} className="w-full px-3 mb-6 sm:w-1/2 md:w-1/3">
                    <Link to={`/products/${product._id}`}>
                        <div className="bg-white p-4 shadow-md rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                            <div className="relative bg-gray-200">
                                <img
                                    src={product.images[0]}
                                    alt=""
                                    className="object-cover w-full h-56 mx-auto "
                                />
                                {product.salePrice > 0 && (
                                    <div className="absolute top-0 right-0 z-10 m-1 flex items-center justify-center w-16 h-16 p-5 text-center text-gray-100 bg-red-600 rounded-full shadow-xl ">
                                        <span className="relative text-base font-semibold text-gray-200 ">{((product.price - product.salePrice) / product.price * 100).toFixed(0)}% sale</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 bg-gray-50 dark:bg-gray-900">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-medium dark:text-gray-400 truncate">
                                        {product.name}
                                    </h3>

                                </div>
                                <div className="flex items-center justify-between">
                                    <div className='mb-4'>
                                        <h4 className="font-medium text-[15px] mb-1 text-red-500">
                                            {product.salePrice > 0
                                                ? product.salePrice
                                                : product.price}{"$   "}
                                            <span className="text-gray-600 font-light line-through">
                                                {product.salePrice > 0
                                                    ? product.price + '$'
                                                    : ""}
                                            </span>
                                        </h4>
                                    </div>
                                    <div className="text-base font-normal mb-4 text-gray-400 dark:text-gray-400">
                                        <span><EyeInvisibleOutlined className='mr-2' />{product.views}</span>
                                    </div>
                                </div>
                                <button
                                    className="flex justify-center px-4 py-2 text-blue-600 border border-blue-300 rounded-full dark:border-gray-600 dark:text-gray-400 hover:bg-blue-700 hover:text-gray-100 dark:hover:bg-gray-800 dark:hover:border-gray-900"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}
export default FilterProductByPrice