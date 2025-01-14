import { Button, Input, Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const HeaderLayoutAdmin = () => {
  return (
    <Layout.Header
      className="header bg-primary-admin text-white h-[64px] flex items-center"
      style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex justify-between items-center w-full">
        <Link to="/admin" className="flex items-center gap-[12px] h-[57px] w-[57px]">
          <img
            src="https://res.cloudinary.com/dymocu98b/image/upload/f_auto,q_auto/g3xoxs50pukmdve1ucfb"
            alt="logo"
            className="h-full w-full object-cover"
          />
          DASHBOARD
        </Link>
        <div className="flex items-center gap-2 w-full max-w-[500px]">
          <Input
            placeholder="Tìm kiếm"
            className="w-full"
            prefix={<SearchOutlined />}
          />
          <Button className="bg-black text-white">
            <SearchOutlined />
          </Button>
        </div>
        <div className="hidden lg:block">
          <Typography.Title level={5} className="!mb-0 !text-white cursor-pointer">
            ADMIN
          </Typography.Title>
        </div>
      </div>
    </Layout.Header>
  );
};

export default HeaderLayoutAdmin;
