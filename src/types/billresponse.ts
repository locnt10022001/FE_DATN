import IBill from "./bill"
import { BillDetail } from "./billdetail"
import { ProductDetails } from "./productdetails"

export interface BillResponse {
    tt:String,
    hoaDon: IBill,
    chiTietList: BillDetail[]
};