import { useState, useEffect } from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
  link?: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Fetch notifications from API
    // This is just a mock example
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        title: 'Ứng viên mới',
        message: 'Có một ứng viên mới đã ứng tuyển vào vị trí của bạn',
        type: 'info',
        time: '5 phút trước',
        read: false,
      },
      {
        id: '2',
        title: 'Thanh toán thành công',
        message: 'Bạn đã thanh toán thành công gói dịch vụ Premium',
        type: 'success',
        time: '1 giờ trước',
        read: false,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearAll,
  };
};