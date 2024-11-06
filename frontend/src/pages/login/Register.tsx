import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Row, Col, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import logoImage from '../../assets/images/logo.png';
import './Register.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Thành công:', values);
    };

    return (
        <div className="register-container">
            <Row className="register-wrapper">
                <Col xs={24} md={12} className="register-left">
                    <div className="register-content">
                        <img src={logoImage} alt="Job Search" className="circle-logo" />
                        <Title level={1}>Tham gia JobFinder</Title>
                        <Text className="subtitle">Tạo tài khoản và truy cập vào hàng ngàn cơ hội việc làm</Text>
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <Card className="register-card">
                        <Title level={2} className="card-title">Tạo Tài Khoản</Title>
                        <Text className="card-subtitle">Điền thông tin của bạn để bắt đầu</Text>

                        <Form
                            name="register"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="firstName"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên của bạn' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Tên"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="lastName"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ của bạn' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Họ"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email của bạn' },
                                    { type: 'email', message: 'Vui lòng nhập một email hợp lệ' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Địa chỉ email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn' }]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Số điện thoại"
                                />
                            </Form.Item>

                            <Form.Item
                                name="userType"
                                rules={[{ required: true, message: 'Vui lòng chọn loại người dùng' }]}
                            >
                                <Select placeholder="Tôi là...">
                                    <Option value="jobseeker">Người tìm việc</Option>
                                    <Option value="employer">Nhà tuyển dụng</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu của bạn' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Mật khẩu"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu của bạn' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Xác nhận mật khẩu"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block className="register-button">
                                    Tạo Tài Khoản
                                </Button>
                            </Form.Item>

                            <Divider plain>Hoặc đăng ký với</Divider>

                            <div className="social-buttons">
                                <Button icon={<GoogleOutlined />} className="social-button">
                                    Google
                                </Button>
                                <Button icon={<LinkedinOutlined />} className="social-button">
                                    LinkedIn
                                </Button>
                            </div>

                            <div className="login-link">
                                <Text>Bạn đã có tài khoản? </Text>
                                <a href="/login">Đăng nhập</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Register;
