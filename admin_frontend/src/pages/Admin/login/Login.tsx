import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import './Login.css';
import logoImage from '../../../assets/images/logo.png';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const { login } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const onFinish = async (values: any) => {
        console.log('Success:', values);

        const data = {
            email: values.email,
            password: values.password,
        };

        const response = await login(data);
        console.log(response);

        if (response.success) {
            messageApi.open({
                type: 'success',
                content: 'Đăng nhập thành công!',
            });
            navigate('/admin/dashboard'); // Navigate to home page
        } else {
            messageApi.open({
                type: 'error',
                content: 'Đăng nhập thất bại!',
            });
        }
    };


    return (
        <div className="login-container">
            {contextHolder}
            <Row className="login-wrapper">
                <Col xs={24} md={12} className="login-left">
                    <div className="login-content">
                        <img src={logoImage} alt="Tìm việc" className="login-image circle-logo" />
                        <Title level={1}>Welcome</Title>
                        <Text className="subtitle">Dashboard Admin</Text>
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

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block className="login-button">
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
