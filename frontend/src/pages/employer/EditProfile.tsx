import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Row,
    Col,
    message,
    Divider,
    Select,
    Spin,
    Image
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined
} from '@ant-design/icons';
import { companyApi } from '../../services/api/company';
import { Company, CompanyUpdateDto } from '../../services/types/company.types';
import './EditProfile.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProfile: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [companyData, setCompanyData] = useState<Company | null>(null);

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            const company = await companyApi.getPersonalCompany();
            setCompanyData(company);
            setLogoUrl(company.logo || '');

            // Set form values
            form.setFieldsValue({
                name: company.name,
                email: company.email,
                phone: company.phone,
                address: company.address,
                website: company.website,
                companySize: company.companySize,
                description: company.description,
                facebook: company.facebook,
                linkedin: company.linkedin,
                twitter: company.twitter,
                taxNumber: company.taxNumber,
                logo: company.logo
            });

        } catch (error: any) {
            message.error('Không thể tải thông tin công ty');
        } finally {
            setInitialLoading(false);
        }
    };

    const onFinish = async (values: CompanyUpdateDto) => {
        try {
            if (!companyData?._id) return;
            setLoading(true);

            const updateData: CompanyUpdateDto = {
                ...values,
                logo: values.logo || logoUrl
            };

            await companyApi.updateCompany(companyData._id, updateData);
            message.success('Cập nhật thông tin công ty thành công');
            await fetchCompanyData();
        } catch (error: any) {
            message.error('Cập nhật thông tin thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="edit-profile-container">
            <Card className="edit-profile-card">
                <Title level={2}>Chỉnh sửa thông tin công ty</Title>
                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="edit-profile-form"
                    initialValues={companyData || {}}
                >
                    <Row gutter={24}>
                        <Col span={24} className="logo-section">
                            {logoUrl && (
                                <div className="current-logo">
                                    <Image
                                        src={logoUrl}
                                        alt="Company Logo"
                                        width={200}
                                        className="logo-preview"
                                    />
                                </div>
                            )}
                            <Form.Item
                                name="logo"
                                label="Logo URL công ty"
                                help="Nhập URL hình ảnh logo công ty"
                            >
                                <Input
                                    placeholder="https://example.com/logo.png"
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="name"
                                label="Tên công ty"
                                rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                            >
                                <Input prefix={<BankOutlined />} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input prefix={<MailOutlined />} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item name="facebook" label="Facebook">
                                <Input prefix={<FacebookOutlined />} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item name="linkedin" label="LinkedIn">
                                <Input prefix={<LinkedinOutlined />} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item name="twitter" label="Twitter">
                                <Input prefix={<TwitterOutlined />} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item name="taxNumber" label="Mã số thuế">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="companySize"
                                label="Quy mô công ty"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Option value="1-10">1-10 nhân viên</Option>
                                    <Option value="11-50">11-50 nhân viên</Option>
                                    <Option value="51-200">51-200 nhân viên</Option>
                                    <Option value="201-500">201-500 nhân viên</Option>
                                    <Option value="500+">Trên 500 nhân viên</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Giới thiệu công ty"
                                rules={[{ required: true }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Cập nhật thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditProfile; 