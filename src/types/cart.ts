import { ADD_TO_CART, REMOVE_FROM_CART } from "../redux/typeActions/cart.type";
export interface ICartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ICartState {
  cartItems: ICartItem[];
}

export interface ICartAddAction {
  type: typeof ADD_TO_CART;
  payload: ICartItem;
}

export interface ICartRemoveAction {
  type: typeof REMOVE_FROM_CART;
  payload: string;
}

export type ICartAction = ICartAddAction | ICartRemoveAction;
