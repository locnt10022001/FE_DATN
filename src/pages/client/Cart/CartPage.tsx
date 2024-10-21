import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../../redux/actions/cartActions';
import EmptyCart from '../../../components/EmptyCart';
import { Link } from 'react-router-dom';
import CheckoutCart from '../../../components/CheckoutCart';
import { AppDispatch, RootState } from '../../../redux/store';
function CartPage() {
    const dispatch = useDispatch<AppDispatch>();
    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
    };
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const totalPrice = cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    return (
        <>
            {cartItems.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="bg-gray-100 py-[80px]">
                    <p className=" focus:outline-none px-4 mb-4 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 font-normal text-base leading-4 text-gray-600"><Link to="/">Home</Link> / <Link to="/cart">cart</Link> / checkout</p>
                    <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
                    <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                        <div className="rounded-lg md:w-2/3">
                            {cartItems.map((cart: any) => {
                                return (
                                    <div key={cart._id} className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                        <img
                                            src={cart.image}
                                            alt="product-image"
                                            className="w-full rounded-lg sm:w-40"
                                        />
                                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                            <div className="mt-5 sm:mt-0">
                                                <h2 className="text-lg font-bold text-gray-900">
                                                    {cart.name}
                                                </h2>
                                                <p className="mt-1 text-xs text-gray-700">Size: {cart.size}</p>
                                            </div>
                                            <div className="mt-4 flex justify-between im sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                                                <div className="flex items-center border-gray-100">
                                                    <p>
                                                        Quantity: {cart.quantity}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <p className="text-sm font-bold text-[red]">$
                                                        {cart.price}
                                                    </p>
                                                    <button onClick={() => handleRemove(cart._id)}>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {/* checkout cart */}
                        <CheckoutCart totalPrice={totalPrice} />
                    </div>
                </div>
            )}
        </>

    );
}

export default CartPage;
