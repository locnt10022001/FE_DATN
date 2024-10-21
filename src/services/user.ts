import IUser from "../types/user"
import intansce from "./intansce"

export const GetAllUser = () => {
    return intansce.get('/users')
}

export const GetOneUser = (_id: string) => {
    return intansce.get('/users/' + _id)
}

export const GetBillFollowUser = (_id: string) => {
    return intansce.get(`/users/bill/me?id=${_id}`);
  };

export const UpdateUser = (data: IUser) => {
    return intansce.put('/users/' + data._id, data)
}

export const RemoveUser = (_id: string) => {
    return intansce.delete(`/users/${_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}