import { FETCH_PRODUCTS_SUCCESS } from "../typeActions/products.type";

  const initialState = {
    products: [],
    loading: false,
    error: null,
  };
  
  const productsReducer = (state = initialState, action:any) => {
    switch (action.type) {
      case FETCH_PRODUCTS_SUCCESS:
        return {
          ...state,
          loading: true,
          products: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default productsReducer;