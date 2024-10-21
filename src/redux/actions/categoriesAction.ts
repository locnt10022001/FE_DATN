import { GetAllCategory } from "../../services/categories";
import { ICategory } from "../../types/category";
import { FETCH_CATEGORIES_FAILED, FETCH_CATEGORIES_REQUEST, FETCH_CATEGORIES_SUCCESS } from "../typeActions/categories.type";


export const FetchCategoriesRequest = () => ({
    type: FETCH_CATEGORIES_REQUEST,
});

export const FetchCategoriesSuccess = (categories: ICategory[]) => ({
    type: FETCH_CATEGORIES_SUCCESS,
    payload: categories,
});

export const FetchCategoriesFailure = (error: any) => ({
    type: FETCH_CATEGORIES_FAILED,
    payload: error,
});

export const fetchCategories = () => async (dispatch:any) => {
    try {
        const { data } = await GetAllCategory();
        dispatch(FetchCategoriesSuccess(data));
    } catch (error: any) {
        console.log(error)
    }
};