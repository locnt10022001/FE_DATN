import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Result, Button } from "antd";

const WarningNotAdmin = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
            extra={
                <Button
                    className="bg-[#1677ff]"
                    type="primary"
                    onClick={() => navigate("/")}>
                    Quay lại trang chủ
                </Button>
            }
        />
    );
};

export default WarningNotAdmin;