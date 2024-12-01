import IBill from "./bill"
import { ProductDetails } from "./productdetails"

export interface ProductOnBill {
    id: number,
    idHoaDon: IBill,
    idSPCT: ProductDetails,
    mahdct: string,
    tongTien: number,
    sl: number,
    ghiChu: null,
    ngayTao: string,
    ngayCapNhat: string,
    tt: string,
    formattedTongTien: string
}
