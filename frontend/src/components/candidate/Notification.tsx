import React from 'react';
import { List, Typography, Empty } from 'antd';
import '../../assets/styles/Noti.css';

interface NotificationProps {
  notifications: Array<{
    id: string;
    title: string;
    content: string;
    time: string;
    isRead: boolean;
  }>;
  onNotificationClick?: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ notifications, onNotificationClick }) => {
  return (
    <List
      className="notification-dropdown"
      itemLayout="horizontal"
      dataSource={notifications}
      locale={{ emptyText: <Empty description="Không có thông báo nào" /> }}
      renderItem={(item) => (
        <List.Item 
          className="notification-item"
          onClick={() => onNotificationClick?.(item.id)}
          style={{ backgroundColor: item.isRead ? 'white' : '#f0f8ff' }}
        >
          <div className="notification-content">
            <Typography.Text className="notification-title">
              {item.title}
            </Typography.Text>
            <div>{item.content}</div>
            <Typography.Text className="notification-time">
              {item.time}
            </Typography.Text>
          </div>
        </List.Item>
      )}
    />
  );
};

export default Notification;
