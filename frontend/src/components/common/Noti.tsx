import React from 'react';
import { Menu, Badge, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import type Notification from "../../services/types/notification";
import '../../assets/styles/Noti.css';

interface NotiProps {
    notifications: Notification[];
}

const Noti: React.FC<NotiProps> = ({ notifications }) => {
    const notificationMenu = (
        <Menu className="notification-menu">
            <div className="notification-header">
                <h3>Thông báo</h3>
                {notifications.length > 0 && (
                    <span className="notification-count">{notifications.length} mới</span>
                )}
            </div>
            <div className="notification-list">
                {notifications.length ? (
                    notifications.map(notification => (
                        <Menu.Item key={notification._id} className="notification-item">
                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.content}</p>
                                <span className="notification-time">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Menu.Item>
                    ))
                ) : (
                    <Menu.Item className="notification-empty">
                        Không có thông báo mới
                    </Menu.Item>
                )}
            </div>
        </Menu>
    );

    return (
        <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
            <Badge count={notifications.length} offset={[10, 0]} className="notification-badge">
                <BellOutlined className="notification-bell" />
            </Badge>
        </Dropdown>
    );
};

export default Noti;
