import React, { useEffect, useState } from 'react';
import { Table, Button, message, Input, Tabs, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, DownOutlined } from "@ant-design/icons";
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import './Otable.css';
import { GetOnlineBill } from '../../../services/bill'; 
import IBill from '../../../types/bill';

const { Search } = Input;
const { TabPane } = Tabs;
const OrderTable = () => {
    const [orders, setOrders] = useState<IBill[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    const statusOptions: { [key: string]: string[] } = {
        "Chờ xác nhận": ["Xác nhận"],
        "Đã xác nhận": ["Đang giao"],
        "Đang giao": ["Đã giao"],
        "Đã giao": [],
        "Hoàn thành": [],
        "Đã Hủy": [],
        "Hoàn trả": [],
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data } = await GetOnlineBill();
                setOrders(data);
            } catch (error) {
                message.error("Lỗi khi tải danh sách đơn hàng!");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatOrderData = (orders: IBill[]) => {
        return orders.map((order, index) => ({
            id: order.id,
            ma: order.ma,
            loaiHD: parseInt(order.loaiHoaDon) === 1 ? "HD Tại Quầy" : "HD Online",
            tien: order.tongTien,
            soTien: order.soTienDaTra,
            ngayTao: order.ngayTao ? format(parseISO(order.ngayTao), 'HH:mm:ss dd-MM-yyyy') : '',
            tt: order.tt,
        }));
    };

    const listData = formatOrderData(orders);

    const filteredData = listData.filter((item) => {
        const statusMatches = statusFilter === '' || item.tt === statusFilter;
        const searchMatches = searchText === '' || item.ma.toLowerCase().includes(searchText.toLowerCase());
        return statusMatches && searchMatches;
    });

    const handleTabChange = (key: string) => {
        setStatusFilter(key === 'Tất cả' ? '' : key);
    };

    const handleStatusChange = (record: any, newStatus: string) => {
        const updatedOrders = orders.map((order) => {
            if (order.ma === record.ma) {
                return { ...order, tt: newStatus };
            }
            return order;
        });
        setOrders(updatedOrders);
        message.success(`Cập nhật trạng thái của hóa đơn ${record.ma} thành ${newStatus}`);
    };

    const renderStatus = (record: any) => {
        const validStatuses = statusOptions[record.tt] || [];
        const menu = (
            <Menu>
                {validStatuses.map((status) => (
                    <Menu.Item key={status} onClick={() => handleStatusChange(record, status)}>
                        {status}
                    </Menu.Item>
                ))}
            </Menu>
        );

        return validStatuses.length > 0 ? (
            <Dropdown overlay={menu} trigger={['click']}>
                <Button style={{ border: '1px solid #1890ff', borderRadius: 5 }}>
                    {record.tt} <DownOutlined />
                </Button>
            </Dropdown>
        ) : (
            <Button disabled style={{ border: '1px solid #d9d9d9', borderRadius: 5 }}>
                {record.tt}
            </Button>
        );
    };

    const handleDelete = async (id: number) => {
        try {
            message.success(`Xóa đơn hàng ID ${id} thành công!`);
        } catch (error) {
            message.error("Lỗi khi xóa đơn hàng!");
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Mã HĐ',
            dataIndex: 'ma',
            key: 'ma',
        },
        {
            title: 'Loại HĐ',
            dataIndex: 'loaiHD',
            key: 'loaiHD',
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'tien',
            key: 'tien',
        },
        {
            title: 'Số Tiền Đã Trả',
            dataIndex: 'soTien',
            key: 'soTien',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
        },
        {
            title: 'Trạng Thái',
            key: 'tt',
            render: (text: string, record: any) => renderStatus(record),
        },
        {
            title: 'Hành Động',
            render: (item: IBill) => (
                <>
                    <Link to={`/admin/order/onlinebill/${item.id}/update`}>
                        <Button type="default" icon={<EditOutlined />} style={{ marginRight: 8 }}>
                            Sửa
                        </Button>
                    </Link>
                </>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: '8px' }}>
                <Search
                    placeholder="Tìm kiếm mã hóa đơn"
                    onSearch={(value) => setSearchText(value)}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>

            <Tabs defaultActiveKey="Tất cả" onChange={handleTabChange}>
                <TabPane tab="Tất cả" key="Tất cả" />
                <TabPane tab="Chờ xác nhận" key="Chờ xác nhận" />
                <TabPane tab="Đã xác nhận" key="Đã xác nhận" />
                <TabPane tab="Đang giao" key="Đang giao" />
                <TabPane tab="Đã giao" key="Đã giao" />
                <TabPane tab="Hoàn thành" key="Hoàn thành" />
                <TabPane tab="Đã hủy" key="Đã hủy" />
                <TabPane tab="Hoàn trả" key="Hoàn trả" />
            </Tabs>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                loading={loading}
                style={{ marginTop: 16 }}
            />
        </div>
    );
};

export default OrderTable;