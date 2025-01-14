import { ProductDetails } from "./productdetails";

export interface OrderRequest {
  voucherId: number|null;
  idTaiKhoan: number,
  diachi: string,
  sanPhamList: ProductDetails[];
}