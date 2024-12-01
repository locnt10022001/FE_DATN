import { Account } from "./account";

interface IBill {
  id: number;
  ma: string;
  idTaiKhoan: Account;
  idVoucher: string;
  loaiHoaDon: string;
  ngayGiaoHang: string;
  ngayNhan: string;
  giaGiam: string;
  tongTien: string;
  soTienDaTra: string;
  ghiChu: string;
  diaChi: string;
  tt: string;
  ngayTao: string;
  nguoiTao: string;
  formattedGia: string;
}

export interface Itembill {
  id: number;
  image: string;
  name: string;
  price: number;
  size: number;
  quantity: number;
}
export default IBill


export interface ThemSanPhamRequest {
  maHoaDon: string;
  sanPhamId: number;
  soLuong: number;
}

export interface ThanhToanRequest {
  maHoaDon: string;
  soTienKhachTra?: number;
}

