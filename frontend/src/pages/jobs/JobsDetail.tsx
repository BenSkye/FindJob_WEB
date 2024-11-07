import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    Typography,
    Tag,
    Row,
    Col,
    Button,
    Divider,
    Avatar,
    List,
    Space,
    message
} from 'antd';
import {
    EnvironmentOutlined,
    DollarOutlined,
    CalendarOutlined,
    UserOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    HeartOutlined,
    HeartFilled,
    ShareAltOutlined
} from '@ant-design/icons';
import './JobsDetail.css';
import { colors } from '../../config/theme';

const { Title, Paragraph, Text } = Typography;

interface JobDetail {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    experience: string;
    employmentType: string;
    deadline: string;
    positions: number;
    description: string;
    requirements: string[];
    benefits: string[];
    skills: string[];
    companyLogo: string;
}

const JobsDetail: React.FC = () => {
    const { id } = useParams();
    const [job, setJob] = useState<JobDetail | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setJob({
                id: '1',
                title: 'Senior Frontend Developer',
                company: 'Tech Solutions Inc.',
                location: 'TP.HCM',
                salary: '$1500 - $3000',
                experience: '3-5 years',
                employmentType: 'Full-time',
                deadline: '31/12/2023',
                positions: 2,
                description: 'Detailed job description goes here...',
                requirements: [
                    '5+ years of experience with React',
                    'Strong knowledge of TypeScript',
                    'Experience with state management',
                ],
                benefits: [
                    'Competitive salary',
                    'Health insurance',
                    'Flexible working hours',
                ],
                skills: ['React', 'TypeScript', 'Redux'],
                companyLogo: 'https://example.com/logo.png',
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleApply = () => {
        message.success('Applied successfully!');
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        message.info(isSaved ? 'Job removed from saved list' : 'Job saved');
    };

    const handleShare = () => {
        message.info('Share functionality not implemented yet');
    };

    if (loading) {
        return <div className="loading-container">Đang tải...</div>;
    }

    if (!job) {
        return <div className="error-container">Không tìm thấy công việc</div>;
    }

    return (
        <div className="job-detail-container" style={{ backgroundColor: colors.background.default, padding: '2rem' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card className="job-main-card" style={{ borderRadius: '12px', boxShadow: colors.boxShadow }}>
                        <div className="job-header">
                            <Space size={16} align="start">
                                <Avatar
                                    src={job.companyLogo}
                                    size={80}
                                    icon={<UserOutlined />}
                                    className="company-logo"
                                />
                                <div className="job-title-section">
                                    <Title level={3}>{job.title}</Title>
                                    <Title level={5} className="company-name">{job.company}</Title>
                                    <Space wrap className="job-tags">
                                        <Tag icon={<EnvironmentOutlined />}>{job.location}</Tag>
                                        <Tag icon={<DollarOutlined />}>{job.salary}</Tag>
                                        <Tag icon={<CalendarOutlined />}>{job.employmentType}</Tag>
                                    </Space>
                                </div>
                            </Space>
                        </div>

                        <Divider />

                        <div className="job-quick-info">
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Text type="secondary"><ClockCircleOutlined /> Kinh nghiệm</Text>
                                    <div>{job.experience}</div>
                                </Col>
                                <Col span={8}>
                                    <Text type="secondary"><TeamOutlined /> Vị trí</Text>
                                    <div>{job.positions} vị trí trống</div>
                                </Col>
                                <Col span={8}>
                                    <Text type="secondary"><CalendarOutlined /> Hạn chót</Text>
                                    <div>{job.deadline}</div>
                                </Col>
                            </Row>
                        </div>

                        <Divider />

                        <div className="job-description">
                            <Title level={4}>Mô tả công việc</Title>
                            <Paragraph>{job.description}</Paragraph>
                        </div>

                        <div className="job-requirements">
                            <Title level={4}>Yêu cầu</Title>
                            <List
                                dataSource={job.requirements}
                                renderItem={item => (
                                    <List.Item>
                                        <Text>• {item}</Text>
                                    </List.Item>
                                )}
                            />
                        </div>

                        <div className="job-benefits">
                            <Title level={4}>Phúc lợi</Title>
                            <List
                                dataSource={job.benefits}
                                renderItem={item => (
                                    <List.Item>
                                        <Text>• {item}</Text>
                                    </List.Item>
                                )}
                            />
                        </div>

                        <div className="required-skills">
                            <Title level={4}>Kỹ năng yêu cầu</Title>
                            <Space wrap>
                                {job.skills.map(skill => (
                                    <Tag key={skill} color="blue">{skill}</Tag>
                                ))}
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className="job-action-card" style={{ borderRadius: '12px', boxShadow: colors.boxShadow }}>
                        <Button type="primary" block size="large" onClick={handleApply}>
                            Ứng tuyển ngay
                        </Button>
                        <div className="action-buttons">
                            <Button
                                icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
                                onClick={handleSave}
                                className={isSaved ? 'saved' : ''}
                            >
                                {isSaved ? 'Đã lưu' : 'Lưu công việc'}
                            </Button>
                            <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                                Chia sẻ
                            </Button>
                        </div>
                    </Card>

                    <Card className="company-card" style={{ borderRadius: '12px', boxShadow: colors.boxShadow }}>
                        <Title level={4}>Giới thiệu về Công ty</Title>
                        <Paragraph>
                            Tech Solutions Inc. là một công ty hàng đầu về phát triển phần mềm...
                        </Paragraph>
                        <Button type="link" block>
                            Xem hồ sơ công ty
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default JobsDetail;
