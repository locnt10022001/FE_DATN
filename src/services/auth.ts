import IUser, { LoginRequest, UserLogin } from "../types/user"
import intansce from "./intansce"

export const Signup = (data: {
    tenDangNhap: string;
    matKhau: string;
    idVaiTro: { id: number };
    ten: string;
}) => {return intansce.post('/api/dang-ki', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const Signin = (data: LoginRequest) => {
    return intansce.post('/api/login', data)
}

export const ForgotPass = (data: IUser) => {
    return intansce.post('/auth/forgotpassword', data)
}