import React from 'react';
import { Badge, Dropdown, List, Avatar, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotification } from '../../hooks/useNotification';

const { Text, Link } = Typography;

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    time: string;
    read: boolean;
    link?: string;
}

const Notification: React.FC = () => {
    const { notifications, markAsRead, clearAll } = useNotification();
    const unreadCount = notifications.filter(item => !item.read).length;

    const getNotificationIcon = (type: string) => {
        const iconColors = {
            info: '#1890ff',
            success: '#52c41a',
            warning: '#faad14',
            error: '#f5222d',
        };

        return (
            <Avatar
                style={{ backgroundColor: iconColors[type as keyof typeof iconColors] }}
                size="small"
            />
        );
    };

    const NotificationList = (
        <div className="notification-dropdown" style={{ width: 360 }}>
            <div className="p-4 border-b flex justify-between items-center">
                <Text strong>Thông báo ({unreadCount})</Text>
                <Link onClick={clearAll}>Xóa tất cả</Link>
            </div>

            <List
                className="notification-list"
                itemLayout="horizontal"
                dataSource={notifications}
                style={{ maxHeight: '400px', overflow: 'auto' }}
                renderItem={(item: NotificationItem) => (
                    <List.Item
                        className={`cursor-pointer hover:bg-gray-50 ${!item.read ? 'bg-blue-50' : ''}`}
                        onClick={() => markAsRead(item.id)}
                    >
                        <List.Item.Meta
                            avatar={getNotificationIcon(item.type)}
                            title={
                                <div className="flex justify-between">
                                    <Text strong>{item.title}</Text>
                                    <Text type="secondary" className="text-xs">
                                        {item.time}
                                    </Text>
                                </div>
                            }
                            description={item.message}
                        />
                    </List.Item>
                )}
            />

            {notifications.length === 0 && (
                <div className="p-8 text-center">
                    <Text type="secondary">Không có thông báo mới</Text>
                </div>
            )}
        </div>
    );

    return (
        <Dropdown
            overlay={NotificationList}
            trigger={['click']}
            placement="bottomRight"
        >
            <div className="cursor-pointer">
                <Badge count={unreadCount} size="small">
                    <BellOutlined style={{ fontSize: '20px' }} />
                </Badge>
            </div>
        </Dropdown>
    );
};

export default Notification;