import { useEffect, useState } from 'react'
import { GetBillByUser } from '../../../services/bill'
import EmptyCart from '../../../components/EmptyCart';
import IBill from '../../../types/bill';
import { Link } from 'react-router-dom';
import ListOrder from '../../../components/ListOrder';

const OrderPage = () => {
    const user = localStorage.getItem("user");
    const userParse = user ? JSON.parse(user) : null;
    const [orders, setorders] = useState<IBill[]>([])
    useEffect(() => {
        if (userParse && userParse._id) {
            GetBillByUser(userParse._id).then(({ data }) => setorders(data))
        }
    }, [])
    return (
        <>
            {orders.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="bg-gray-100 py-[80px]">
                    <p className=" focus:outline-none px-4 mb-4 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 font-normal text-base leading-4 text-gray-600"><Link to="/">Home</Link> / <Link to="/cart">cart</Link> / bill</p>
                    <h1 className="mb-10 text-center text-2xl font-bold">order bill</h1>
                    <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                        <ListOrder orders={orders} />
                    </div>
                </div>
            )}
        </>
    )
}

export default OrderPage