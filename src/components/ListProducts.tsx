import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { IProduct } from '../types/product';
import ModalAddtocart from './ModalAddtocart';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
type Props = {
  products: IProduct[],
}
const ListProducts = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = props.products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {currentProducts.map((item) => (
          <div key={item._id} className="bg-white p-4 shadow-md rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            <div className=''>

              <Link to={`/products/${item._id}`}>
                <div className="relative bg-gray-200">
                  <div className="relative bg-gray-200">
                    <img
                      src={item.images[0]}
                      alt=""
                      className="object-cover w-full h-56 mx-auto "
                    />
                    {item.salePrice > 0 && (
                      <div className="absolute top-0 right-0 z-10 m-1 flex items-center justify-center w-16 h-16 p-5 text-center text-gray-100 bg-red-600 rounded-full shadow-xl ">
                        <span className="relative text-base font-semibold text-gray-200 ">
                          {(
                            ((item.price - item.salePrice) /
                              item.price) *
                            100
                          ).toFixed(0)}
                          % sale
                        </span>
                      </div>
                    )}
                  </div>
                  {item.salePrice > 0 && (
                    <div className="absolute top-0 right-0 z-10 m-1 flex items-center justify-center w-16 h-16 p-5 text-center text-gray-100 bg-red-600 rounded-full shadow-xl ">
                      <span className="relative text-base font-semibold text-gray-200 ">{((item.price - item.salePrice) / item.price * 100).toFixed(0)}% sale</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
            <div className="item-text">
              <h5 className='text-[18px] font-bold truncate'>{item.name}</h5>
              <p className='my-8 text-[#F54748] text-[20px] font-bold'>${item.price}</p>
            </div>
            <ModalAddtocart product={item} />
          </div>
        ))}
      </div>
      <Pagination className='mt-8'
        current={currentPage}
        pageSize={productsPerPage}
        total={props.products.length}
        onChange={handleChangePage}
      />
    </section >
  );
};

export default ListProducts;