import { Link } from 'react-router-dom';
import { ProductDetails } from '../types/productdetails';

type Props = {
    products: ProductDetails[];
};

const ItemProduct = (props: Props) => {
    return (
        <div className="flex flex-wrap items-center">
            {props.products.map((product) => (
                <div key={product.id} className="w-full px-3 mb-6 sm:w-1/2 md:w-1/3">
                    <Link to={'/products/' + product.id}>
                        <div className="bg-white p-4 shadow-md rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                            <div className="relative bg-gray-100">
                                <img
                                    src={product.anh}
                                    alt={product.idSanPham.ten}
                                    className="object-cover w-full h-56 mx-auto"/>
                            </div>
                            <div className="p-5 bg-gray-50 dark:bg-gray-400">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-medium dark:text-gray-900">
                                        {product.idSanPham.ten}
                                    </h3>
                                </div>
                                <div className="mb-2">
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-800">
                                        {product.formattedGia}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className=" flex">
                                        {[...Array(5)].map((_, index) => (
                                            <svg
                                                key={index}
                                                className={`w-4 h-4 ${index < Math.round(5) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.367 2.444a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.368-2.444a1 1 0 00-1.176 0l-3.368 2.444c-.784.57-1.84-.197-1.54-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.23 9.375c-.784-.57-.381-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.948z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ItemProduct;
