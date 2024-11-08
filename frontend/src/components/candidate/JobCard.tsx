import React from 'react';
import { Card, Tag, Typography, Button } from 'antd';
import { EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import { Job } from '../../services/types/job.types';
import defaultCompanyLogo from '../../assets/images/logo.png';
import { formatCurrency } from '../../utils/formatters';
import { useJobHasApply } from '../../hooks/useJobHasApply';

const { Title, Paragraph } = Typography;

interface JobCardProps {
    job: Job;
    type?: 'featured' | 'recent';
}

const styles = {
    jobHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
    },
    jobTitle: {
        margin: '8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    jobTags: {
        display: 'flex',
        gap: '4px',
    },
    jobMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#6b7280',
        fontSize: '0.875rem',
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '4px',
        marginTop: '8px',
    },
    jobLogo: {
        width: '60px',
        height: '60px',
        objectFit: 'contain' as const,
        borderRadius: '8px',
    },
    jobInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
    },
};

const JobCard: React.FC<JobCardProps> = ({ job, type = 'featured' }) => {
    const { appliedJobs } = useJobHasApply();

    if (type === 'recent') {
        console.log('job', job);
        return (
            <div className='card-hover' style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '1rem' }}>
                <img
                    src={job.companyId?.logo || defaultCompanyLogo}
                    alt={job.companyId?.name}
                    style={styles.jobLogo}
                />
                <div style={styles.jobInfo}>
                    <div style={styles.jobHeader}>
                        <Title level={5} style={styles.jobTitle}>
                            {job.title}
                            {job.isHot && <Tag color="red">Hot</Tag>}
                        </Title>
                        <div style={styles.jobTags}>
                            <Tag color="blue">{job.mainCategory.name}</Tag>
                            <Tag color="green">{job.level.name}</Tag>
                        </div>
                    </div>
                    <div style={styles.jobMeta}>
                        <span>{job.companyId.name}</span>
                        <span><EnvironmentOutlined /> {job.location}</span>
                        {!job.salary.negotiable ? <span><DollarOutlined /> {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}</span> : <span><DollarOutlined /> Giá thỏa thuận</span>}
                    </div>
                    {/* <div style={styles.tagContainer}>
                        {job.tags?.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </div> */}
                </div>
                {appliedJobs.includes(job._id) ? <span >Đã ứng tuyển</span> : <Button type="primary" ghost className='button-hover'>Ứng tuyển</Button>}
            </div>
        );
    }

    return (
        <Card className='card-hover' hoverable>
            <div style={styles.jobHeader}>
                {job.isHot && <Tag color="red">Hot</Tag>}
                <div style={styles.jobTags}>
                    <Tag color="blue">{job.mainCategory.name}</Tag>
                    <Tag color="green">{job.level.name}</Tag>
                </div>
            </div>
            <Title level={4} style={styles.jobTitle}>{job.title}</Title>
            <Paragraph>{job.companyId.name}</Paragraph>
            <div style={styles.jobMeta}>
                <span><EnvironmentOutlined /> {job.location}</span>
                {!job.salary.negotiable ? <span><DollarOutlined /> {job.salary.min} - {job.salary.max}</span> : <span><DollarOutlined /> Giá thỏa thuận</span>}
            </div>
            {/* <div style={styles.tagContainer}>
                {job.tags?.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                ))}
            </div> */}
        </Card>
    );
};

export default JobCard;