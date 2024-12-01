import React from 'react';
import { Button, Typography, Card } from 'antd';
import { CheckCircleOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '66vh',
                background: 'linear-gradient(135deg, #f0f5ff, #d6e4ff)',
            }}
        >
            <Card
                style={{
                    maxWidth: 600,
                    padding: '30px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                }}
            >
                <CheckCircleOutlined style={{ fontSize: '80px', color: '#52c41a', marginBottom: '20px' }} />
                <Title level={2} style={{ color: '#333' }}>Đặt Hàng Thành Công!</Title>
                <Text style={{ fontSize: '16px', color: '#555' }}> Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</Text>
                <div style={{ marginTop: '30px' }}>
                    <Button
                        type="default"
                        size="large"
                        onClick={() => navigate('/')}
                        style={{ width: '200px', fontSize: '16px' }}
                        icon={<DoubleLeftOutlined/>}> Quay Lại Trang Chủ</Button>
                </div>
            </Card>
        </div>
    );
};

export default OrderSuccess;