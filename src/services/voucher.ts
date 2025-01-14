import IUser from "../types/user"
import intansce from "./intansce"

export const GetAllVoucher = () => {
    return intansce.get('/voucher/danhsach')
}
export const GetAllPromotion = () => {
    return intansce.get('/khuyenmai/danhsach')
}