interface IBill {
  id: number,
  ma: string,
  idTaiKhoan: taiKhoanModel
  idVoucher: string,
  loaiHoaDon: string,
  ngayGiaoHang: string,
  ngayNhan: string,
  giaGiam: string,
  tongTien: string,
  soTienDaTra: string,
  ghiChu: string,
  diaChi: string,
  tt: string,
  ngayTao: string,
  nguoiTao: string,
  formattedGia: string,
}

interface taiKhoanModel {
  id: number,
  idVaiTro: vaiTroTaiKhoanModel
  tenDangNhap: string,
  matKhau: string,
  ten: string,
  ngaySinh: string,
  gioiTinh: true,
  sdt: string,
  email: string,
  cccd: string,
  avatar: string,
  tt: boolean,
  ngayTao: string,
  ngayCapNhat: string
}


interface vaiTroTaiKhoanModel {
  id: number,
  ten: string,
  nguoiTao: string,
  nguoiCapNhat: string,
  ngayTao: Date,
  ngayCapNhat: string,
  moTa: string
}



export interface Itembill {
  _id: number;
  image: string;
  name: string;
  price: number;
  size: number;
  quantity: number;
}
export default IBill


export interface IBillState {
  BillItems: IBill[];
}

