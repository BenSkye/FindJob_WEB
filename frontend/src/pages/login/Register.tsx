import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Row, Col, Select, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import './Login.css';
import logoImage from '../../assets/images/logo.png';
import { register } from '../../services/api/userApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { googleSignUp } from '../../services/api/userApi';
const { Title, Text } = Typography;
const { Option } = Select;

// Cập nhật interface cho đúng với backend
interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    address?: string;
}

const Register: React.FC = () => {
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
                marginTop: '50px'
            }
        });
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Tạo payload cho API theo đúng format backend yêu cầu
            const registerData = {
                name: `${values.firstName} ${values.lastName}`, // Ghép firstName và lastName
                email: values.email,
                password: values.password,
                phone: values.phone,
                role: values.userType === 'employer' ? 'employer' : 'candidate',
                address: '' // Có thể thêm trường address nếu cần
            };

            console.log('Register Data:', registerData);

            const response = await register(registerData);
            console.log('Register Response:', response);

            if (response.status === 200) {
                // Lưu token và thông tin user nếu có
                if (response.metadata?.tokens) {
                    localStorage.setItem('accessToken', response.metadata.tokens.accessToken);
                    localStorage.setItem('user', JSON.stringify(response.metadata.user));
                }

                showNotification(
                    'success',
                    'Đăng ký thành công!',
                    'Chào mừng bạn đến với JobFinder!'
                );
                navigate('/login');
            }
        } catch (error: any) {
            console.error('Register Error:', error);

            let errorMessage = 'Có lỗi xảy ra trong quá trình đăng ký!';
            if (error.response?.data?.message === 'Email already exists') {
                errorMessage = 'Email này đã được đăng ký!';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            showNotification(
                'error',
                'Đăng ký thất bại',
                errorMessage
            );
        } finally {
            setLoading(false);
        }
    };

    // Thêm validate cho form
    const validatePhone = (_: any, value: string) => {
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
        if (!value) {
            return Promise.reject('Vui lòng nhập số điện thoại');
        }
        if (!phoneRegex.test(value)) {
            return Promise.reject('Số điện thoại không hợp lệ');
        }
        return Promise.resolve();
    };

    const validatePassword = (_: any, value: string) => {
        if (!value) {
            return Promise.reject('Vui lòng nhập mật khẩu');
        }
        if (value.length < 6) {
            return Promise.reject('Mật khẩu phải có ít nhất 6 ký tự');
        }
        // Thêm các điều kiện khác nếu cần
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        return Promise.resolve();
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
                localStorage.setItem('accessToken', response.data.metadata.tokens.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.metadata.user));

                showNotification(
                    'success',
                    'Đăng ký Google thành công!',
                    'Chào mừng bạn đến với JobFinder!'
                );
                navigate('/');
            }
        } catch (error: any) {
            console.error('Google Sign Up Error:', error);

            showNotification(
                'error',
                'Đăng ký Google thất bại',
                error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đăng ký với Google!'
            );
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign In Error');
        showNotification(
            'error',
            'Đăng ký Google thất bại',
            'Có lỗi xảy ra trong quá trình xác thực với Google'
        );
    };

    return (
        <>
            {contextHolder}
            <div className="login-container">
                <Row className="login-wrapper">
                    <Col xs={24} md={12} className="login-left">
                        <div className="login-content">
                            <img src={logoImage} alt="Job Search" className="login-image circle-logo" />
                            <Title level={1}>Welcome</Title>
                            <Text className="subtitle">Tìm công việc mơ ước của bạn với JobFinder</Text>
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="login-card">
                            <Title level={2} className="card-title">Đăng Ký</Title>
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
                                                className="login-input"
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
                                                className="login-input"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email của bạn' },
                                        { type: 'email', message: 'Email không hợp lệ' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="Địa chỉ email"
                                        className="login-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    rules={[{ validator: validatePhone }]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="Số điện thoại"
                                        className="login-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="userType"
                                    rules={[{ required: true, message: 'Vui lòng chọn loại người dùng' }]}
                                >
                                    <Select placeholder="Tôi là..." className="login-input">
                                        <Option value="jobseeker">Người tìm việc</Option>
                                        <Option value="employer">Nhà tuyển dụng</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ validator: validatePassword }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Mật khẩu"
                                        className="login-input"
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
                                        className="login-input"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        className="login-button"
                                        loading={loading}
                                    >
                                        Tạo Tài Khoản
                                    </Button>
                                </Form.Item>

                                <Divider plain>Hoặc đăng ký với</Divider>

                                <div className="social-buttons">
                                    <div className="google-login-button">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            useOneTap
                                            theme="filled_blue"
                                            size="large"
                                            text="signup_with"
                                            shape="rectangular"
                                            locale="vi"
                                        />
                                    </div>
                                    <Button icon={<LinkedinOutlined />} className="social-button">
                                        LinkedIn
                                    </Button>
                                </div>

                                <div className="register-link">
                                    <Text>Bạn đã có tài khoản? </Text>
                                    <a href="/login">Đăng nhập ngay</a>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Register;
