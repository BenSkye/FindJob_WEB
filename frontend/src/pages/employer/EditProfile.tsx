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
    Image,
    Upload
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    UploadOutlined,
    BankOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined
} from '@ant-design/icons';
import { companyApi } from '../../services/api/company';
import { Company, CompanyUpdateDto } from '../../services/types/company.types';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
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
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            const company = await companyApi.getPersonalCompany();
            setCompanyData(company);
            setLogoUrl(company.logo || '');

            // Set initial file list if logo exists
            if (company.logo) {
                setFileList([{
                    uid: '-1',
                    name: 'company-logo.png',
                    status: 'done',
                    url: company.logo,
                }]);
            }

            form.setFieldsValue({
                ...company,
                logo: company.logo
            });
        } catch (error: any) {
            message.error('Không thể tải thông tin công ty');
        } finally {
            setInitialLoading(false);
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên file hình ảnh!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
        }

        return isImage && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = async (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get uploaded file URL from response
            const uploadedUrl = info.file.response.url;
            setLogoUrl(uploadedUrl);
            form.setFieldValue('logo', uploadedUrl);
            setLoading(false);
        }

        setFileList(info.fileList.slice(-1)); // Only keep latest file
    };

    const customUploadRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Thay thế bằng API upload của bạn
            const response = await companyApi.uploadLogo(formData);

            if (response.url) {
                onSuccess(response);
            } else {
                onError(new Error('Upload failed'));
            }
        } catch (error) {
            onError(error);
        }
    };

    const onFinish = async (values: CompanyUpdateDto) => {
        try {
            if (!companyData?._id) return;
            setLoading(true);

            const updateData: CompanyUpdateDto = {
                ...values,
                logo: logoUrl
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
                            <Form.Item
                                name="logo"
                                label="Logo công ty"
                                help="Tải lên logo công ty (JPG, PNG < 2MB)"
                            >
                                <Upload
                                    name="logo"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={true}
                                    fileList={fileList}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    customRequest={customUploadRequest}
                                    maxCount={1}
                                >
                                    {fileList.length === 0 && (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Tải lên</div>
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