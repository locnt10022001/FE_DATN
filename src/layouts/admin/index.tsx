import { Layout } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom'
import HeaderLayoutAdmin from './components/header';
import SidebarLayoutAdmin from './components/sidebar';
import MainLayoutAdmin from './components/main';
const { Footer } = Layout;
const LayoutAdmin: React.FC = () => {
  const navigate = useNavigate()
  const Logout = () => {
    localStorage.clear()
    window.location.reload()
  }
  const user: any = localStorage.getItem("user")
  const parseUser = JSON.parse(user);
  if (parseUser) {
    parseUser.role === 'Admin' ? console.log('ok') : navigate('/signin')
  } else {
    navigate('/signin')
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderLayoutAdmin />
      <Layout>
        <SidebarLayoutAdmin />
        <MainLayoutAdmin />
      </Layout>
      <Footer style={{ textAlign: 'center' }}>Safe Ride</Footer>
    </Layout>
  );
};

export default LayoutAdmin;