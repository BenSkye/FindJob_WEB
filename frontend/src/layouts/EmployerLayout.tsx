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

interface EmployerLayoutProps {
    children: React.ReactNode;
}

const EmployerLayout: React.FC<EmployerLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            path: '/employer/dashboard',
        },
        {
            key: 'post-job',
            icon: <FileAddOutlined />,
            label: 'Đăng tin tuyển dụng',
            path: '/employer/post-job',
        },
        {
            key: 'applications',
            icon: <TeamOutlined />,
            label: 'Quản lý ứng viên',
            path: '/employer/applications',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            path: '/employer/settings',
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Header userType="employer" />
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
                        <h2>Dashboard</h2>
                        <Notification />
                    </div>
                    <Content className="bg-white p-6 rounded-lg">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default EmployerLayout;