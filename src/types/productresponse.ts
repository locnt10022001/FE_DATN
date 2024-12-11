
import { ShellMaterial } from "./shellmaterial"
import { Brand } from "./brand"
import { IProducts } from "./products"
import { HelmetSize } from "./helmetsize"
import { HelmetGlasses } from "./helmetglasses"
import { HelmetType } from "./helmettype"
import { CushionMaterial } from "./cushionmaterial"
import { Color } from "./helmetcolor"
import { Product } from "./category"
import { ProductDetails } from "./productdetails"

export interface ProductResponse {
    sanPham: IProducts,
    chiTietList: ProductDetails[]
};