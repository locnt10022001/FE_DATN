
import { ShellMaterial } from "./shellmaterial"
import { Brand } from "./brand"
import { IProducts } from "./products"
import { HelmetSize } from "./helmetsize"
import { HelmetGlasses } from "./helmetglasses"
import { HelmetType } from "./helmettype"
import { CushionMaterial } from "./cushionmaterial"
import { Color } from "./helmetcolor"

export interface ProductDetails {
    id: number,
    ma: string,
    idSanPham: IProducts,
    idThuongHieu: Brand,
    idChatLieuVo: ShellMaterial,
    idLoaiMu: HelmetType,
    idKichThuoc: HelmetSize,
    idKhuyenMai: null,
    idLoaiKinh: HelmetGlasses,
    idChatLieuDem: CushionMaterial,
    idMauSac: Color,
    sl: number,
    donGia: number,
    moTaCT: string,
    anh: string,
    tt: string,
    xuatXu: string,
    nguoiTao: string,
    ngayTao: string,
    nguoiCapNhat: string,
    ngayCapNhat: string,
    formattedGia: string
}