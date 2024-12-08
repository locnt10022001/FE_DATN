import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Row, Col, Divider, Button, Table, Steps, Tag, message } from 'antd';
import { GetOneBill, UpdateBillStatus } from '../../../services/bill';
import { BillDetail, } from '../../../types/billdetail';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    CarOutlined,
    SmileOutlined
} from '@ant-design/icons';
import { BillResponse } from '../../../types/billresponse';

const { Title, Text } = Typography;
const { Step } = Steps;

const OnlineBillDetails = () => {
    const [orderDetails, setOrderDetails] = useState<BillResponse | null>(null);
    const { ma } = useParams();
    const navigate = useNavigate();

    const statusSteps = [
        { title: 'Chưa xác nhận', key: 'Chưa xác nhận' },
        { title: 'Đã xác nhận', key: 'Đã xác nhận' },
        { title: 'Đang giao hàng', key: 'Đang giao hàng' },
        { title: 'Hoàn thành', key: 'Hoàn thành' },
        { title: 'Đã hủy', key: 'Đã hủy' },
    ];

    const statusIcons: Record<string, React.ReactNode> = {
        "Chưa xác nhận": <ClockCircleOutlined />,
        "Đã xác nhận": <CheckCircleOutlined />,
        "Đang giao hàng": <CarOutlined />,
        "Hoàn thành": <SmileOutlined />,
        "Đã hủy": <CloseCircleOutlined />,
    };

    const getCurrentStep = (status: string) => {
        const index = statusSteps.findIndex((step) => step.key === status);
        return index !== -1 ? index : 0;
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (ma) {
                try {
                    GetOneBill(ma).then(({ data }) => setOrderDetails(data[0]));
                } catch (error: any) {
                    console.error('Error fetching order details:', error);
                    message.error('Không thể tải thông tin đơn hàng.');
                }
            }
        };
        fetchOrderDetails();
    }, [ma]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (orderDetails) {
            try {
                await UpdateBillStatus(orderDetails.hoaDon.id, newStatus);
                message.success(`Cập nhật trạng thái thành công: ${newStatus}`);
                setOrderDetails({ ...orderDetails, tt: newStatus })
                window.location.reload()
            } catch (error) {
                console.error('Error updating order status:', error);
                message.error('Không thể cập nhật trạng thái đơn hàng.');
            }
        }
    };

    const renderActionButtons = () => {
        switch (orderDetails?.hoaDon.tt) {
            case 'Chờ xác nhận' || 'Chưa xác nhận':
                return (
                    <>
                        <Button type="default" className='mr-8' onClick={() => handleUpdateStatus("Đã xác nhận")}>
                            Xác nhận
                        </Button>

                        <Button danger onClick={() => handleUpdateStatus("Đã hủy")}>
                            Hủy
                        </Button>
                    </>
                );
            case 'Đã xác nhận':
                return (
                    <Button type="default" onClick={() => handleUpdateStatus("Đang giao hàng")}>
                        Vận chuyển
                    </Button>
                );
            case 'Đang giao hàng':
                return (
                    <Button type="default" onClick={() => handleUpdateStatus("Hoàn thành")}>
                        Đã giao hàng
                    </Button>
                );
            default:
                return null;
        }
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl: string) => (
                <img src={imageUrl} alt="Product" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center' as const,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()} đ`,
            align: 'right' as const,
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice: number) => `${totalPrice.toLocaleString()} đ`,
            align: 'right' as const,
        },
    ];

    if (!orderDetails) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Text>Đang tải thông tin đơn hàng...</Text>
            </div>
        );
    }

    const listDataGH = Array.isArray(orderDetails.chiTietList) ? orderDetails.chiTietList.map((item: BillDetail) => {
        return {
            imageUrl: item.idSPCT.anh,
            name: item.idSPCT.idSanPham.ten,
            quantity: item.sl,
            price: item.idSPCT.donGia,
            totalPrice: item.idSPCT.donGia * item.sl,
        };
    }) : [];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

            <Title level={2}>Chi Tiết Đơn Hàng</Title>
            <Row justify="end">
                <Button type="default" onClick={handleBack}>
                    Quay lại
                </Button>
            </Row>
            <Divider />
            <Steps
                current={getCurrentStep(orderDetails.hoaDon.tt)}
                style={{ marginBottom: '20px' }}>
                {statusSteps.map((step) => (
                    <Step
                        key={step.key}
                        title={step.title}
                        icon={statusIcons[step.key]}
                    />
                ))}
            </Steps>
            <Row gutter={16}>
                <Col span={16}>
                    <Card title="Thông Tin Sản Phẩm">
                        <Table
                            columns={columns}
                            dataSource={listDataGH}
                            rowKey="id"
                            pagination={false}
                            bordered
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Thông Tin Đơn Hàng">
                        <Row style={{ marginBottom: '10px' }}>
                            <Col span={10}>
                                <Text strong>Mã đơn hàng:</Text>
                            </Col>
                            <Col span={14}>{orderDetails.hoaDon.ma}</Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col span={10}>
                                <Text strong>Tên khách hàng:</Text>
                            </Col>
                            <Col span={14}>{orderDetails.hoaDon.idTaiKhoan.ten}</Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col span={10}>
                                <Text strong>Địa chỉ:</Text>
                            </Col>
                            <Col span={14}>{orderDetails.hoaDon.diaChi}</Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col span={10}>
                                <Text strong>Số điện thoại:</Text>
                            </Col>
                            <Col span={14}>{orderDetails.hoaDon.idTaiKhoan.sdt}</Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col span={10}>
                                <Text strong>Thanh toán:</Text>
                            </Col>
                            <Col span={14}>{orderDetails.hoaDon.formattedGia}</Col>
                        </Row>
                        <Divider />
                        <Row>
                            <Col span={10}>
                                <Text strong>Tổng tiền:</Text>
                            </Col>
                            <Col span={14}>
                                <Title level={4} style={{ color: 'green' }}>
                                    {orderDetails.hoaDon.formattedGia}
                                </Title>
                            </Col>
                        </Row>
                        <Divider />
                        <Row justify="center" gutter={[8, 8]}>
                            {renderActionButtons()}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OnlineBillDetails;