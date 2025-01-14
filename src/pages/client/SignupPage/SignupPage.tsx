import { useRef, useState } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Signup, Signin } from '../../../services/auth';
import ReCAPTCHA from 'react-google-recaptcha';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse } from '../../../types/user';

const SignupPage = () => {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLoginAfterSignup = async (value: LoginRequest) => {
        if (value) {
            try {
                const loading = await message.loading({ content: 'Đang đăng nhập...', key: "loading", duration: 2 })
                if (loading) {
                    const response: AxiosResponse<LoginResponse> = await Signin(value);
                    if (response) {
                        setIsModalOpen(false);
                        const data: any = response
                        localStorage.setItem('accessToken', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user))
                        message.success("Đăng nhập thành công", 3);
                        window.location.reload();
                    }
                }

            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.error) {
                    message.error(error.response.data.error, 3);
                } else {
                    message.error("Đã xảy ra lỗi, vui lòng thử lại sau!", 3);
                }
            }
        }
    };

    const onFinish = async (values: any) => {
        if (!isVerified) {
            message.error('Vui lòng xác thực reCAPTCHA trước khi đăng ký.');
            return;
        }

        const payload = {
            tenDangNhap: values.username,
            matKhau: values.password,
            idVaiTro: { id: 3 }, // Value 3 là Normal User
            ten: values.name,
        };

        try {
            const loading = message.loading({ content: 'Đang xử lý...', key: 'signup', duration: 2 });
            const response = await Signup(payload);
            if (response && await loading) {
                message.success('Đăng ký thành công!', 3);
                setIsModalOpen(false);
                await handleLoginAfterSignup({ tenDangNhap: values.username, matKhau: values.password });
                form.resetFields();
                recaptchaRef.current?.reset();
                setIsVerified(false);

            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error, 5);
            } else {
                message.error('Đã xảy ra lỗi, vui lòng thử lại sau!', 5);
            }
        }
    };

    const handleRecaptcha = (value: string | null) => {
        setIsVerified(!!value);
    };

    const showModalSignup = () => {
        setIsModalOpen(true);
    };

    const handleCancelSignup = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button onClick={showModalSignup}>Đăng ký</Button>
            <Modal
                open={isModalOpen}
                footer={null}
                onCancel={handleCancelSignup}>
                <Form
                    form={form}
                    className="mt-8 mx-auto sm:w-[400px]"
                    name="form_signup"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off">
                    <p
                        tabIndex={0}
                        role="heading"
                        aria-label="Đăng ký tài khoản"
                        className="text-2xl font-extrabold leading-6 text-gray-800 mb-8">
                        Đăng ký tài khoản
                    </p>

                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!', min: 3 }]}
                    >
                        <Input className="font-mono border border-indigo-600 h-10" placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!', min: 3 }]}
                    >
                        <Input className="font-mono border border-indigo-600 h-10" placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!', min: 6 }]}
                    >
                        <Input.Password
                            className="font-mono border border-indigo-600 h-10"
                            placeholder="Nhập mật khẩu"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmpassword"
                        label="Nhập lại mật khẩu"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]} >
                        <Input.Password
                            className="font-mono border border-indigo-600 h-10"
                            placeholder="Nhập lại mật khẩu"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6Ld_Ek8mAAAAAKtnDYdUCNiClx9m52L_aafio6we"
                            onChange={handleRecaptcha}
                        />
                        {!isVerified && (
                            <p className="text-red-500">Vui lòng xác thực bằng reCAPTCHA trước khi tiếp tục.</p>
                        )}
                    </Form.Item>

                    <Button
                        htmlType="submit"
                        className="w-full h-[52px] text-center py-3 rounded bg-[#4a71c4] text-white hover:bg-green-dark focus:outline-none my-1"
                    >
                        Đăng ký
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default SignupPage;
