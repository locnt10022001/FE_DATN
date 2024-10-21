import { ADD_TO_CART, REMOVE_FROM_CART } from '../typeActions/cart.type';
import { Dispatch } from 'redux';
import { GetOneProduct } from '../../services/product';

export const addToCart = (cartData: any) => async (dispatch: Dispatch, getState: any) => {
  const { data } = await GetOneProduct(cartData.productId);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      _id: data._id,
      name: data.name,
      image: data.images[0],
      price: data.price,
      quantity: cartData.quantity,
      size: cartData.size,
    },
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId: string) => (dispatch: Dispatch, getState: any) => {
  dispatch({ type: REMOVE_FROM_CART, payload: productId });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

