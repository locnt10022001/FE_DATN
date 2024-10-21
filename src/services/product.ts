import { IProduct } from "../types/product"
import intansce from "./intansce"
export const GetAllProduct = () => {
    return intansce.get('/products')
}
export const GetProductSale = () => {
    return intansce.get('/products/sale')
}
export const SearchProductByName = (name: string) => {
    return intansce.get('/products/search?name=' + name)
}
export const FindProductByPrice = (min:number,max:number) => {
    return intansce.get(`/products/filter/price?minPrice=${min}&maxPrice=${max}&sortType=desc`)
}
export const FilterProductByCategory = (id: string) => {
    if (id === null || id === undefined) {
        return intansce.get('/products')
    }
    return intansce.get('/products/filter?CategoryId=' + id)
}
export const GetOneProduct = (_id: string) => {
    return intansce.get('/products/' + _id)
}

export const CreateProduct = (data: IProduct) => {
    return intansce.post(`/products`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

export const UpdateProduct = (data: IProduct) => {
    return intansce.put(`/products/${data._id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

export const RemoveProduct = async (_id: string) => {
    return intansce.delete(`/products/${_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}