interface AddBill {
  ID: bigint;
  MaHoaDon: string;
  ID_TaiKhoan: bigint;
  ID_Voucher: bigint;
  LoaiHoaDon: number;
  NgayGiaoHang?: Date;
  NgayNhan?: Date;
  GiaGiam: number;
  TongTien: number;
  SoTienDaTra: number;
  GhiChu: string;
  DiaChi: string;
  TrangThai: string;
  NguoiTao: string;
  NgayTao: Date;
  NguoiCapNhat: string;
  NgayCapNhat: Date;
}

export interface Customer  {
  name: string;
  phone: string;
}
export default Customer


export interface ItemBillState {
  BillItems: Customer[];
}

