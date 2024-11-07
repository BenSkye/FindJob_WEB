import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './ProfilePage.css';
import { User } from '../../services/types/user.types'; // Import User interface

const { Title } = Typography;

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<Partial<User> | null>(null); // Use Partial<User> to allow optional fields
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        // Fetch user data from localStorage or API
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const showNotification = (type: 'success' | 'error', message: string, description: string) => {
        api[type]({
            message: message,
            description: description,
            placement: 'top',
            duration: 3,
        });
    };

    const onFinish = async (values: Partial<User>) => {
        setLoading(true);
        try {
            // Simulate API call to update user profile
            console.log('Updated Profile:', values);
            localStorage.setItem('user', JSON.stringify(values));
            setUser(values);

            showNotification('success', 'Cập nhật thành công!', 'Thông tin cá nhân đã được cập nhật.');
        } catch (error) {
            console.error('Profile Update Error:', error);
            showNotification('error', 'Cập nhật thất bại', 'Có lỗi xảy ra khi cập nhật thông tin cá nhân.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            {contextHolder}
            <Card className="profile-card">
                <Title level={2}>Thông tin cá nhân</Title>
                <Form
                    name="profile"
                    initialValues={user || {}}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" disabled />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ProfilePage; 