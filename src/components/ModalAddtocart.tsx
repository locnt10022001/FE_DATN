import { Modal } from 'antd';
import { useState } from 'react';
import { IProduct } from '../types/product';
import { Carousel, FormItemProps, Image, Input, Form, Select, message } from 'antd'
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { createContext, useContext } from 'react';
import { AppDispatch } from '../redux/store';
type Props = {
    product: IProduct,
}
const MyFormItemContext = createContext<(string | number)[]>([]);
function toArr(str: string | number | (string | number)[]): (string | number)[] {
    return Array.isArray(str) ? str : [str];
}
const MyFormItem = ({ name, ...props }: FormItemProps) => {
    const prefixPath = useContext(MyFormItemContext);
    const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
    return <Form.Item name={concatName} {...props} />;
};

const ModalAddtocart = (props: Props) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const onFinish = async (values: IProduct) => {
        const cartData: any = {
            size: values.sizes,
            quantity: values.quantity,
            productId: props.product._id
        }
        const key = 'loading'
        const loading = await message.loading({ content: 'loading!', key, duration: 2 })
        if (loading) {
            message.success('add to cart successfully')
            dispatch(addToCart(cartData));
        }
    };
    return (
        <>
            <button onClick={() => setOpen(true)} className='bg-black text-white w-full h-[42px] rounded-xl'>Add To Cart</button>
            <Modal
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1100}
                footer={null}
            >
                <section className="py-10 font-poppins dark:bg-gray-800">
                    <div key={props.product._id} className=" px-4 mx-auto">
                        <div className="flex flex-wrap mb-24 -mx-4">
                            <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                                <div className="sticky top-0 overflow-hidden ">
                                    <div className="relative mb-6 lg:mb-10 lg:h-96">
                                        <Carousel autoplay>
                                            {props.product.images.map((image, index) => (
                                                <div key={index}>
                                                    <img className="object-contain w-full lg:h-full" src={image} alt={`Slide ${index + 1}`} />
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                    <div className="flex-wrap hidden -mx-2 md:flex md:mt-[250px]">
                                        {props.product.images.map((image, index) => (
                                            <div key={index} className="w-1/2 p-2 sm:w-1/4">
                                                <div key={index}
                                                    className="block border border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-300"
                                                >
                                                    <Image
                                                        className="object-contain w-full lg:h-28"
                                                        src={image}
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 md:w-1/2">
                                <Form name="form_item_path" layout="vertical" onFinish={onFinish} autoComplete="off">
                                    <div className="lg:pl-20">
                                        <div className="mb-6 ">
                                            {props.product.salePrice < props.product.price ?
                                                <span className="px-2.5 py-0.5 text-xs text-blue-600 bg-blue-100 dark:bg-gray-700 rounded-xl dark:text-gray-200">
                                                    sale
                                                </span> : <span></span>
                                            }

                                            <h2 className="max-w-xl mt-6 mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                                                {props.product.name}
                                            </h2>
                                            <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400 ">
                                                <span className='text-bold text-[red]'>${props.product.salePrice}</span>
                                                {props.product.salePrice > 0
                                                    ?
                                                    <span className="ml-3 text-base font-normal text-gray-500 line-through dark:text-gray-400">
                                                        ${props.product.price}
                                                    </span>
                                                    : <span className='text-bold text-[red]'>{props.product.price}</span>
                                                }
                                            </p>
                                        </div>
                                        <div className="mb-6">
                                            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl">
                                                <div className="p-3 lg:p-5 ">
                                                    <p>{props.product.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <MyFormItem className='w-[200px]'
                                                rules={[
                                                    {
                                                        message: 'please enter size!',
                                                        required: true,
                                                    },
                                                ]}
                                                name="sizes"
                                                label="choose shoe size"
                                            >
                                                <Select placeholder="37"
                                                    className="border text-black border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    options={props.product.sizes.map((atb) => ({
                                                        label: atb.size,
                                                        value: atb.size,
                                                    }))}
                                                />
                                            </MyFormItem>
                                            <MyFormItem className='w-[200px]'
                                                rules={[
                                                    {
                                                        message: 'please enter quantity!',
                                                        required: true,
                                                    },
                                                ]}
                                                name="quantity"
                                                label="quantity"
                                            >
                                                <Input type='number' min={1} max={5} className='h-10' placeholder="1" />
                                            </MyFormItem>
                                        </div>
                                        <div className="flex gap-4 mb-6">
                                            <button
                                                className="w-full px-4 py-3 text-center bg-black text-white rounded-xl"
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </section>
            </Modal>
        </>
    );
};

export default ModalAddtocart;