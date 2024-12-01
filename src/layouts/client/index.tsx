import { Outlet } from 'react-router-dom';
import HeaderLayoutClient from './components/header';
import FooterLayoutClient from './components/footer';

const LayoutClient = () => {
    return (
        <div className="flex flex-col min-h-screen max-w-screen-xl mx-auto ">
            <HeaderLayoutClient />
            <main className="flex-grow">
                <Outlet />
            </main>
            <FooterLayoutClient />
        </div>
    );
};

export default LayoutClient;