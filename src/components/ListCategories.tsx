import { Link } from 'react-router-dom'
import { ICategory } from '../types/category'
type Props = {
    categories: ICategory[],
}
const ListCategories = (props: Props) => {
    return (
        <div className="col-span-1 md:col-span-1 w-[330px]">
            <ul id="cate-list">
                <li className="py-6 sm:hover:bg-gray-200"><Link className="text-[#000000] text-[20px] font-bold" to="/products">all products</Link></li>
                {props.categories.map(cate => {
                    return (
                        <li key={cate._id} className="py-6 sm:hover:bg-gray-200">
                            <Link className="text-[#000000] text-[20px] font-bold w-full" to={`?cateId=${cate._id}`}>
                                {cate.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ListCategories