import React, { useState } from 'react';
import { Layout } from 'antd';
import {
    DashboardOutlined,
    FileAddOutlined,
    TeamOutlined,
    SettingOutlined,
    ProfileOutlined,
    AntDesignOutlined,
    FileOutlined, DollarOutlined
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
            label: 'Thống kê',
            path: '/employer/dashboard',
        },
        {
            key: 'post-job',
            icon: <FileAddOutlined />,
            label: 'Đăng tin tuyển dụng',
            path: '/employer/post-job',
        },


        {
            key: 'editprofile',
            icon: <ProfileOutlined />,
            label: 'Thông tin công ty',
            path: '/employer/editprofile',
        },
        // {
        //     key: 'employerprofile',
        //     icon: <AntDesignOutlined />,
        //     label: 'Employer Profile',
        //     path: '/employer/employerprofile',
        // },
        // {
        //     key: 'managejobs',
        //     icon: <SettingOutlined />,
        //     label: 'Quản lý bài đăng',
        //     path: '/employer/managejobs',
        // },
        {
            key: 'personal-job',
            icon: <FileOutlined />,
            label: 'Quản lý bài đăng',
            path: '/employer/personal-job',
        },
        {
            key: 'payment',
            icon: <DollarOutlined />,
            label: 'Các thanh toán',
            path: '/employer/payment',
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