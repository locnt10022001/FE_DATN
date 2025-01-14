import { LaptopOutlined, MobileOutlined, MessageOutlined, UserOutlined, UnorderedListOutlined, ShoppingCartOutlined, TagsOutlined, InfoOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const items: MenuProps['items'] = [
  getItem(<Link to="/admin">Dashboard</Link>, '/admin/dashboard', <HomeOutlined />),
  getItem('Đơn hàng', 'Đơn hàng', <ShoppingCartOutlined />, [
    getItem(<Link to="/admin/order/bill">Quản lý đơn hàng</Link>, '/admin/order/bill'),
    getItem(<Link to="/admin/order/onlinebill">Quản lý đơn hàng online</Link>, '/admin/order/onlinebill'),
  ]),
  getItem(<Link to="/admin/products">Sản phẩm</Link>, '/admin/products', <MobileOutlined />),
  getItem('Voucher và khuyến mãi', 'Voucher và khuyến mãi', <LaptopOutlined />, [
    getItem(<Link to="/admin/vouchers">Quản lý voucher </Link>, '/admin/vouchers'),
    getItem(<Link to="/admin/promotions">Quản lý khuyến mãi</Link>, '/admin/promotions'),
  ]),
  getItem('Phân loại', 'Phân Loại', <TagsOutlined />, [
    getItem(<Link to="/admin/brands">Quản lý thương hiệu</Link>, '/admin/brands'),
    getItem(<Link to="/admin/colors">Quản lý màu sắc</Link>, '/admin/colors'),
    getItem(<Link to="/admin/categorys">Quản lý loại mũ</Link>, '/admin/categorys'),
  ]),
  // getItem('Khuyến mãi', 'Khuyến mãi', <MessageOutlined />, [
  //   getItem(<Link to="/admin/comments">Quản lý khuyến mãi</Link>, '/admin/comments'),
  // ]),
  getItem(<Link to="/admin/accounts">Tài khoản</Link>, '/admin/accounts', <UserOutlined />),
];
