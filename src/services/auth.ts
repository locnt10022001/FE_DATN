import IUser from "../types/user"
import intansce from "./intansce"

export const Signup = (data:IUser) => {
    return intansce.post('/auth/signup',data)
}

export const Signin = (data:IUser) => {
    return intansce.post('/auth/signin',data)
}

export const ForgotPass = (data:IUser) => {
    return intansce.post('/auth/forgotpassword',data)
}