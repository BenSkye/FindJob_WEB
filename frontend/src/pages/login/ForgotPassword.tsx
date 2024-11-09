import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { forgotPassword } from '../../services/api/authenService';
import './Login.css';
import logoImage from '../../assets/images/logo.png';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string }) => {
        try {
            setLoading(true);
            const response = await forgotPassword({ email: values.email });

            if (response.status === 200) {
                message.success('Link đặt lại mật khẩu đã được gửi đến email của bạn!');
            } else {
                message.error(response.message || 'Có lỗi xảy ra!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi gửi yêu cầu!');
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
                            Quên mật khẩu
                        </Title>
                        <Text className="subtitle">
                            Nhập email của bạn để nhận link đặt lại mật khẩu
                        </Text>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Card className="login-card">
                        <Title level={2} className="card-title">Quên mật khẩu</Title>
                        <Text className="card-subtitle">
                            Nhập email đã đăng ký để nhận link đặt lại mật khẩu
                        </Text>

                        <Form
                            name="forgot_password"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
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
                                    Gửi yêu cầu
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

export default ForgotPassword; 