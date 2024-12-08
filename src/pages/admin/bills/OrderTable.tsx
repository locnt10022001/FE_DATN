import React, { useEffect, useState } from 'react';
import { Table, Button, message, Input, Tabs, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, DownOutlined, InfoCircleOutlined } from "@ant-design/icons";
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
            stt: index + 1,
            id: order.id,
            ma: order.ma,
            diaChi: order.diaChi,
            tien: order.tongTien,
            ghichu: order.ghiChu,
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

    const btnHD = {
        border: '1px solid',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        color: '#000',
        
    };

    const renderStatus = (record: any) => {
        const statusColors: { [key: string]: string } = {
            "Hoàn thành": "#52c41a", // Xanh lá
            "Đang giao hàng": "#1890ff", // Xanh dương
            "Đã xác nhận": "#13c2c2", // Màu cian
            "Đã Hủy": "#ff4d4f",   // Màu đỏ
        };
        const buttonStyle = {
            border: '1px solid',
            borderRadius: 5,
            backgroundColor: statusColors[record.tt] || '#ffffff',
            color: statusColors[record.tt] ? '#fff' : '#000',
        };

        return <Button style={buttonStyle}>
            {record.tt}
        </Button>
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Mã HĐ',
            dataIndex: 'ma',
            key: 'ma',
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'diaChi',
            key: 'diaChi',
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'tien',
            key: 'tien',
        },
        {
            title: 'Ghi Chú',
            dataIndex: 'ghichu',
            key: 'ghichu',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
        },
        {
            title: 'Trạng Thái',
            key: 'tt',
            render: (record: any) => renderStatus(record),
        },
        {
            title: 'Hành Động',
            render: (item: IBill) => (

                <Link to={`/admin/order/onlinebill/${item.ma}/update`}>
                    <Button style={btnHD}>Chi tiết</Button>
                </Link >
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
                <TabPane tab="Đang giao hàng" key="Đang giao hàng" />
                <TabPane tab="Hoàn thành" key="Hoàn thành" />
                <TabPane tab="Đã hủy" key="Đã hủy" />
                <TabPane tab="Hoàn trả" key="Hoàn trả" />
            </Tabs>

            <Table
                bordered
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