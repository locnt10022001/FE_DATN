interface IUser {
    _id: string;
    key: string;
    name: string,
    email: string,
    password: string,
    role: "Admin" | "User",
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null,
}
export default IUser

export interface LoginRequest {
    tenDangNhap: string,
    matKhau: string
}


export interface RegisterResponse {
    message: string;
    user: {
        name: string;
        email: string;
        role: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
    }
}

export interface UserLogin {
    id: number,
    role: "Admin" | "User",
    email: string,
    username: string,
    name: string
}

export interface LoginResponse {
    token: string;
    user: UserLogin;
}