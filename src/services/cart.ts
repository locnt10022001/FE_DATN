import intansce from "./intansce"

export const GetCartProduct = (id: number) => {
    return intansce.get('/gio-hang/' + id)
}