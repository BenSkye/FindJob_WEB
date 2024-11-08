import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Divider, Spin, message, Image } from 'antd';
import {
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    BankOutlined,
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../../services/api/company';
import { Company } from '../../services/types/company.types';
import './EmployerProfile.css';

const { Title, Text, Paragraph } = Typography;

const EmployerProfile: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [companyData, setCompanyData] = useState<Company | null>(null);

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            const data = await companyApi.getPersonalCompany();
            setCompanyData(data);
        } catch (error) {
            message.error('Không thể tải thông tin công ty');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!companyData) {
        return (
            <div className="error-container">
                <Text type="danger">Không tìm thấy thông tin công ty</Text>
            </div>
        );
    }

    return (
        <div className="employer-profile-container">
            <Row gutter={[24, 24]}>
                {/* Left Column */}
                <Col xs={24} lg={8}>
                    {/* Company Logo Card */}
                    <Card className="profile-card">
                        <div className="logo-section">
                            {companyData.logo ? (
                                <Image
                                    src={companyData.logo}
                                    alt={companyData.name}
                                    className="company-logo"
                                    fallback="/default-company-logo.png"
                                />
                            ) : (
                                <div className="company-logo-placeholder">
                                    <BankOutlined />
                                </div>
                            )}
                        </div>
                        <Divider />
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            block
                            onClick={() => navigate('/employer/edit-profile')}
                        >
                            Chỉnh sửa thông tin
                        </Button>
                    </Card>

                    {/* Contact Information Card */}
                    <Card className="profile-card" title="Thông tin liên hệ">
                        {companyData.email && (
                            <div className="contact-item">
                                <MailOutlined />
                                <Text copyable>{companyData.email}</Text>
                            </div>
                        )}
                        {companyData.phone && (
                            <div className="contact-item">
                                <PhoneOutlined />
                                <Text copyable>{companyData.phone}</Text>
                            </div>
                        )}
                        {companyData.website && (
                            <div className="contact-item">
                                <GlobalOutlined />
                                <a href={companyData.website} target="_blank" rel="noopener noreferrer">
                                    {companyData.website}
                                </a>
                            </div>
                        )}
                        {companyData.address && (
                            <div className="contact-item">
                                <EnvironmentOutlined />
                                <Text>{companyData.address}</Text>
                            </div>
                        )}
                    </Card>

                    {/* Social Media Card */}
                    {(companyData.facebook || companyData.linkedin || companyData.twitter) && (
                        <Card className="profile-card" title="Mạng xã hội">
                            {companyData.facebook && (
                                <div className="social-item">
                                    <FacebookOutlined />
                                    <a href={companyData.facebook} target="_blank" rel="noopener noreferrer">
                                        Facebook
                                    </a>
                                </div>
                            )}
                            {companyData.linkedin && (
                                <div className="social-item">
                                    <LinkedinOutlined />
                                    <a href={companyData.linkedin} target="_blank" rel="noopener noreferrer">
                                        LinkedIn
                                    </a>
                                </div>
                            )}
                            {companyData.twitter && (
                                <div className="social-item">
                                    <TwitterOutlined />
                                    <a href={companyData.twitter} target="_blank" rel="noopener noreferrer">
                                        Twitter
                                    </a>
                                </div>
                            )}
                        </Card>
                    )}
                </Col>

                {/* Right Column */}
                <Col xs={24} lg={16}>
                    {/* Company Overview Card */}
                    <Card className="profile-card">
                        <Title level={2}>{companyData.name}</Title>
                        <Tag color="blue" icon={<TeamOutlined />} className="company-size-tag">
                            {companyData.companySize || 'Chưa cập nhật quy mô'}
                        </Tag>

                        {companyData.taxNumber && (
                            <div className="tax-info">
                                <Text type="secondary">Mã số thuế: </Text>
                                <Text copyable>{companyData.taxNumber}</Text>
                            </div>
                        )}
                    </Card>

                    {/* Company Description Card */}
                    <Card className="profile-card" title="Giới thiệu công ty">
                        <Paragraph>
                            {companyData.description || 'Chưa có thông tin giới thiệu về công ty'}
                        </Paragraph>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EmployerProfile;        