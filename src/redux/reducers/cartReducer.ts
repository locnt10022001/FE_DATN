import { ADD_TO_CART, REMOVE_FROM_CART } from '../typeActions/cart.type';
import { ICartState, ICartAction } from '../../types/cart';

const initialState: ICartState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems') as string)
    : [],
};

export const cartReducer = (
  state: ICartState = initialState,
  action: ICartAction
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x._id === existItem._id ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x._id !== action.payload),
      };
    default:
      return state;
  }
};
