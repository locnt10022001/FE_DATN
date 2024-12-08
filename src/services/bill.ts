import IBill, { ThanhToanRequest, ThemSanPhamRequest } from "../types/bill"
import { OrderRequest } from "../types/order"
import Customer from "../types/saferidebill"
import intance from "./intansce"

export const GetAllBill = () => {
    return intance.get('/api/admin/hoa-don/danh-sach/1')
}

export const GetOnlineBill = () => {
    return intance.get('/api/admin/hoa-don/danh-sach/2')
}

export const GetOneBill = (ma: string) => {
    return intance.get('/api/admin/hoa-don/chi-tiet/' + ma)
}
export const GetOneOnlineBill = (ma: string) => {
    return intance.get('/api/admin/hoa-don/chi-tiet/' + ma)
}

export const GetProductOnBill = (id: string) => {
    return intance.get('/ban-hang/hoa-don/' + id + '/sanpham')
}

export const AddProductToCart = (productId: number, idTaiKhoan: number, soLuong: number) => {
    return intance.post(`/online/gio-hang/them-san-pham`, null,
        {
            params: {
                productId,
                idTaiKhoan,
                soLuong,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
};

export const AddProductToBill = (request: ThemSanPhamRequest) => {
    return intance.post('/ban-hang/them-san-pham', request);
};

export const SubmitOrderConfirmation = (request: OrderRequest) => {
    return intance.post('/online/dat-hang', request);
};
export const UpdateBillStatus = (id: number, status: string) => {
    return intance.post('/online/trang-thai?hoaDonId=' + id + '&trangThaiMoi=' + status);
};


export const ProcessPayment = (request: ThanhToanRequest) => {
    return intance.post('/ban-hang/thanh-toan', request);
};

export const GetBillByUser = (user_id: string) => {
    return intance.get('/bill/order/' + user_id)
}

export const CreateBill = (data: IBill) => {
    return intance.post(`/bill`, data);
}

export const AddNewBill = () => {
    return intance.post(`/ban-hang/them-hoa-don`);
}

export const UpdateBill = (data: IBill) => {
    return intance.put(`/bill/${data.id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

export const RemoveBill = (_id: number) => {
    return intance.delete(`/bill/${_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}