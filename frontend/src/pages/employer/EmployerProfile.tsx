import React from 'react';
import { Card, Row, Col, Typography, Button, Statistic, Tag, Divider, List, Avatar } from 'antd';
import {
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    BankOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './EmployerProfile.css';

const { Title, Text, Paragraph } = Typography;

interface JobPost {
    id: string;
    title: string;
    location: string;
    type: string;
    postedDate: string;
    applications: number;
}

const EmployerProfile: React.FC = () => {
    const navigate = useNavigate();

    // Mock data - replace with actual API data
    const employerData = {
        companyName: 'Tech Solutions Inc.',
        logo: 'https://example.com/logo.png',
        email: 'contact@techsolutions.com',
        phone: '(+84) 123 456 789',
        website: 'www.techsolutions.com',
        address: 'District 1, Ho Chi Minh City, Vietnam',
        industry: 'Information Technology',
        companySize: '100-500 employees',
        description: `Tech Solutions Inc. is a leading technology company specializing in software development, 
            cloud computing, and digital transformation. With over 10 years of experience, we've helped 
            numerous businesses achieve their digital goals.`,
        statistics: {
            totalJobs: 25,
            activeJobs: 12,
            totalApplications: 150,
            hiredCandidates: 45
        },
        recentJobs: [
            {
                id: '1',
                title: 'Senior Software Engineer',
                location: 'Ho Chi Minh City',
                type: 'Full-time',
                postedDate: '2024-01-15',
                applications: 12
            },
            {
                id: '2',
                title: 'Product Manager',
                location: 'Ha Noi',
                type: 'Full-time',
                postedDate: '2024-01-10',
                applications: 8
            },
            {
                id: '3',
                title: 'UX/UI Designer',
                location: 'Da Nang',
                type: 'Contract',
                postedDate: '2024-01-05',
                applications: 15
            }
        ]
    };

    return (
        <div className="employer-profile-container">
            {/* Company Overview Card */}
            <Card className="profile-card main-info-card">
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <div className="company-logo-container">
                            <img
                                src={employerData.logo}
                                alt={employerData.companyName}
                                className="company-logo"
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={16} md={18}>
                        <div className="company-info">
                            <div className="company-header">
                                <Title level={2}>{employerData.companyName}</Title>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => navigate('/employer/edit-profile')}
                                >
                                    Chỉnh sửa thông tin
                                </Button>
                            </div>
                            <div className="company-details">
                                <Tag icon={<BankOutlined />} color="blue">{employerData.industry}</Tag>
                                <Tag icon={<TeamOutlined />} color="green">{employerData.companySize}</Tag>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Contact Information */}
            <Card className="profile-card">
                <Title level={4}>Thông tin liên hệ</Title>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                        <div className="contact-item">
                            <MailOutlined /> <Text>{employerData.email}</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div className="contact-item">
                            <PhoneOutlined /> <Text>{employerData.phone}</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div className="contact-item">
                            <GlobalOutlined /> <Text>{employerData.website}</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div className="contact-item">
                            <EnvironmentOutlined /> <Text>{employerData.address}</Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Statistics */}
            <Card className="profile-card">
                <Title level={4}>Thống kê</Title>
                <Row gutter={[24, 24]}>
                    <Col xs={12} sm={6}>
                        <Statistic title="Tổng số việc làm" value={employerData.statistics.totalJobs} />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic title="Việc làm đang tuyển" value={employerData.statistics.activeJobs} />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic title="Lượt ứng tuyển" value={employerData.statistics.totalApplications} />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic title="Đã tuyển dụng" value={employerData.statistics.hiredCandidates} />
                    </Col>
                </Row>
            </Card>

            {/* Company Description */}
            <Card className="profile-card">
                <Title level={4}>Giới thiệu công ty</Title>
                <Paragraph>{employerData.description}</Paragraph>
            </Card>

            {/* Recent Job Postings */}
            <Card className="profile-card">
                <Title level={4}>Việc làm gần đây</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={employerData.recentJobs}
                    renderItem={(job: JobPost) => (
                        <List.Item
                            actions={[
                                <Button type="link">{job.applications} ứng viên</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={job.title}
                                description={
                                    <>
                                        <Tag color="blue">{job.type}</Tag>
                                        <Tag color="green">{job.location}</Tag>
                                        <Text type="secondary">Đăng ngày: {job.postedDate}</Text>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default EmployerProfile; 