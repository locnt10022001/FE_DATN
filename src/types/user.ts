interface IUser {
    _id: string;
    key: string;
    name: string,
    email: string,
    password: string,
    role: "admin" | "member",
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null,
}
export default IUser


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


export interface LoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: IUser
}