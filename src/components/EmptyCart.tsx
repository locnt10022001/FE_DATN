import { Link } from 'react-router-dom'
const EmptyCart = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="h-64 w-64 rounded-full bg-gray-300 flex items-center justify-center text-center">
                <svg height="75" viewBox="0 0 18 18" width="75"><g fill="none" fillRule="evenodd"><path d="M16.933 3.5l.798 8.317H1.169L1.967 3.5h14.966zm-9.903 11.693a2.268 2.268 0 01-2.255-2.143h4.51a2.268 2.268 0 01-2.255 2.143zM6.76 5H4.886L4.214 3.5h9.572l-.672 1.5H11.99V5H6.76zm7.018 6c.413 0 .75-.448.75-1s-.337-1-.75-1-.75.448-.75 1 .337 1 .75 1z" stroke="#374151" strokeWidth="1.5"></path></g></svg>
            </div>
            <p className="mt-4 text-lg text-gray-500 font-bold text-center">
                Your cart is empty
            </p>
            <div className="mt-8">
                <Link to="/products" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition duration-200">
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}

export default EmptyCart