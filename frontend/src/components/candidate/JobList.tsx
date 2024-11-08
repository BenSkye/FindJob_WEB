import React from 'react';
import { Row, Col } from 'antd';
import JobCard from './JobCard';
import { Job } from '../../services/types/job.types';
import { Link } from 'react-router-dom';

interface JobListProps {
    jobs: Job[];
    type: 'featured' | 'recent';
}

const styles = {
    jobList: {
        marginTop: '2rem',
        background: '#fff',
        borderRadius: '8px',
        padding: '1rem',
    },
};

const JobList: React.FC<JobListProps> = ({ jobs, type }) => {
    if (type === 'recent') {
        return (
            <div style={styles.jobList}>
                {jobs.map(job => (
                    <Link to={`/jobsdetail/${job._id}`}>
                        <JobCard key={job._id} job={job} type="recent" />
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <Row gutter={[16, 16]}>
            {jobs.map(job => (
                <Col key={job._id} xs={24} sm={12} lg={8}>
                    <Link to={`/jobsdetail/${job._id}`}>
                        <JobCard job={job} type="featured" />
                    </Link>
                </Col>
            ))}
        </Row>
    );
};

export default JobList;