import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    message,
    Skeleton
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
import { getJobById } from '../../services/api/jobService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import ApplyJobModal from './ApplyJobModal';
import { getPersonalJobHasApplied, sendApplication } from '../../services/api/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { useJobHasApply } from '../../hooks/useJobHasApply';

const { Title, Paragraph, Text } = Typography;

interface JobDetail {
    _id: string;
    title: string;
    company: object;
    location: string;
    salary: string;
    experience: string;
    requirements: string;
    description: string;
    benefits: string;
    jobType: string;
    status: string;
    expiryDate: string;
    mainCategory: object;
    subCategory: object;
    isHot: boolean;
    level: object;
}

const JobsDetail: React.FC = () => {
    const { id } = useParams();
    const [job, setJob] = useState<JobDetail | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { appliedJobs, addAppliedJob } = useJobHasApply();

    const fetchJobById = async () => {
        try {
            setLoading(true);
            const response = await getJobById(id as string);
            setJob(response.metadata);
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải thông tin công việc');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchJobById();
    }, [id]);

    const handleApply = () => {
        if (user) {
            setIsModalVisible(true);
        } else {
            navigate('/login');
            message.error('Vui lòng đăng nhập để ứng tuyển!');
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleModalSubmit = async (values: any) => {
        try {
            // Gọi API để tạo application
            // await createApplication(values);
            console.log('values:', values);
            const response = await sendApplication(id as string, values);
            console.log('response:', response);
            if (response.status === 201) {
                message.success('Nộp đơn ứng tuyển thành công!');
                setIsModalVisible(false);
                addAppliedJob(id as string);
            } else {
                message.error('Có lỗi xảy ra khi nộp đơn!');
            }

        } catch (error: any) {
            message.error('Có lỗi xảy ra khi nộp đơn!');
        }
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        message.info(isSaved ? 'Job removed from saved list' : 'Job saved');
    };

    const handleShare = () => {
        message.info('Share functionality not implemented yet');
    };



    const renderSkeletonContent = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
                <Card className="job-main-card" style={{ borderRadius: '12px', boxShadow: colors.boxShadow }}>
                    <div className="job-header">
                        <Space size={16} align="start">
                            <Skeleton.Avatar active size={80} />
                            <div style={{ width: '100%' }}>
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </div>
                        </Space>
                    </div>
                    <Divider />
                    <Skeleton active paragraph={{ rows: 4 }} />
                    <Divider />
                    <Skeleton active paragraph={{ rows: 6 }} />
                </Card>
            </Col>
            <Col xs={24} lg={8}>
                <Card className="job-action-card" style={{ borderRadius: '12px', boxShadow: colors.boxShadow }}>
                    <Skeleton.Button active block size="large" style={{ marginBottom: '20px' }} />
                    <div className="action-buttons">
                        <Skeleton.Button active style={{ marginRight: '10px' }} />
                        <Skeleton.Button active />
                    </div>
                </Card>
                <Card className="company-card" style={{ marginTop: '20px', borderRadius: '12px', boxShadow: colors.boxShadow }}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
            </Col>
        </Row>
    );

    if (loading) {
        return (
            <div className="job-detail-container" style={{ backgroundColor: colors.background.default, padding: '2rem' }}>
                {renderSkeletonContent()}
            </div>
        );
    }
    return (
        <div className="job-detail-container" style={{ backgroundColor: colors.background.default, padding: '2rem' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card className="job-main-card" style={{ borderRadius: '12px', boxShadow: colors.boxShadow }}>
                        <div className="job-header">
                            <Space size={16} align="start">
                                <Avatar
                                    src={job.companyId?.logo}
                                    size={80}
                                    icon={<UserOutlined />}
                                    className="company-logo"
                                />
                                <div className="job-title-section">
                                    <Title level={3}>{job.title}</Title>
                                    <Title level={5} className="company-name">{job.companyId?.name}</Title>
                                    <Space wrap className="job-tags">
                                        <Tag icon={<EnvironmentOutlined />}>{job.location}</Tag>
                                        {!job.salary.negotiable ? <span><DollarOutlined /> {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}</span> : <span><DollarOutlined /> Giá thỏa thuận</span>}
                                        <Tag icon={<CalendarOutlined />}>{job.jobType}</Tag>
                                    </Space>
                                </div>
                            </Space>
                        </div>

                        <Divider />

                        <div className="job-quick-info">
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Text type="secondary"><ClockCircleOutlined /> Kinh nghiệm</Text>
                                    <div>{job.level?.name}</div>
                                </Col>
                                {/* <Col span={8}>
                                    <Text type="secondary"><TeamOutlined /> Vị trí</Text>
                                    <div>{job.positions} vị trí trống</div>
                                </Col> */}
                                <Col span={8}>
                                    <Text type="secondary"><CalendarOutlined /> Hạn chót</Text>
                                    <div>{formatDateTime.dateOnly(job?.expiryDate)}</div>
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
                                dataSource={job?.requirements?.split('\n')}
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
                                dataSource={job?.benefits?.split('\n')}
                                renderItem={item => (
                                    <List.Item>
                                        <Text>• {item}</Text>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className="job-action-card" style={{ borderRadius: '12px', boxShadow: colors.boxShadow }}>
                        {appliedJobs.includes(id as string) ? (
                            <Text type="secondary">Bạn đã ứng tuyển công việc này</Text>

                        ) : (
                            <Button type="primary" block size="large" onClick={handleApply}>
                                Ứng tuyển ngay
                            </Button>
                        )}
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
            <ApplyJobModal
                isVisible={isModalVisible}
                jobId={id as string}
                onCancel={handleModalCancel}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

export default JobsDetail;
