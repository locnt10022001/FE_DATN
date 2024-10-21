import IAbout from "../types/about"
import intansce from "./intansce"

export const GetAllAbout = () => {
    return intansce.get('/abouts')
}

export const GetOneAbout = (_id: number) => {
    return intansce.get('/abouts/' + _id)
}

export const CreateAbout = (data: IAbout) => {
    return intansce.post('/abouts', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    })
}

export const UpdateAbout = (data: IAbout) => {
    return intansce.put(`/abouts/${data._id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    })
}

export const RemoveAbout = (_id: string) => {
    return intansce.delete(`/abouts/${_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}