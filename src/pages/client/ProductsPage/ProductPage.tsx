import { useLocation } from "react-router-dom";
import useFetchData from '../../../hooks/useFetchData';
import ListCategories from "../../../components/ListCategories";
const ProductPage = () => {
  const { data: categories } = useFetchData("/categories");
  const location = useLocation();
  const cateId = new URLSearchParams(location.search).get("cateId");
  const url = cateId ? `/products/filter?CategoryId=${cateId}` : '/products';
  const { data: products } = useFetchData(url);
  return (
    <section>
      <div className="main-banner">
        <img src="" alt="" />
      </div>
      <div className='my-16 px-4 sm:grid grid-cols-10'>
        <div className='col-span-3'>
          <ListCategories categories={categories} />
        </div>
        <div className='col-span-7'>
          {/* <ListProducts products={products} /> */}
        </div>
      </div>
    </section>
  )
}
export default ProductPage;
