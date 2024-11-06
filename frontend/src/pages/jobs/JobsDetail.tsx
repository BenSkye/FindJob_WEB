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
    message,
    Space
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
                deadline: '30/04/2024',
                positions: 2,
                description: 'We are looking for an experienced Frontend Developer to join our team...',
                requirements: [
                    'Bachelors degree in Computer Science or related field',
                    '3+ years of experience with React.js',
                    'Strong knowledge of TypeScript',
                    'Experience with state management (Redux, Context API)',
                    'Excellent problem-solving skills',
                ],
                benefits: [
                    'Competitive salary package',
                    'Health insurance for you and your family',
                    'Annual leave and sick leave',
                    'Professional development opportunities',
                    'Modern office in prime location',
                ],
                skills: ['React', 'TypeScript', 'HTML5', 'CSS3', 'Redux', 'Git'],
                companyLogo: '/company-logo.png',
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleApply = () => {
        message.success('Your application has been submitted successfully!');
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        message.success(isSaved ? 'Job removed from saved items' : 'Job saved successfully');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success('Link copied to clipboard!');
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (!job) {
        return <div className="error-container">Job not found</div>;
    }

    return (
        <div className="job-detail-container">
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    {/* Main Job Information */}
                    <Card className="job-main-card">
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
                                    <Text type="secondary"><ClockCircleOutlined /> Experience</Text>
                                    <div>{job.experience}</div>
                                </Col>
                                <Col span={8}>
                                    <Text type="secondary"><TeamOutlined /> Positions</Text>
                                    <div>{job.positions} openings</div>
                                </Col>
                                <Col span={8}>
                                    <Text type="secondary"><CalendarOutlined /> Deadline</Text>
                                    <div>{job.deadline}</div>
                                </Col>
                            </Row>
                        </div>

                        <Divider />

                        <div className="job-description">
                            <Title level={4}>Job Description</Title>
                            <Paragraph>{job.description}</Paragraph>
                        </div>

                        <div className="job-requirements">
                            <Title level={4}>Requirements</Title>
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
                            <Title level={4}>Benefits</Title>
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
                            <Title level={4}>Required Skills</Title>
                            <Space wrap>
                                {job.skills.map(skill => (
                                    <Tag key={skill} color="blue">{skill}</Tag>
                                ))}
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {/* Action Buttons Card */}
                    <Card className="job-action-card">
                        <Button type="primary" block size="large" onClick={handleApply}>
                            Apply Now
                        </Button>
                        <div className="action-buttons">
                            <Button
                                icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
                                onClick={handleSave}
                                className={isSaved ? 'saved' : ''}
                            >
                                {isSaved ? 'Saved' : 'Save Job'}
                            </Button>
                            <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                                Share
                            </Button>
                        </div>
                    </Card>

                    {/* Company Card */}
                    <Card className="company-card">
                        <Title level={4}>About the Company</Title>
                        <Paragraph>
                            Tech Solutions Inc. is a leading software development company...
                        </Paragraph>
                        <Button type="link" block>
                            View Company Profile
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default JobsDetail; 