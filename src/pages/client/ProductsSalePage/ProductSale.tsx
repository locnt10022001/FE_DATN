import ListProductSale from '../../../components/ListProductSale';
import useFetchData from '../../../hooks/useFetchData'
const ProductSale = () => {
  const { data } = useFetchData("/products/sale");
  return (
    <section>
      <div className="main-banner">
        <img src="https://file.hstatic.net/1000376021/file/sale_ef93ce5a5b0e4e63845866c36b76400b.jpg" alt="" />
      </div>
      <ListProductSale ProductSale={data} />
    </section>
  )
}

export default ProductSale