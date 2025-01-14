
import { ProductDetails } from "../types/productdetails"
import { IProducts } from "../types/products"
import intansce from "./intansce"
export const GetAllProduct = () => {
    return intansce.get('/sanpham/danhsach')
}
export const GetAllProductDetail = () => {
    return intansce.get('/spchitiet/danhsach')
}

export const GetManageProduct = () => {
    return intansce.get('/sanpham/dsct')
}
export const AddNewProduct = (data: IProducts) => {
    const updatedData = {
        ...data,
        tt: "Hết hàng",
    };
    return intansce.post('/sanpham/add', updatedData);
};
export const AddNewDetailProduct = (data: ProductDetails) => {
    const transformedData = {
        ma: data.ma,
        idSanPham: { id: data.idSanPham },
        idThuongHieu: { id: data.idThuongHieu },
        idChatLieuVo: { id: data.idChatLieuVo },
        idLoaiMu: { id: data.idLoaiMu },
        idKichThuoc: { id: data.idKichThuoc },
        idKhuyenMai: { id: data.idKhuyenMai },
        idLoaiKinh: { id: data.idLoaiKinh },
        idChatLieuDem: { id: data.idChatLieuDem },
        idMauSac: { id: data.idMauSac },
        sl: data.sl,
        donGia: data.donGia,
        moTaCT: data.moTaCT,
        anh: data.anh,
        tt: data.tt,
        xuatXu: data.xuatXu,
        nguoiTao: data.nguoiTao,
        nguoiCapNhat: data.nguoiCapNhat,
    };

    return intansce.post('/spchitiet/add', transformedData);
};

export const UpdateProduct = (id: number, data: IProducts) => {
    const updatedData = {
        ...data,
        tt: data.tt,
    };
    return intansce.put(`/sanpham/update/${id}`, updatedData);
  };

export const GetProductById = (id: number) => {
    return intansce.get('/sanpham/' + id)
}
export const GetProductSale = () => {
    return intansce.get('/products/sale')
}
export const SearchProductByName = (name: string) => {
    return intansce.get('/products/search?name=' + name)
}
export const FindProductByPrice = (min: number, max: number) => {
    return intansce.get(`/products/filter/price?minPrice=${min}&maxPrice=${max}&sortType=desc`)
}
export const FilterProductByCategory = (id: string) => {
    if (id === null || id === undefined) {
        return intansce.get('/products')
    }
    return intansce.get('/products/filter?CategoryId=' + id)
}
export const GetOneProduct = (_id: string) => {
    return intansce.get('/products/' + _id)
}

export const RemoveProduct = async (_id: string) => {
    return intansce.delete(`/products/${_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}