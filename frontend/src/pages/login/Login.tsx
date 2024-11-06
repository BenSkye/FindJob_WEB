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
                        <img src={logoImage} alt="Job Search" className="login-image circle-logo" />
                        <Title level={1}>Welcome Back</Title>
                        <Text className="subtitle">Find your dream job with JobFinder</Text>

                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <Card className="login-card">
                        <Title level={2} className="card-title">Sign In</Title>
                        <Text className="card-subtitle">Please login to your account</Text>

                        <Form
                            name="login"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Email address"
                                    className="login-input"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please enter your password' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                    className="login-input"
                                />
                            </Form.Item>

                            <Row justify="space-between" align="middle">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
                            </Row>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block className="login-button">
                                    Sign In
                                </Button>
                            </Form.Item>

                            <Divider plain>Or continue with</Divider>

                            <div className="social-buttons">
                                <Button icon={<GoogleOutlined />} className="social-button">
                                    Google
                                </Button>
                                <Button icon={<LinkedinOutlined />} className="social-button">
                                    LinkedIn
                                </Button>
                            </div>

                            <div className="register-link">
                                <Text>Don't have an account? </Text>
                                <a href="/register">Sign up now</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
