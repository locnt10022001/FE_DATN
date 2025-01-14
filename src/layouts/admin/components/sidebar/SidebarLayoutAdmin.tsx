import { Layout, Menu } from 'antd';
import { items } from './SidebarRouterAdmin';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

interface SidebarLayoutAdminProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarLayoutAdmin: React.FC<SidebarLayoutAdminProps> = ({ collapsed, setCollapsed }) => {
  return (
    <Layout.Sider
      collapsible
      width={240}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      style={{ background: '#ffffff' }}
      trigger={collapsed ? (<MenuUnfoldOutlined style={{ fontSize: '20px' }} />) : (<MenuFoldOutlined style={{ fontSize: '20px' }} />)}
      collapsedWidth="80">
      <Menu
        mode="inline"inlineCollapsed
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['1']}
        className="select-none"
        items={items}
      />
    </Layout.Sider>
  );
};

export default SidebarLayoutAdmin;
