import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import productsReducer from './productReducer';
import categoriesReducer from './categoriesReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  products:productsReducer,
  categories:categoriesReducer
});
export default rootReducer