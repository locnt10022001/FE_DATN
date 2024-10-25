import { BrowserRouter, Routes, Route } from "react-router-dom"
import LayoutClient from "../layouts/client";
import Homepage from "../pages/client/HomePage";
import ProductPage from "../pages/client/ProductsPage";
import ProductDetailPage from "../pages/client/ProductDetailPage";
import ProductSale from "../pages/client/ProductsSalePage";
import SignupPage from "../pages/client/SignupPage";
import SigninPage from "../pages/client/SigninPage";
import ContactPage from "../pages/client/ContactPage";
import { CartPage } from "../pages/client/Cart";
import OrderPage from "../pages/client/Bill";
import LayoutAdmin from "../layouts/admin";
import ManagementProduct from "../pages/admin/products/ManageProduct";
import ManagementProductUpdate from "../pages/admin/products/ManageProductUpdate";
import ManageCategory from "../pages/admin/categories/ManageCategory";
import ManageCategoryUpdate from "../pages/admin/categories/ManageCategoryUpdate";
import ManageComment from "../pages/admin/comments/ManageComment";
import ManageContact from "../pages/admin/contacts/ManageContact";
import ManageUser from "../pages/admin/user/ManageUser";
import Management from "../pages/admin/dashboard/Management";
import ManageHashtag from "../pages/admin/hashtags/ManageHashtag";
import ManageHashtagUpdate from "../pages/admin/hashtags/ManageHashtagUpdate";
import ManageBill from "../pages/admin/bills/ManageBill";
import ManageBillUpdate from "../pages/admin/bills/ManageBillUpdate";
import ManageAbout from "../pages/admin/abouts/ManageAbout";
import ManageAboutUpdate from "../pages/admin/abouts/ManageAboutUpdate";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilesPage from "../pages/client/profiles/Profiles";
import NewBill from "../pages/admin/bills/NewBill";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='' element={<LayoutClient />}>
                    <Route index element={<Homepage />} />
                    <Route path='products'>
                        <Route index element={<ProductPage />} />
                        <Route path=':id' element={<ProductDetailPage />} />
                    </Route>
                    <Route path='products/sales'>
                        <Route index element={<ProductSale />} />
                    </Route>
                    <Route path='cart'>
                        <Route index element={<CartPage />} />
                    </Route>
                    <Route path='order/bill'>
                        <Route index element={<OrderPage />} />
                    </Route>
                    <Route path='contacts' element={<ContactPage />} />
                    <Route path='profile' element={<ProfilesPage />} />
                </Route>


                <Route path='admin' element={<LayoutAdmin />}>
                    <Route index element={<Management />} />
                    <Route path='products'>
                        <Route index element={<ManagementProduct />} />
                        <Route path=':id/update' element={<ManagementProductUpdate />} />
                    </Route>
                    <Route path='categories'>
                        <Route index element={<ManageCategory />} />
                        <Route path=':id/update' element={<ManageCategoryUpdate />} />
                    </Route>
                    <Route path='hashtags'>
                        <Route index element={<ManageHashtag />} />
                        <Route path=':id/update' element={<ManageHashtagUpdate />} />
                    </Route>
                    <Route path='abouts'>
                        <Route index element={<ManageAbout />} />
                        <Route path=':id/update' element={<ManageAboutUpdate />} />
                    </Route>
                    <Route path='order/bill'>
                        <Route index element={<ManageBill />} />
                        {/* <Route path=':id/update' element={<ManageBillUpdate />} /> */}
                    </Route>
                    <Route path='order/bill/newbill'>
                        <Route index element={<NewBill />} />
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
                <Route path='signin' element={<SigninPage />}></Route>
                <Route path='signup' element={<SignupPage />}></Route>
                <Route path='*' element={<NotFoundPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}
export default Router