import { IProductDetail } from "../types/product";
import ModalAddtocart from "./ModalAddtocart";

type Props = {
    product: IProductDetail
}
const ListRelatedProduct = (props: Props) => {
    return (
        <section>
            <div className="products-tile">
                <h2 className='font-bold text-[24px] my-12 text-[#111928]'>Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {props.product.relatedProducts.map((item: any) => {
                    return (
                        <div className="products-item" key={item._id}>
                            <div className="bg-white p-4 shadow-md rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                                <a href={`/products/` + item._id}>
                                    <div>
                                        <img className="w-full" src={item.images[0]} alt="" />
                                    </div>
                                    <div className="item-text h-32">
                                        <h5 className="text-[18px] font-bold truncate">{item.name}</h5>
                                        <p className="my-8 text-[#F54748] text-[20px] font-bold">${item.price}</p>
                                    </div>
                                </a>
                                <ModalAddtocart product={item} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
export default ListRelatedProduct