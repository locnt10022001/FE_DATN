import {
  LaptopOutlined,
  MobileOutlined,
  MessageOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  InfoOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons';

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
  getItem('sản phẩm', 'Sản phẩm', <MobileOutlined />, [
    getItem(<Link to="/admin/products">Danh sách sản phẩm</Link>, '/admin/products'),
  ]),
  getItem('Danh mục', 'Danh mục', <LaptopOutlined />, [
    getItem(<Link to="/admin/categories">Danh sách danh mục</Link>, '/admin/categories'),
  ]),
  getItem('hash tags', 'Phân Loại', <TagsOutlined />, [
    getItem(<Link to="/admin/hashtags">Quản lý phân loại</Link>, '/admin/hashtags'),
  ]),
  getItem('bình luận', 'bình luận', <MessageOutlined />, [
    getItem(<Link to="/admin/comments">Quản lý khuyến mãi</Link>, '/admin/comments'),
  ]),
  getItem('Tài khoản', 'Tài khoản', <UserOutlined />, [
    getItem(<Link to="/admin/accounts">Quản lý tài khoản</Link>, '/admin/accounts'),
  ]),

];
