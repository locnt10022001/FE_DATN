import { Menu, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons"
import SignupPage from "../../../../pages/client/SignupPage";
import SigninPage from "../../../../pages/client/SigninPage";
import { RootState } from "../../../../redux/store";
export default function HeaderLayoutClient() {
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const [show, setshow] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const user = localStorage.getItem("user");

    function handleDropdownClick() {
        setShowDropdown(!showDropdown);
    }

    async function handleLogout() {
        // Implement logout logic here
        localStorage.removeItem("user");
        await message.warning("Đã đăng xuất", 2, () => { });
        window.location.reload();
    }
    return (
        <div className="bg-white">
            <nav className="2xl:container 2xl:mx-auto sm:py-6">
                <div className="flex justify-between ">
                    <Link to="/" className="text-2xl text-gray-700 dark:text-gray-400 font-bold">SNEAKERCUTI</Link>
                    <div className="hidden sm:flex flex-row items-center space-x-6">
                        <ul className="hidden lg:w-auto lg:space-x-12 lg:items-center lg:flex ">
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
                                <Link to='/contacts' className="text-sm text-gray-700 font-bold hover:text-blue-400 dark:text-gray-400">Contacts-Us</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="hidden sm:flex flex-row space-x-4">
                        <div>
                            <Link to="/cart" className="w-[50px] flex items-center dark:text-gray-400">
                                {cartItems.length === 0 ?
                                    <Badge text={0}>
                                        <ShoppingCartOutlined style={{ fontSize: '30px' }} className="text-gray-600" />
                                    </Badge>
                                    :
                                    <Badge count={cartItems.length}>
                                        <ShoppingCartOutlined style={{ fontSize: '30px' }} className="text-gray-600" />
                                    </Badge>
                                }
                            </Link>
                        </div>
                        {user ? (
                            <div className="relative z-10">
                                <button className="text-gray-800" onClick={handleDropdownClick}>
                                    <UserOutlined
                                        style={{ fontSize: "24px" }}
                                        className="h-8 w-8 transform hover:scale-110 transition duration-200"
                                    />
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md overflow-hidden z-10 w-48">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/order/bill"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                        >
                                            Đơn hàng của tôi
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (<>
                            <div>
                                <SignupPage />
                            </div>
                            <div>
                                <SigninPage />
                            </div>
                        </>
                        )
                        }

                    </div>
                    {/* Burger Icon */}
                    <div id="bgIcon" onClick={() => setshow(!show)} className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  justify-center items-center sm:hidden cursor-pointer`}>
                        <svg className={`${show ? 'hidden' : ''}`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className=" transform duration-150" d="M4 6H20" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path className=" transform duration-150" d="M4 18H20" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg className={`${show ? 'block' : 'hidden'}`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {/* Mobile and small-screen devices (toggle Menu) */}
                <div id="MobileNavigation" className={`${show ? 'block' : 'hidden'} sm:hidden mt-4 mx-auto`}>
                    <div className="block sm:hidden md:block">
                        <Menu>
                            <Menu.Item key="home">
                                <Link to="/">Home</Link>
                            </Menu.Item>
                            <Menu.Item key="products">
                                <Link to="/products">Products</Link>
                            </Menu.Item>
                            <Menu.Item key="products/sales">
                                <Link to="/products/sales">News Sale</Link>
                            </Menu.Item>
                            <Menu.Item key="contacts">
                                <Link to="/contacts">Contact-Us</Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                    <div className="mt-4 ml-[-10px] flex justify-between items-center">
                        <div className="flex items-center">
                            {user ? (
                                <div className="relative z-10">
                                    <button
                                        className="text-gray-800"
                                        onClick={handleDropdownClick}
                                    >
                                        <UserOutlined
                                            style={{ fontSize: "18px" }}
                                            className="h-8 w-8 transform hover:scale-110 transition duration-200"
                                        />
                                    </button>
                                    {showDropdown && (
                                        <div className="absolute bg-white shadow-md rounded-md overflow-hidden z-10 w-48">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                to="/mybill"
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                            >
                                                Đơn hàng của tôi
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex justify-center mx-4">
                                    <div>
                                        <SigninPage/>
                                    </div>
                                    <div>
                                        <SignupPage/>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            {/* Shopping cart icon */}
                            <Link
                                to="/cart"
                                className="mt-4 text-sm max-md:pb-4 max-md:pr-3 font-medium text-gray-700 hover:text-blue-400 flex items-center"
                            >
                                <div className="pt-4 pb-2">
                                    <Link to="/cart" className="text-sm font-medium text-gray-700 hover:text-blue-400 flex items-center">
                                        <div className="relative flex-shrink-0">
                                            {cartItems.length === 0 ?
                                                <Badge text={0}>
                                                    <ShoppingCartOutlined style={{ fontSize: '30px' }} className="text-gray-600" />
                                                </Badge>
                                                :
                                                <Badge count={cartItems.length}>
                                                    <ShoppingCartOutlined className="h-5 w-5 ml-[20px]" style={{ fontSize: '30px' }} />
                                                </Badge>
                                            }
                                        </div>
                                    </Link>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>

    );
}
