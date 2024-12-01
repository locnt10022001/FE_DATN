import IBill from "./bill"
import { ProductDetails } from "./productdetails"

export interface BillDetail {
    id: number,
    idHoaDon: IBill,
    idSPCT: ProductDetails,
    mahdct: string,
    tongTien: number,
    sl: number,
    ghiChu: string,
    ngayTao: string,
    ngayCapNhat: string,
    tt: string,
    formattedTongTien: string
};