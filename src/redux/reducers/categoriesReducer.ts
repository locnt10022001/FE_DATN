import { FETCH_CATEGORIES_SUCCESS } from "../typeActions/categories.type";

  const initialState = {
    categories: [],
    loading: false,
    error: null,
  };
  
  const categoriesReducer = (state = initialState, action:any) => {
    switch (action.type) {
      case FETCH_CATEGORIES_SUCCESS:
        return {
          ...state,
          loading: false,
          categories: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default categoriesReducer;