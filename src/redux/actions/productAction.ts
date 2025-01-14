import { IProducts } from "../../types/products";
import { FETCH_PRODUCTS_FAILED, FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS } from "../typeActions/products.type";


export const FetchProductsRequest = () => ({
    type: FETCH_PRODUCTS_REQUEST,
});

export const FetchProductsSuccess = (products: IProducts[]) => ({
    type: FETCH_PRODUCTS_SUCCESS,
    payload: products,
});

export const FetchProductsFailure = (error: any) => ({
    type: FETCH_PRODUCTS_FAILED,
    payload: error,
});

