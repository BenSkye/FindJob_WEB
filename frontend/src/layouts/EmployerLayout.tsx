import React, { useState } from 'react';
import { Layout } from 'antd';
import {
    DashboardOutlined,
    FileAddOutlined,
    TeamOutlined,
    SettingOutlined,
    ProfileOutlined,
    AntDesignOutlined
} from '@ant-design/icons';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { Outlet } from 'react-router-dom';

const { Content, Sider } = Layout;

const EmployerLayout: React.FC = () => {
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
            label: 'Post Job',
            path: '/employer/post-job',
        },
        {
            key: 'applications',
            icon: <TeamOutlined />,
            label: 'Manage Applications',
            path: '/employer/applications',
        },
        {
            key: 'editprofile',
            icon: <ProfileOutlined />,
            label: 'Edit Profile',
            path: '/employer/editprofile',
        },
        {
            key: 'employerprofile',
            icon: <AntDesignOutlined />,
            label: 'Employer Profile',
            path: '/employer/employerprofile',
        },
        {
            key: 'managejobs',
            icon: <SettingOutlined />,
            label: 'ManageJobs',
            path: '/employer/managejobs',
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
                    <Content className="bg-white p-6 rounded-lg">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default EmployerLayout;