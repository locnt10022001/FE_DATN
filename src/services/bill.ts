import IBill from "../types/bill"
import Customer from "../types/saferidebill"
import intansce from "./intansce"

export const GetAllBill = () => {
    return intansce.get('/hoa-don/danh-sach')
}

export const GetOneBill = (id: string) => {
    return intansce.get('/bill/' + id)
}


export const GetBillByUser = (user_id: string) => {
    return intansce.get('/bill/order/' + user_id)
}

export const CreateBill = (data: IBill) => {
    return intansce.post(`/bill`, data);
}

export const AddNewBill = () => {
    return intansce.post(`/ban-hang/them-hoa-don`);
}

export const UpdateBill = (data: IBill) => {
    return intansce.put(`/bill/${data.id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

export const RemoveBill = (_id: number) => {
    return intansce.delete(`/bill/${_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}