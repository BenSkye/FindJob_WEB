import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { resetPassword } from '../../services/api/authenService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';
import logoImage from '../../assets/images/logo.png';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const onFinish = async (values: { newPassword: string }) => {
        if (!token) {
            message.error('Token không hợp lệ!');
            return;
        }

        try {
            setLoading(true);
            const response = await resetPassword(token, values.newPassword);

            if (response.status === 200) {
                message.success('Đặt lại mật khẩu thành công!');

            } else {
                message.error(response.message || 'Có lỗi xảy ra!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi đặt lại mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Row className="login-wrapper">
                <Col xs={24} sm={24} md={12} lg={12} className="login-left">
                    <div className="login-content">
                        <img src={logoImage} alt="Logo" className="circle-logo" />
                        <Title level={2} style={{ color: 'white', marginTop: '20px' }}>
                            Đặt lại mật khẩu
                        </Title>
                        <Text className="subtitle">
                            Nhập mật khẩu mới của bạn
                        </Text>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Card className="login-card">
                        <Title level={2} className="card-title">Đặt lại mật khẩu</Title>
                        <Text className="card-subtitle">
                            Vui lòng nhập mật khẩu mới của bạn
                        </Text>

                        <Form
                            name="reset_password"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Mật khẩu mới"
                                    className="login-input"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Xác nhận mật khẩu"
                                    className="login-input"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-button"
                                    loading={loading}
                                    block
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>

                            <div className="register-link">
                                <Text>Quay lại trang </Text>
                                <a href="/login">Đăng nhập</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ResetPassword; 