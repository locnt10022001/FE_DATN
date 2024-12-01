import { AccoutnRole } from "./accountrole";

export interface Account {
    id: number;
    idVaiTro: AccoutnRole;
    tenDangNhap: string;
    matKhau: string;
    ten: string;
    ngaySinh: string;
    gioiTinh: true;
    sdt: string;
    email: string;
    cccd: string;
    avatar: string;
    tt: boolean;
    ngayTao: string;
    ngayCapNhat: string;
  }