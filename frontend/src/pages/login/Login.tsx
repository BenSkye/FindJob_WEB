import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, Row, Col, notification } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';
import logoImage from '../../assets/images/logo.png';
import { login, googleSignUp } from '../../services/api/authenService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const showNotification = (type: 'success' | 'error', message: string, description: string) => {
        api[type]({
            message: message,
            description: description,
            placement: 'top',
            duration: 3,
            style: {
                marginTop: '20px'
            }
        });
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            console.log('Google Response:', credentialResponse);

            if (!credentialResponse.credential) {
                throw new Error('Không nhận được thông tin xác thực từ Google');
            }

            const response = await googleSignUp({
                credential: credentialResponse.credential
            });

            console.log('API Response:', response);

            if (response.status === 200) {
                const userData = response.data.metadata.user;
                localStorage.setItem('accessToken', response.data.metadata.tokens.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    avatar: userData.avatar,
                    role: userData.roles[0]
                }));

                showNotification(
                    'success',
                    'Đăng nhập Google thành công!',
                    'Chào mừng bạn đến với JobFinder!'
                );
                navigate('/');
            }
        } catch (error: any) {
            console.error('Google Sign In Error:', error);
            showNotification(
                'error',
                'Đăng nhập Google thất bại',
                error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đăng nhập với Google!'
            );
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign In Error');
        showNotification(
            'error',
            'Đăng nhập Google thất bại',
            'Có lỗi xảy ra trong quá trình xác thực với Google'
        );
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await login(values.email, values.password);
            console.log('Login Response:', response);

            if (response.status === 200) {
                const userData = response.metadata.user;
                localStorage.setItem('accessToken', response.metadata.tokens.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    avatar: userData.avatar,
                    role: userData.roles[0]
                }));

                showNotification(
                    'success',
                    'Đăng nhập thành công!',
                    'Chào mừng bạn đã quay trở lại!'
                );

                // Điều hướng dựa vào role
                if (userData.roles.includes('admin')) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            showNotification(
                'error',
                'Đăng nhập thất bại',
                'Email hoặc mật khẩu không chính xác. Vui lòng thử lại!'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
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
                                    <Button type="primary" htmlType="submit" block className="login-button" loading={loading}>
                                        Đăng nhập
                                    </Button>
                                </Form.Item>

                                <Divider plain>Hoặc đăng nhập với</Divider>

                                <div className="social-buttons">
                                    <div className="google-login-button">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            useOneTap
                                            theme="filled_blue"
                                            size="large"
                                            text="signin_with"
                                            shape="rectangular"
                                            locale="vi"
                                        />
                                    </div>
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
        </>
    );
};

export default Login;
