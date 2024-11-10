import React, { useState, useEffect } from 'react';
import { Card, Typography, Empty, Spin, Row, Col, Collapse } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import { getPersonalApplications } from '../../services/api/applicationService';
import { formatCurrency } from '../../utils/formatters';
import parse from 'html-react-parser';

const { Title, Text } = Typography;

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
    },
    header: {
        marginBottom: '2rem',
    },
    card: {
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: 600,
        color: '#1890ff',
        marginBottom: '0.5rem',
    },
    companyName: {
        fontSize: '16px',
        color: '#262626',
        marginBottom: '1rem',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '0.5rem',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#595959',
    },
    statusTag: {
        borderRadius: '4px',
        padding: '0 8px',
    },
    loadingContainer: {
        textAlign: 'center' as const,
        marginTop: '3rem',
    },

    resumeLink: {
        color: '#1890ff',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    coverLetterContent: {
        marginTop: '10px',
        '& p': {
            margin: '0.5rem 0',
            lineHeight: '1.6',
        },
        '& a': {
            color: '#1890ff',
            textDecoration: 'none',
        },
        '& ul, & ol': {
            paddingLeft: '1.5rem',
            margin: '0.5rem 0',
        },
        '& li': {
            marginBottom: '0.5rem',
        },
        '& img': {
            maxWidth: '100%',
            height: 'auto',
        },
    },
    collapse: {
        marginTop: '1rem',
        background: 'white',
        border: 'none',
    },
    collapsePanel: {
        border: 'none',
        borderRadius: '4px',
    },
    applicationInfo: {
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '4px',
    },
};




const PersonalApplication = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getPersonalApplications();
                setApplications(response.metadata);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <Spin size="large" />
            </div>
        );
    }

    if (!applications.length) {
        return (
            <div style={styles.container}>
                <Empty
                    description="Bạn chưa có đơn ứng tuyển nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Title level={3}>Đơn ứng tuyển của tôi</Title>
                <Text type="secondary">Theo dõi trạng thái đơn ứng tuyển của bạn</Text>
            </div>

            <Row gutter={[16, 16]}>
                {applications.map((application: any) => (
                    <Col xs={24} key={application._id}>
                        <Card style={styles.card}>
                            <div style={styles.cardTitle}>
                                {application?.jobId?.title || 'Không có tiêu đề'}
                            </div>
                            <div style={styles.companyName}>
                                {application?.jobId?.companyId?.name || 'Không có tên công ty'}
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.infoItem}>
                                    <ClockCircleOutlined />
                                    {new Date(application.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                <span style={styles.infoItem}>
                                    <EnvironmentOutlined />
                                    {application?.jobId?.location || 'Không có địa điểm'}
                                </span>
                                <span style={styles.infoItem}>
                                    {!application?.jobId?.salary.negotiable ? <span><DollarOutlined /> {formatCurrency(application?.jobId?.salary.min || 0)} - {formatCurrency(application?.jobId?.salary.max || 0)}</span> : <span><DollarOutlined /> Lương thỏa thuận</span>}
                                </span>
                            </div>

                            <Collapse ghost style={styles.collapse}>
                                <Collapse.Panel
                                    header={<Text strong>Thông tin ứng tuyển</Text>}
                                    key="1"
                                    style={styles.collapsePanel}
                                >
                                    <div style={styles.applicationInfo}>
                                        <div>
                                            <Text>CV: </Text>
                                            <a
                                                href={application.resume.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={styles.resumeLink}
                                            >
                                                {application.resume.name || 'Xem CV'}
                                            </a>
                                        </div>
                                        {application.coverLetter && (
                                            <div>
                                                <div style={styles.coverLetterContent}>
                                                    {parse(application.coverLetter)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PersonalApplication;
