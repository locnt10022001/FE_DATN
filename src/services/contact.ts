import IContact from "../types/contact"
import intansce from "./intansce"

export const GetAllContact = () => {
    return intansce.get('/contacts')
}

export const GetOneContact = (_id: number) => {
    return intansce.get('/contacts/' + _id)
}

export const CreateContact = (data: IContact) => {
    return intansce.post('/contacts', data)
}

export const UpdateContact = (data: IContact) => {
    return intansce.put('/contacts/' + data._id, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    })
}

export const RemoveContact = (_id: string) => {
    return intansce.delete(`/contacts/${_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
}