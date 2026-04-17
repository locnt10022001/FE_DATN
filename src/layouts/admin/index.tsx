import { Layout } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLayoutAdmin from './components/header';
import SidebarLayoutAdmin from './components/sidebar';
import MainLayoutAdmin from './components/main';
const { Footer } = Layout;
const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();

  const user: any = localStorage.getItem('user')
  const parseUser = JSON.parse(user);
  if (parseUser) {
    parseUser.role === 'Admin' ? console.log('ok') : navigate('/notAdmin')
  } else {
    navigate('/notAdmin')
  }

  return (
    <Layout >
      <HeaderLayoutAdmin />
      <Layout style={{ display: 'flex', flexDirection: 'row' }}>
        <SidebarLayoutAdmin
          collapsed={collapsed}
          setCollapsed={setCollapsed} />
        <MainLayoutAdmin  />
      </Layout>
      <Footer style={{ textAlign: 'center' }}>Safe Ride</Footer>
    </Layout>
  );
};

export default LayoutAdmin;