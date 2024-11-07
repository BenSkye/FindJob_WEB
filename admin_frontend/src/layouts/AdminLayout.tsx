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
import Notification from '../components/common/Notification';

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
            key: 'leave-job',
            icon: <TeamOutlined />,
            label: 'Quản lý cấp bậc',
            path: '/admin/leave-job',
        },
        {
            key: 'job-category',
            icon: <TeamOutlined />,
            label: 'Quản lý danh mục tin tuyển dụng',
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
                >
                    <Sidebar menuItems={menuItems} />
                </Sider>
                <Layout className="p-6">
                    <div className="flex-between mb-4">

                    </div>
                    <Content className="bg-white p-6 rounded-lg">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;