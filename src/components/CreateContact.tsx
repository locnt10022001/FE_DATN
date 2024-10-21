import { Button, Form, FormItemProps, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message } from "antd"
import { createContext, useContext } from 'react';
import { CreateContact } from '../services/contact';
import IContact from '../types/contact';
const FormCreateContact = () => {
    const Navigate = useNavigate()
    const onFinish = async (value: IContact) => {
        const key = 'loading'
        if (value) {
            try {
                const loading = await message.loading({ content: 'loading!', key, duration: 2 })
                if (loading) {
                    const response = await CreateContact(value);
                    if (response) {
                        message.success('contact sent successfully', 3);
                        Navigate('/')
                    }
                }

            } catch (error: any) {
                message.error('contact sent failed', 5);
            }
        }
    }
    return (
        <div className="px-8 py-8 bg-white border rounded-md shadow-md dark:border-gray-800 dark:bg-gray-800">
            <div className="max-w-xl mx-auto">
                <div className="text-center ">
                    <div className="relative flex flex-col items-center">
                        <div className="absolute hidden md:block -top-14 left-0 text-[120px] text-gray-400 font-bold opacity-10">
                            Contact
                        </div>
                        <h1 className="text-5xl font-bold dark:text-white">
                            {" "}
                            Our <span className="text-blue-500"> Contact</span>{" "}
                        </h1>
                        <div className="flex w-24 mt-1 mb-10 overflow-hidden rounded">
                            <div className="flex-1 h-2 bg-blue-200"></div>
                            <div className="flex-1 h-2 bg-blue-400"></div>
                            <div className="flex-1 h-2 bg-blue-600"></div>
                        </div>
                    </div>
                    <p className="mb-16 text-base text-center text-gray-500">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus
                        magni eius eaque? Pariatur numquam, odio quod nobis ipsum ex
                        cupiditate?
                    </p>
                </div>
            </div>
            <div className="px-8 py-8 bg-white border rounded-md shadow-md dark:border-gray-800 dark:bg-gray-800">
                <Form className="mt-4 max-w-lg mx-auto" name="form_item_path" layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        name="name"
                        label="name"
                        rules={[
                            {
                                message: 'please enter name!',
                                required: true,
                            },
                        ]}
                    >
                        <Input className='border border-indigo-600 h-10 rounded-md px-4 py-2 text-lg lg:w-[600px]' placeholder="please enter name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                message: 'please enter email!',
                                required: true,
                                type: 'email'
                            },
                        ]}
                    >
                        <Input className='border border-indigo-600 h-10 rounded-md px-4 py-2 text-lg lg:w-[600px]' placeholder="please enter email" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="phone"
                        rules={[
                            {
                                message: 'please enter phone!',
                                required: true,
                            },
                        ]}
                    >
                        <Input className='border border-indigo-600 h-10 rounded-md px-4 py-2 text-lg lg:w-[600px]' placeholder="please enter phone" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="address"
                        rules={[
                            {
                                message: 'please enter address!',
                                required: true,
                            },
                        ]}
                    >
                        <Input className='border border-indigo-600 h-10 rounded-md px-4 py-2 text-lg lg:w-[600px]' placeholder="please enter address" />
                    </Form.Item>
                    <Form.Item
                        name="support"
                        label="support"
                        rules={[
                            {
                                message: 'please enter support!',
                                required: true,
                            },
                        ]}
                    >
                        <Input.TextArea className='border border-indigo-600 rounded-md px-4 py-2 text-lg' rows={4} />
                    </Form.Item>
                    <Button
                        htmlType="submit"
                        className="w-full rounded-lg h-12 text-center py-3 bg-black text-white hover:bg-green-dark focus:outline-none my-1"
                    >
                        Send Now
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default FormCreateContact