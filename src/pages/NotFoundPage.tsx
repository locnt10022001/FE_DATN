import { Link } from "react-router-dom"
import { Result, Button } from 'antd';
const NotFoundPage = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Link to='/'><Button className="bg-[#1677ff]" type="primary">Back Home</Button></Link>}
        />
    )
}
export default NotFoundPage