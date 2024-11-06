import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    path: string;
}

interface SidebarProps {
    menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({
                key: item.path,
                icon: item.icon,
                label: item.label,
                onClick: () => navigate(item.path)
            }))}
        />
    );
};

export default Sidebar;