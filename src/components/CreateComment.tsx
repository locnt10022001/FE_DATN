import { message, Form, Input } from 'antd';
import IComment from '../types/comment';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateCommentByProduct } from '../services/comments';
import useFetchData from '../hooks/useFetchData';
const CreateComment = () => {
    const { id }: string | any = useParams()
    const navigate = useNavigate()
    const { data } = useFetchData('/comments/product/' + id)
    const user = localStorage.getItem("user");
    const userParse = user ? JSON.parse(user) : null;
    const onFinish = async (value: IComment) => {
        const key = 'loading'
        if (value) {
            const loading = await message.loading({ content: 'loading!', key, duration: 2 })
            if (loading) {
                const Data: IComment = {
                    content: value.content,
                    User_id: userParse._id,
                    Product_id: id
                }
                if (Data) {
                    try {
                        const response: any = await CreateCommentByProduct(Data);
                        if (response) {
                            message.success(response.message, 3);
                            navigate('/products/' + id)
                        }
                    } catch (error: any) {
                        message.error(error.response.data.message, 5);
                    }
                }
            }
        }
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">Comment List</h1>
                {/* List of comments */}
                <div className="mb-8">
                    {data.length === 0 ? (
                        <div className="text-gray-600">chưa có bình luận nào</div>
                    ) : (
                        data.map((cmt: any) => {
                            return (
                                <div className="flex items-start mb-4" key={cmt._id}>
                                    <div>
                                        <p className="text-gray-600">{cmt.createdAt}</p>
                                        <p>{cmt.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">Leave a Comment</h1>
            <Form name="form_item_path" layout="vertical" onFinish={onFinish} autoComplete="off">
                <Form.Item
                    name="content"
                    label="content"
                    rules={[
                        {
                            message: 'please enter content!',
                            required: true,
                        },
                    ]}
                >
                    <Input.TextArea className='border border-indigo-600 rounded-md px-4 py-2 text-lg' rows={4} />
                </Form.Item>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Submit
                </button>
            </Form>
        </div>
    )
}

export default CreateComment