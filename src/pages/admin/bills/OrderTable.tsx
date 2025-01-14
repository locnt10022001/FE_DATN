import React, { useEffect, useState } from 'react';
import { Table, Button, message, Input, Tabs } from 'antd';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import './Otable.css';
import { GetOnlineBill } from '../../../services/bill';
import IBill from '../../../types/bill';
import type { ColumnsType } from 'antd/es/table';
import dayjs from "dayjs";

const { Search } = Input;
const { TabPane } = Tabs;
const OrderTable = () => {
    const [orders, setOrders] = useState<IBill[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

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


    const listData: IBill[] = orders.map((order, index) => ({
        ...order,
        stt: index + 1,
        ma: order.ma,
        diaChi: order.idTaiKhoan.sdt +" - " +order.diaChi,
        tongTien: order.tongTien,
        ghiChu: order.ghiChu,
        ngayTao: order.ngayTao,
        tt: order.tt,
      }));

    const filteredData = listData.filter((item) => {
        const statusMatches = !statusFilter || item.tt === statusFilter;
        const searchMatches = !searchText || item.ma.toLowerCase().includes(searchText.toLowerCase());
        return statusMatches && searchMatches;
    });

    const handleTabChange = (key: string) => {
        setStatusFilter(key === 'Tất cả' ? '' : key);
    };

    const btnHD = {
        border: '1px solid',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        color: '#000',
    };

    const renderStatus = (record: any) => {
        const statusColors: { [key: string]: string } = {
            "Hoàn thành": "#52c41a",
            "Đang giao hàng": "#1890ff",
            "Đã xác nhận": "#13c2c2",
            "Đã hủy": "#ff4d4f",
        };
        const buttonStyle = {
            border: '1px solid',
            borderRadius: 5,
            backgroundColor: statusColors[record.tt] || '#ffffff',
            color: statusColors[record.tt] ? '#fff' : '#000',
        };

        return <Button style={buttonStyle}>{record.tt}</Button>;
    };

    const columns: ColumnsType<IBill> = [
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
            dataIndex: 'tongTien',
            key: 'tongTien',
        },
        {
            title: 'Ghi Chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            render:(value) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
            sorter: (a, b) => new Date(a.ngayTao).getTime() - new Date(b.ngayTao).getTime(),
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder:'descend'
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
                </Link>
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

