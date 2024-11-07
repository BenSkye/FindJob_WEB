import React, { useState } from 'react';
import { Layout } from 'antd';
import {
    DashboardOutlined,
    FileAddOutlined,
    TeamOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import '../layouts/AdminLayoutStyle.css';
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
            key: 'post-job',
            icon: <FileAddOutlined />,
            label: 'Quản lý tin tuyển dụng',
            path: '/admin/post-job',
        },
        {
            key: 'users',
            icon: <TeamOutlined />,
            label: 'Quản lý người dùng',
            path: '/admin/users',
        },
        {
            key: 'levels',
            icon: <TeamOutlined />,
            label: 'Quản lý cấp bậc',
            path: '/admin/levels',
        },
        {
            key: 'job-category',
            icon: <TeamOutlined />,
            label: 'Quản lý danh mục',
            path: '/admin/job-category',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            path: '/admin/settings',
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
                    <div className="admin-welcome-banner">
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