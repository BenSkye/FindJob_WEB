import React, { useState } from 'react';
import {
    Layout,
    Card,
    Input,
    Select,
    Button,
    Tag,
    Row,
    Col,
    Typography,
    Pagination,
    Checkbox,
    Slider,
    Space,
    Divider
} from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    FilterOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './JobsList.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Content } = Layout;

const jobsList = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'TP.HCM',
        salary: '$1500 - $3000',
        type: 'Full-time',
        tags: ['React', 'TypeScript', 'Redux'],
        posted: '2 days ago',
        urgent: true,
    },
    {
        id: 2,
        title: 'Backend Developer',
        company: 'Digital Innovation Co.',
        location: 'Hà Nội',
        salary: '$1800 - $2500',
        type: 'Full-time',
        tags: ['Node.js', 'MongoDB', 'Express'],
        posted: '1 day ago',
        urgent: false,
    },
    // ... thêm các công việc khác
];

const JobsList: React.FC = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleJobClick = (jobId: number) => {
        navigate(`/jobs/${jobId}`);
    };

    return (
        <div className="jobs-page">
            {/* Search Section */}
            <div className="search-section">
                <div className="search-container">
                    <Title level={2} className="search-title">
                        IT & Software Jobs
                    </Title>
                    <Row gutter={[16, 16]} className="search-row">
                        <Col xs={24} md={10}>
                            <Input
                                size="large"
                                placeholder="Job title or keyword"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} md={10}>
                            <Select
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="Select location"
                                value={selectedLocation}
                                onChange={setSelectedLocation}
                            >
                                <Option value="hcm">TP.HCM</Option>
                                <Option value="hn">Hà Nội</Option>
                                <Option value="dn">Đà Nẵng</Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={4}>
                            <Button type="primary" size="large" block>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-container">
                <Row gutter={24}>
                    {/* Filters */}
                    <Col xs={24} lg={6}>
                        <Card className="filters-card">
                            <div className="filters-header">
                                <Title level={4}>Filters</Title>
                                <Button type="link" icon={<FilterOutlined />}>Reset</Button>
                            </div>
                            <Divider />
                            <div className="filter-section">
                                <Title level={5}>Job Type</Title>
                                <Checkbox.Group className="filter-group">
                                    <Checkbox value="fulltime">Full-time</Checkbox>
                                    <Checkbox value="parttime">Part-time</Checkbox>
                                    <Checkbox value="remote">Remote</Checkbox>
                                    <Checkbox value="freelance">Freelance</Checkbox>
                                </Checkbox.Group>
                            </div>
                            <Divider />
                            <div className="filter-section">
                                <Title level={5}>Experience Level</Title>
                                <Checkbox.Group className="filter-group">
                                    <Checkbox value="fresher">Fresher</Checkbox>
                                    <Checkbox value="junior">Junior</Checkbox>
                                    <Checkbox value="middle">Middle</Checkbox>
                                    <Checkbox value="senior">Senior</Checkbox>
                                </Checkbox.Group>
                            </div>
                            <Divider />
                            <div className="filter-section">
                                <Title level={5}>Salary Range</Title>
                                <Slider
                                    range
                                    min={0}
                                    max={5000}
                                    defaultValue={[1000, 3000]}
                                    tipFormatter={(value) => `$${value}`}
                                />
                            </div>
                        </Card>
                    </Col>

                    {/* Job Listings */}
                    <Col xs={24} lg={18}>
                        <Card className="jobs-card">
                            <div className="jobs-header">
                                <Title level={4}>{jobsList.length} Jobs Found</Title>
                                <Select defaultValue="newest" style={{ width: 200 }}>
                                    <Option value="newest">Newest First</Option>
                                    <Option value="salary">Salary: High to Low</Option>
                                    <Option value="relevant">Most Relevant</Option>
                                </Select>
                            </div>

                            {jobsList.map(job => (
                                <Card
                                    key={job.id}
                                    className="job-item"
                                    onClick={() => handleJobClick(job.id)}
                                >
                                    <Row gutter={[16, 16]} align="middle">
                                        <Col xs={24} md={16}>
                                            <div className="job-info">
                                                <Title level={4} className="job-title">
                                                    {job.title}
                                                </Title>
                                                <Text className="company-name">{job.company}</Text>
                                                {job.urgent && (
                                                    <Tag color="red" className="urgent-tag">
                                                        Urgent
                                                    </Tag>
                                                )}
                                                <Space className="job-meta" wrap>
                                                    <Tag icon={<EnvironmentOutlined />}>
                                                        {job.location}
                                                    </Tag>
                                                    <Tag icon={<DollarOutlined />}>
                                                        {job.salary}
                                                    </Tag>
                                                    <Tag icon={<ClockCircleOutlined />}>
                                                        {job.type}
                                                    </Tag>
                                                </Space>
                                                <div className="job-tags">
                                                    {job.tags.map(tag => (
                                                        <Tag key={tag} color="blue">{tag}</Tag>
                                                    ))}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={24} md={8} className="job-actions">
                                            <Text type="secondary">{job.posted}</Text>
                                            <Button type="primary">Apply Now</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}

                            <div className="pagination">
                                <Pagination
                                    current={currentPage}
                                    total={100}
                                    onChange={setCurrentPage}
                                    showSizeChanger
                                    showQuickJumper
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default JobsList; 