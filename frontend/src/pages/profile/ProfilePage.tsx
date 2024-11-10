import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './ProfilePage.css';
import { User } from '../../services/types/user.types'; // Import User interface
import { getUserById, updateUserById } from '../../services/api/authenService';
import { useAuth } from '../../hooks/useAuth';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState<Partial<User> | null>(null);
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { user, setUser } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await getUserById();
                setUserInfo(response.metadata);
                form.setFieldsValue(response.metadata); // Cập nhật form với dữ liệu mới
            } catch (error) {
                showNotification('error', 'Lỗi', 'Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [form]);


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
            const response = await updateUserById(values);
            setUserInfo(response.metadata);
            form.setFieldsValue(response.metadata);
            showNotification('success', 'Thành công', 'Thông tin cá nhân đã được cập nhật');
        } catch (error) {
            showNotification('error', 'Thất bại', 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="profile-container">
            {contextHolder}
            <Card className="profile-card" loading={loading}>
                <Title level={2}>Thông tin cá nhân</Title>
                <Form
                    form={form}
                    name="profile"
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