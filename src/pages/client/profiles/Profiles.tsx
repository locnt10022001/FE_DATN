import { useEffect, useState } from "react";
import { GetBillFollowUser, GetOneUser } from "../../../services/user";
import IUser from "../../../types/user";
import { Spin } from "antd";
const ProfilePage = () => {
  const [user, setUser] = useState<IUser | any>(undefined);
  const [myBill, setMyBill] = useState<any>(undefined);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const dataCore: any = window.localStorage.getItem("user");
      const userJSON = JSON.parse(dataCore);
      const { data } = await GetOneUser(userJSON._id);
      setUser(data);
      const resMyBill: any = await GetBillFollowUser(userJSON._id);
      setMyBill({
        deliveryPedding: resMyBill.deliveryPedding,
        delivering: resMyBill.delivering,
        deliverySuccess: resMyBill.deliverySuccess,
        deliveryCount: resMyBill.deliveryCount,
      });
    } catch (error) {
      console.log(error);
    }
  };
  let urlImageBG: string =
    "https://res.cloudinary.com/practicaldev/image/fetch/s--pTKrLq38--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x6sc1eno6shuvql8noth.png";
  let imgAVT: string =
    "https://images.unsplash.com/photo-1644758653413-ee7cc9367bc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80";
  if (user == undefined) return <div className="mx-auto">
    <Spin />
  </div>;
  if (user.imagesAvt !== imgAVT) {
    imgAVT = String(user.imagesAvt);
  }
  return (
    <section className="md:relative md:min-h-screen">
      <div>
        <img src={urlImageBG} alt="" className="min-w-full" />
      </div>
      <div className="md:w-[80%] w-[100%] m-auto rounded-lg py-3 md:px-6 px-2 bg-white md:absolute md:top-[65%]  md:left-[50%] @apply shadow-[rgba(50,50,93,0.25)_0px_2px_5px_-1px,rgba(0,0,0,0.3)_0px_1px_3px_-1px] md:-translate-x-2/4 md:-translate-y-2/4">
        <header className="md:pb-[10%] grid md:grid-cols-3 py-3">
          <div className="max-md:order-2 flex md:gap-5 gap-2 max-md:w-full max-md:justify-center">
            <div className="text-center">
              <h3 className="text-gray-600 font-medium">
                {myBill?.deliveryCount}
              </h3>
              <p className="text-sm font-medium text-gray-600">Tổng đơn</p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-600 font-medium">
                {myBill?.deliveryPedding}
              </h3>
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-600 font-medium">
                {myBill?.delivering}
              </h3>
              <p className="text-sm font-medium text-gray-600">Đang giao</p>
            </div>
          </div>
          <div className="max-md:order-1 md:relative max-md:py-3 max-md:flex max-md:justify-center max-md:items-center">
            <div className="flex justify-center items-center overflow-hidden border-4 border-green-200 rounded-full md:h-52 md:w-52 object-cover md:absolute md:top-[-5%] md:left-[50%] md:-translate-x-2/4 md:-translate-y-2/4 h-28 w-28">
              <img src={imgAVT} className="w-full" />
            </div>
          </div>
          <div className="md:text-right text-center max-md:order-3">
            <button className="max-md:mt-3 inline-block px-3 py-1 md:px-6 md:py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none">
              Chỉnh sửa
            </button>
          </div>
        </header>
        <main className="w-full text-center py-3">
          <div>
            <div className="w-full flex justify-center items-center md:mb-3">
              <h1 className="md:text-3xl text-lg font-medium text-gray-700">
                {user.name}
              </h1>
              <img
                className="md:w-7 md:h-7 h-4 w-4 mx-1 md:mx-2"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/512px-Twitter_Verified_Badge.svg.png"
                alt=""
              />
            </div>
            <div className="py-2 md:py-4 max-sm:px-3">
              <div className="max-sm:text-left md:w-[30%] m-auto">
                <div className="font-medium text-gray-500 text-sm my-2">
                  <i className="fa-solid fa-location-dot mx-2"></i>{" "}
                  {user.address == "" || !user.address
                    ? "Thêm địa chỉ"
                    : user.address}
                </div>
                <div className="font-medium text-gray-500 text-sm  my-2">
                  <i className="fa-solid fa-venus-mars  mx-2"></i>{" "}
                  {user.gender == "male" || !user.gender ? "Nam" : "Nữ"}
                </div>
                <div className="font-medium text-gray-500 text-sm  my-2">
                  <i className="fa-solid fa-phone  mx-2"></i>
                  {user.tel == "" || !user.tel
                    ? "Thêm số điện thoại"
                    : user.tel}
                </div>
                <div className="font-medium text-gray-500 text-sm  my-2">
                  <i className="fa-solid fa-envelope  mx-2"></i> {user.email}
                </div>
                <div className="font-medium text-gray-500 text-sm  my-2">
                  <i className="fa-solid fa-money-bill-wheat  mx-2"></i>{" "}
                  {user.role == "admin" ? "Quản trị viên" : "Thành viên"}
                </div>
                <div className="font-medium text-gray-500 text-sm  my-2">
                  <i className="fa-solid fa-clock mx-2"></i> Ngày tạo: &nbsp;
                  {user.createdAt}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default ProfilePage;
