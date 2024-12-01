import { Link } from 'react-router-dom'
const FooterLayoutClient = () => {
    return (
        <footer className="border-t mt-12 pt-12 pb-32 px-4 lg:px-0">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <div className="md:w-1/2">
                    <span className="text-sm font-bold text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="/" className="hover:underline">SAFERIDE</a> All Rights Reserved.</span>
                </div>
            </div>
        </footer>

    )
}

export default FooterLayoutClient