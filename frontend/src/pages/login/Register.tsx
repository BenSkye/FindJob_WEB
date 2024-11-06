import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Row, Col, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import logoImage from '../../assets/images/logo.png';
import './Register.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    return (
        <div className="register-container">
            <Row className="register-wrapper">
                <Col xs={24} md={12} className="register-left">
                    <div className="register-content">
                        <img src={logoImage} alt="Job Search" className="circle-logo" />
                        <Title level={1}>Join JobFinder</Title>
                        <Text className="subtitle">Create an account and get access to thousands of job opportunities</Text>
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <Card className="register-card">
                        <Title level={2} className="card-title">Create Account</Title>
                        <Text className="card-subtitle">Fill in your details to get started</Text>

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
                                        rules={[{ required: true, message: 'Please enter your first name' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="First Name"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="lastName"
                                        rules={[{ required: true, message: 'Please enter your last name' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Last Name"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email address"
                                />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                rules={[{ required: true, message: 'Please enter your phone number' }]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Phone number"
                                />
                            </Form.Item>

                            <Form.Item
                                name="userType"
                                rules={[{ required: true, message: 'Please select user type' }]}
                            >
                                <Select placeholder="I am a...">
                                    <Option value="jobseeker">Job Seeker</Option>
                                    <Option value="employer">Employer</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please enter your password' },
                                    { min: 6, message: 'Password must be at least 6 characters' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please confirm your password' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Passwords do not match'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm Password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block className="register-button">
                                    Create Account
                                </Button>
                            </Form.Item>

                            <Divider plain>Or register with</Divider>

                            <div className="social-buttons">
                                <Button icon={<GoogleOutlined />} className="social-button">
                                    Google
                                </Button>
                                <Button icon={<LinkedinOutlined />} className="social-button">
                                    LinkedIn
                                </Button>
                            </div>

                            <div className="login-link">
                                <Text>Already have an account? </Text>
                                <a href="/login">Sign in</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Register;
