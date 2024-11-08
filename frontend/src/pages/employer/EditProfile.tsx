import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Upload,
    Typography,
    Row,
    Col,
    message,
    Divider,
    Select,
    Spin
} from 'antd';
import {
    UploadOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { companyApi } from '../../services/api/company';
import { Company, CompanyUpdateDto } from '../../services/types/company.types';
import type { RcFile, UploadProps } from 'antd/es/upload';
import './EditProfile.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProfile: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [fileList, setFileList] = useState<any[]>([]);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            if (!id) return;
            const company = await companyApi.getCompanyById(id);
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
                taxNumber: company.taxNumber
            });

            if (company.logo) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'company-logo.png',
                        status: 'done',
                        url: company.logo,
                    }
                ]);
            }
        } catch (error: any) {
            message.error('Failed to fetch company data');
        } finally {
            setInitialLoading(false);
        }
    };

    const onFinish = async (values: CompanyUpdateDto) => {
        try {
            if (!id) return;
            setLoading(true);

            let logoUrl = fileList[0]?.url;
            if (fileList[0]?.originFileObj) {
                logoUrl = await companyApi.uploadLogo(id, fileList[0].originFileObj);
            }

            const updateData: CompanyUpdateDto = {
                ...values,
                logo: logoUrl
            };

            await companyApi.updateCompany(id, updateData);
            message.success('Company profile updated successfully');
        } catch (error: any) {
            message.error('Failed to update company profile');
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
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
                >
                    <Row gutter={24}>
                        <Col span={24} className="upload-section">
                            <Form.Item label="Logo công ty">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    maxCount={1}
                                >
                                    {fileList.length === 0 && (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
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

                        {/* Add more form fields based on the Company interface */}
                        {/* Social Media Links */}
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