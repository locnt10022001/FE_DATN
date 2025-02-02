import { BrowserRouter, Routes, Route } from "react-router-dom"
import LayoutClient from "../layouts/client";
import Homepage from "../pages/client/HomePage";
import ProductPage from "../pages/client/ProductsPage";
import ProductSale from "../pages/client/ProductsSalePage";
import ContactPage from "../pages/client/ContactPage";
import { CartPage } from "../pages/client/Cart";
import OrderPage from "../pages/client/Bill";
import LayoutAdmin from "../layouts/admin";
import ManagementProduct from "../pages/admin/products/ManageProduct";
import ManageCategory from "../pages/admin/categories/ManageCategory";
import ManageCategoryUpdate from "../pages/admin/categories/ManageCategoryUpdate";
import ManageComment from "../pages/admin/comments/ManageComment";
import ManageContact from "../pages/admin/contacts/ManageContact";
import ManageUser from "../pages/admin/user/ManageUser";
import Management from "../pages/admin/dashboard/Management";
import ManageHashtag from "../pages/admin/hashtags/ManageHashtag";
import ManageHashtagUpdate from "../pages/admin/hashtags/ManageHashtagUpdate";
import ManageBill from "../pages/admin/bills/ManageBill";
import { OnlineBillDetails, OrderTable } from "../pages/admin/bills";
import ManageAbout from "../pages/admin/abouts/ManageAbout";
import ManageAboutUpdate from "../pages/admin/abouts/ManageAboutUpdate";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilesPage from "../pages/client/profiles/Profiles";
import UpdateBill from "../pages/admin/bills/UpdateBill";
import ProductDetail from "../components/ProductDetail";
import OrderConfirmation from "../components/OrderConfirmation";
import OrderSuccess from "../components/SuccessPage";
import ManageColor from "../pages/admin/abouts/ManageColor";
import HelmetTypeManagement from "../pages/admin/abouts/HelmetTypeManagement";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='' element={<LayoutClient />}>
                    <Route index element={<Homepage />} />
                    <Route path='products'>
                        <Route index element={<ProductPage />} />
                        <Route path=':id' element={<ProductDetail />} />
                    </Route>
                    <Route path='success' element={<OrderSuccess />} />
                    <Route path='products/sales'>
                        <Route index element={<ProductSale />} />
                    </Route>
                    <Route path='cart'>
                        <Route index element={<CartPage />} />
                    </Route>
                    <Route path='order/bill'>
                        <Route index element={<OrderPage />} />
                    </Route>
                    <Route path='checkout'>
                        <Route index element={<OrderConfirmation />} />
                    </Route>
                    <Route path='contacts' element={<ContactPage />} />
                    <Route path='profile' element={<ProfilesPage />} />
                </Route>


                <Route path='admin' element={<LayoutAdmin />}>
                    <Route index element={<Management />} />
                    <Route path='products'>
                        <Route index element={<ManagementProduct />} />
                    </Route>
                    <Route path='vouchers'>
                        <Route index element={<ManageCategory />} />
                        <Route path=':id/update' element={<ManageCategoryUpdate />} />
                    </Route>
                    <Route path='promotions'>
                        <Route index element={<ManageHashtag />} />
                        <Route path=':id/update' element={<ManageHashtagUpdate />} />
                    </Route>
                    <Route path='brands'>
                        <Route index element={<ManageAbout />} />
                        <Route path=':id/update' element={<ManageAboutUpdate />} />
                    </Route>
                    <Route path='colors'>
                        <Route index element={<ManageColor />} />
                        <Route path=':id/update' element={<ManageAboutUpdate />} />
                    </Route>
                    <Route path='categorys'>
                        <Route index element={<HelmetTypeManagement />} />
                        <Route path=':id/update' element={<ManageAboutUpdate />} />
                    </Route>
                    <Route path='order/bill'>
                        <Route index element={<ManageBill />} />
                        <Route path=':id/update' element={<UpdateBill />} />
                    </Route>
                    <Route path='order/onlinebill'>
                        <Route index element={<OrderTable />} />
                        <Route path=':ma/update' element={<OnlineBillDetails />} />
                    </Route>
                    <Route path='comments'>
                        <Route index element={<ManageComment />} />
                    </Route>
                    <Route path='contacts'>
                        <Route index element={<ManageContact />} />
                    </Route>
                    <Route path='accounts'>
                        <Route index element={<ManageUser />} />
                    </Route>
                </Route>
                <Route path='*' element={<NotFoundPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}
export default Router