import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import './Login.css';
import logoImage from '../../assets/images/logo.png';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    return (
        <div className="login-container">
            <Row className="login-wrapper">
                <Col xs={24} md={12} className="login-left">
                    <div className="login-content">
                        <img src={logoImage} alt="Tìm việc" className="login-image circle-logo" />
                        <Title level={1}>Welcome</Title>
                        <Text className="subtitle">Tìm công việc mơ ước của bạn với JobFinder</Text>
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <Card className="login-card">
                        <Title level={2} className="card-title">Đăng nhập</Title>
                        <Text className="card-subtitle">Vui lòng đăng nhập vào tài khoản của bạn</Text>

                        <Form
                            name="login"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Địa chỉ email"
                                    className="login-input"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Mật khẩu"
                                    className="login-input"
                                />
                            </Form.Item>

                            <Row justify="space-between" align="middle">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                </Form.Item>
                                <a href="/forgot-password" className="forgot-link">Quên mật khẩu?</a>
                            </Row>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block className="login-button">
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider plain>Hoặc đăng nhập với</Divider>

                            <div className="social-buttons">
                                <Button icon={<GoogleOutlined />} className="social-button">
                                    Google
                                </Button>
                                <Button icon={<LinkedinOutlined />} className="social-button">
                                    LinkedIn
                                </Button>
                            </div>

                            <div className="register-link">
                                <Text>Bạn chưa có tài khoản? </Text>
                                <a href="/register">Đăng ký ngay</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
