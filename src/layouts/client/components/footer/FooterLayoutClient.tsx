import { Link } from 'react-router-dom'
const FooterLayoutClient = () => {
    return (
        <footer className="border-t mt-12 pt-12 pb-32 px-4 lg:px-0">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <div className="md:w-1/2">
                    <span className="text-sm font-bold text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">SNEAKERCUTI</a> All Rights Reserved.</span>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                    <ul className="w-full space-x-8 md:space-x-12 items-center flex flex-wrap text-center md:text-right">
                        <li className="pb-3">
                            <Link to='/' className="text-sm text-gray-700 hover:text-blue-400 font-bold dark:text-gray-400">Home</Link>
                        </li>
                        <li className="pb-3">
                            <Link to='/products' className="text-sm text-gray-700 hover:text-blue-400 font-bold dark:text-gray-400">Products</Link>
                        </li>
                        <li className="pb-3">
                            <Link to='/products/sales' className="text-sm text-[red] font-bold">News Sale</Link>
                        </li>
                        <li className="pb-3">
                            <Link to='/contacts' className="text-sm text-gray-700 hover:text-blue-400 font-bold dark:text-gray-400">Contacts</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>

    )
}

export default FooterLayoutClient