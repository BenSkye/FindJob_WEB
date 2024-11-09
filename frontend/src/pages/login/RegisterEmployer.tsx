import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, notification, AutoComplete, message } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
} from '@ant-design/icons';
import './Login.css';
import logoImage from '../../assets/images/logo.png';
import { signupEmployer } from '../../services/api/authenService';
import { getListCompany } from '../../services/api/company';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface CompanyOption {
    value: string;
    label: string;
}

const RegisterEmployer: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await getListCompany();
                if (response.status === 200) {
                    // Không cần lưu companies nữa, chỉ cần set options
                    setCompanyOptions(response.metadata.map(company => ({
                        value: company.name,
                        label: company.name
                    })));
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    const showNotification = (
        type: 'success' | 'error',
        message: string,
        description: string,
        duration: number = 3
    ) => {
        api[type]({
            message,
            description,
            placement: 'top',
            duration,
            style: { marginTop: '0px' }
        });
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const registerData = {
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                password: values.password,
                phone: values.phone,
                address: values.address,
                companyName: values.companyName
            };

            const response = await signupEmployer(registerData);

            console.log('response:', response);

            // Kiểm tra response có status error và code 400
            if (response?.status === 'error' && response?.code === 400) {
                showNotification('error', 'Đăng ký thất bại', response.message);
                return;
            }

            if (response?.status === 201) {
                if (response.metadata?.tokens) {
                    localStorage.setItem('accessToken', response.metadata.tokens.accessToken);
                    localStorage.setItem('user', JSON.stringify(response.metadata.user));
                }

                showNotification(
                    'success',
                    'Đăng ký thành công!',
                    'Vui lòng kiểm tra email để xác thực tài khoản của bạn.'
                );

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                throw new Error(response?.data?.message || 'Đăng ký thất bại');
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Có lỗi xảy ra trong quá trình đăng ký!';
            showNotification('error', 'Đăng ký thất bại', errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
        return Promise.resolve();
    };

    return (
        <>
            {contextHolder}
            <div className="login-container">
                <Row className="login-wrapper">
                    <Col xs={24} md={12} className="login-left">
                        <div className="login-content">
                            <img src={logoImage} alt="Job Search" className="login-image circle-logo" />
                            <Title level={1}>Welcome Employer</Title>
                            <Text className="subtitle">Tìm kiếm ứng viên tiềm năng với JobFinder</Text>
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="login-card">
                            <Title level={2} className="card-title">Đăng Ký Nhà Tuyển Dụng</Title>
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
                                    name="address"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập địa chỉ của bạn' },
                                        { max: 200, message: 'Địa chỉ không được quá 200 ký tự' }
                                    ]}
                                >
                                    <Input.TextArea
                                        placeholder="Địa chỉ của bạn"
                                        className="login-input"
                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="companyName"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                                >
                                    <AutoComplete
                                        options={companyOptions}
                                        // placeholder="Nhập tên công ty"
                                        filterOption={(inputValue, option) =>
                                            option?.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                                        }
                                        style={{ width: '100%' }}
                                    >
                                        <Input
                                            prefix={<BankOutlined />}
                                            placeholder="Nhập hoặc tìm kiếm tên công ty"
                                            className="login-input"
                                        />
                                    </AutoComplete>
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

export default RegisterEmployer;