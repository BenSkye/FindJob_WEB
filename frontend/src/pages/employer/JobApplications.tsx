import React, { useEffect, useState } from 'react'
import { getJobApplications } from '../../services/api/jobService';
import { ClockCircleOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { Card, Col, Collapse, Empty, Row, Spin, Typography } from 'antd';
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
export default function JobApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { jobId } = useParams();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getJobApplications(jobId as string);
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
                    description="Chưa có đơn ứng tuyển nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Title level={3}>Danh sách ứng viên</Title>
                <Text type="secondary">Tổng số: {applications.length} ứng viên</Text>
            </div>

            <Row gutter={[16, 16]}>
                {applications.map((application: any) => (
                    <Col xs={24} key={application?._id}>
                        <Card style={styles.card}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <div style={styles.cardTitle}>
                                        {application?.resume.name}
                                    </div>
                                </Col>
                            </Row>

                            <div style={styles.infoRow}>
                                <span style={styles.infoItem}>
                                    <MailOutlined />
                                    {application?.resume.email}
                                </span>
                                <span style={styles.infoItem}>
                                    <PhoneOutlined />
                                    {application?.resume.phone}
                                </span>
                                <span style={styles.infoItem}>
                                    <ClockCircleOutlined />
                                    Ngày ứng tuyển: {new Date(application?.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            <Collapse ghost style={styles.collapse}>
                                <Collapse.Panel
                                    header={<Text strong>Chi tiết ứng tuyển</Text>}
                                    key="1"
                                    style={styles.collapsePanel}
                                >
                                    <div style={styles.applicationInfo}>
                                        <div>
                                            <Text strong>CV: </Text>
                                            <a
                                                href={application?.resume.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={styles.resumeLink}
                                            >
                                                Xem CV
                                            </a>
                                        </div>
                                        {application?.coverLetter && (
                                            <div style={{ marginTop: '1rem' }}>
                                                <Text strong>Thư giới thiệu:</Text>
                                                <div style={styles.coverLetterContent}>
                                                    {parse(application?.coverLetter)}
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
}