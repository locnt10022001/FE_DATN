import { Button, Modal, FormItemProps, Form, Input, message } from 'antd';
import { createContext, useContext, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha';
import IUser from '../../../types/user';
import { ForgotPass } from '../../../services/auth';
import { useNavigate } from 'react-router-dom';
const MyFormItemContext = createContext<(string | number)[]>([]);

function toArr(str: string | number | (string | number)[]): (string | number)[] {
    return Array.isArray(str) ? str : [str];
}
const MyFormItem = ({ name, ...props }: FormItemProps) => {
    const prefixPath = useContext(MyFormItemContext);
    const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
    return <Form.Item name={concatName} {...props} />;
};
const ForgotPassword = () => {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const handleRecaptcha = (value: string | null) => {
        if (value) {
            setIsVerified(true);
        }
    };

    const showModalForgot = () => {
        setIsModalOpen(true);
    };

    const handleOkForgot = () => {
        setIsModalOpen(false);
    };

    const handleCancelForgot = () => {
        setIsModalOpen(false);
    };
    const onFinish = async (value: IUser) => {
        if (isVerified == true) {
            const key = 'loading'
            if (value) {
                try {
                    const loading = await message.loading({ content: 'loading!', key, duration: 2 })
                    if (loading) {
                        const response = await ForgotPass(value);
                        if (response) {
                            message.success('successfully forgotpassword', 3);
                            navigate('/')
                        }
                    }
                } catch (error) {
                    message.error('forgotpassword failed', 5);
                }
            }
        }
    };
    return (
        <>
            <p className='text-[14px]' onClick={showModalForgot}>
                Quên mật khẩu
            </p>
            <Modal footer={null} open={isModalOpen} onOk={handleOkForgot} onCancel={handleCancelForgot}>
                <Form className="mt-[30px] mx-auto sm:w-[400px]" name="form_item_path" layout="vertical" onFinish={onFinish} autoComplete="off">
                    <h1 className="text-center mt-4 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                        Quên mật khẩu
                    </h1>
                    <MyFormItem className='text-black font-bold'
                        name="Email"
                        label="Email"
                        rules={[
                            {
                                message: 'Vui lòng nhập email!',
                                required: true,
                                type: 'email'
                            },
                        ]}
                    >
                        <Input className='border font-mono border-indigo-600 h-10' placeholder="Nhập email" />
                    </MyFormItem>
                    <MyFormItem >
                        <ReCAPTCHA className=''
                            ref={recaptchaRef}
                            sitekey="6Ld_Ek8mAAAAAKtnDYdUCNiClx9m52L_aafio6we"
                            onChange={handleRecaptcha}
                        />
                        {isVerified ? (
                            <p>Xác thực thành công!</p>
                        ) : (
                            <p className='text-[red]'>Vui lòng xác thực bằng Recaptcha trước khi tiếp tục.</p>
                        )}
                    </MyFormItem>
                    <Button
                        htmlType="submit"
                        className="w-full h-[52px] text-center py-3 rounded bg-[#4a71c4] text-white hover:bg-green-dark focus:outline-none my-1">
                        Quên mật khẩu
                    </Button>
                </Form>

            </Modal>
        </>
    )
}

export default ForgotPassword