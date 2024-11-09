import React, { useState } from 'react';
import { Layout } from 'antd';
import {
    DashboardOutlined,
    UsergroupAddOutlined,
    TagsOutlined,
    AppstoreOutlined,
    BankOutlined,
} from '@ant-design/icons';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import '../layouts/AdminLayoutStyle.css';
import { colors } from '../config/theme';
const { Content, Sider } = Layout;

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Thống kê',
            path: '/admin/dashboard',
        },
        {
            key: 'users',
            icon: <UsergroupAddOutlined />,  // Changed: Better represents user management
            label: 'Quản lý người dùng',
            path: '/admin/users',
        },
        {
            key: 'levels',
            icon: <TagsOutlined />,  // Changed: Represents levels/tags
            label: 'Quản lý cấp bậc',
            path: '/admin/levels',
        },
        {
            key: 'job-category',
            icon: <AppstoreOutlined />,  // Changed: Better represents categories
            label: 'Quản lý danh mục',
            path: '/admin/job-category',
        },
        {
            key: 'companies',
            icon: <BankOutlined />,  // Changed: Better represents companies
            label: 'Quản lý công ty',
            path: '/admin/companies',
        },
    ];


    return (
        <Layout className="min-h-screen">
            <Header userType="admin" />
            <Layout>
                <Sider
                    width={250}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    theme="light"
                    className="admin-sider"
                >
                    <Sidebar menuItems={menuItems} />
                </Sider>
                <Layout className="site-layout">
                    <div style={{ background: colors.gradients.dark }} className="admin-welcome-banner">
                        <div className="welcome-content">
                            <h2>Chào mừng đến với Trang Quản trị</h2>
                            <p>Quản lý và điều hành hệ thống tuyển dụng của bạn tại đây</p>
                        </div>
                    </div>
                    <Content className="admin-content">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;