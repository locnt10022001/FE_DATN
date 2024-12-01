import { ProductDetails } from "./productdetails";

export interface OrderRequest {
    gioHangId: number,
    idTaiKhoan: number,
    diachi:string,
    sanPhamList: ProductDetails[];
  }