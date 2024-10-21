import { ICategory } from "../types/category"
import intansce from "./intansce"

export const GetAllCategory = () => {
    return intansce.get('/categories')
}

export const GetOneCategory = (_id: string) => {
    return intansce.get('/categories/' + _id)
}

export const CreateCategory = (data: ICategory) => {
    return intansce.post(`/categories`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });

}

export const UpdateCategory = (data: ICategory) => {
    return intansce.put(`/categories/${data._id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

export const RemoveCategory = (_id: string) => {
        return intansce.delete(`/categories/${_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
}