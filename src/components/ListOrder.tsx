import IBill from "../types/bill";
import ListItemsOrder from "./ListItemsOrder";
import { RemoveBill } from "../services/bill";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";

type Props = {
    orders: IBill[];
};

const ListOrder = (props: Props) => {
    const navigate = useNavigate()
    const Remove = (id: string) => {
        try {
            Modal.confirm({
                title: 'Confirm',
                content: 'Are you sure you want to delete this about?',
                okText: 'Yes',
                cancelText: 'No',
                okButtonProps: {
                    className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" // áp dụng lớp CSS
                },
                onOk: async () => {
                    const loading = message.loading({ content: 'Loading...', duration: 0 });
                    setTimeout(async () => {
                        if (loading) {
                            loading();
                        }
                        const response = await RemoveBill(id);
                        if (response) {
                            message.success('order cancel successfully', 3);
                            navigate('/')
                        }
                    }, 2000);
                },
                onCancel: () => {
                    message.success('Canceled!');
                },
            });
        } catch (error) {
            message.error('failed order cancellation!', 5);
        }
    };

    return (
        <>
            {props.orders.map((bill) => {
                return (
                    <div
                        key={bill._id}
                        className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden mb-5"
                    >
                        <div className="px-6 py-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Thank you for your purchase!
                            </h2>
                            <p className="text-gray-700 mb-2">
                                We have received your order and will process it shortly.
                            </p>
                            <p className="text-gray-700 mb-2">
                                Your order number is:{" "}
                                <span className="font-semibold">{bill.orderCode}</span>
                            </p>
                            <p className="text-gray-700 mb-2">
                                An invoice has been sent to your email address.
                            </p>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-300">
                            <ListItemsOrder bill={bill} />
                        </div>
                        <div className="px-6 py-4 border-t border-gray-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Shipping Address
                            </h3>
                            <div className="mt-2">
                                <p className="text-gray-700 mb-1">Name: {bill.name}</p>
                                <p className="text-gray-700 mb-1">Email: {bill.email}</p>
                                <p className="text-gray-700 mb-1">Phone: {bill.phone}</p>
                                <p className="text-gray-700 mb-1">Address: {bill.address}</p>
                                <p className="text-gray-700 mb-1">status: {bill.status}</p>
                                <p className="text-[red] font-bold">total: ${bill.total}</p>
                            </div>
                            {bill.status === "đang chờ duyệt" ? (
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => Remove(bill._id)}
                                >
                                    Hủy đơn hàng
                                </button>
                            ) : (
                                <button disabled
                                    className="bg-[gray] text-white font-bold py-2 px-4 rounded"
                                    onClick={() => Remove(bill._id)}
                                >
                                    Hủy đơn hàng
                                </button>
                            )}

                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ListOrder;
