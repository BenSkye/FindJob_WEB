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

const danhSachCongViec = [
    {
        id: 1,
        title: 'Lập trình viên Frontend cấp cao',
        company: 'Tech Solutions Inc.',
        location: 'TP.HCM',
        salary: '$1500 - $3000',
        type: 'Toàn thời gian',
        tags: ['React', 'TypeScript', 'Redux'],
        posted: '2 ngày trước',
        urgent: true,
    },
    {
        id: 2,
        title: 'Lập trình viên Backend',
        company: 'Digital Innovation Co.',
        location: 'Hà Nội',
        salary: '$1800 - $2500',
        type: 'Toàn thời gian',
        tags: ['Node.js', 'MongoDB', 'Express'],
        posted: '1 ngày trước',
        urgent: false,
    },
    // ... thêm các công việc khác
];

const DanhSachCongViec: React.FC = () => {
    const navigate = useNavigate();
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
    const [viTriChon, setViTriChon] = useState<string>('');
    const [trangHienTai, setTrangHienTai] = useState(1);

    const handleJobClick = (jobId: number) => {
        navigate(`/jobs/${jobId}`);
    };

    return (
        <div className="jobs-page">
            {/* Phần Tìm Kiếm */}
            <div className="search-section">
                <div className="search-container">
                    <Title level={2} className="search-title">
                        Việc làm IT & Phần mềm
                    </Title>
                    <Row gutter={[16, 16]} className="search-row">
                        <Col xs={24} md={10}>
                            <Input
                                size="large"
                                placeholder="Tiêu đề công việc hoặc từ khóa"
                                prefix={<SearchOutlined />}
                                value={tuKhoaTimKiem}
                                onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} md={10}>
                            <Select
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="Chọn địa điểm"
                                value={viTriChon}
                                onChange={setViTriChon}
                            >
                                <Option value="hcm">TP.HCM</Option>
                                <Option value="hn">Hà Nội</Option>
                                <Option value="dn">Đà Nẵng</Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={4}>
                            <Button type="primary" size="large" block>
                                Tìm Kiếm
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Nội Dung Chính */}
            <div className="main-container">
                <Row gutter={24}>
                    {/* Bộ Lọc */}
                    <Col xs={24} lg={6}>
                        <Card className="filters-card">
                            <div className="filters-header">
                                <Title level={4}>Bộ Lọc</Title>
                                <Button type="link" icon={<FilterOutlined />}>Đặt lại</Button>
                            </div>
                            <Divider />
                            <div className="filter-section">
                                <Title level={5}>Loại Công Việc</Title>
                                <Checkbox.Group className="filter-group">
                                    <Checkbox value="fulltime">Toàn thời gian</Checkbox>
                                    <Checkbox value="parttime">Bán thời gian</Checkbox>
                                    <Checkbox value="remote">Làm từ xa</Checkbox>
                                    <Checkbox value="freelance">Freelance</Checkbox>
                                </Checkbox.Group>
                            </div>
                            <Divider />
                            <div className="filter-section">
                                <Title level={5}>Kinh Nghiệm</Title>
                                <Checkbox.Group className="filter-group">
                                    <Checkbox value="intern">Intern</Checkbox>
                                    <Checkbox value="fresher">Fresher</Checkbox>
                                    <Checkbox value="junior">Junior</Checkbox>
                                    <Checkbox value="senior">Senior</Checkbox>

                                </Checkbox.Group>
                            </div>
                            <Divider />
                            <div className="filter-section">
                                <Title level={5}>Mức Lương</Title>
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

                    {/* Danh Sách Công Việc */}
                    <Col xs={24} lg={18}>
                        <Card className="jobs-card">
                            <div className="jobs-header">
                                <Title level={4}>{danhSachCongViec.length} Công Việc Đã Tìm Thấy</Title>
                                <Select defaultValue="newest" style={{ width: 200 }}>
                                    <Option value="newest">Mới nhất</Option>
                                    <Option value="salary">Lương: Cao đến Thấp</Option>
                                    <Option value="relevant">Phù hợp nhất</Option>
                                </Select>
                            </div>

                            {danhSachCongViec.map(job => (
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
                                                        Khẩn cấp
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
                                            <Button type="primary">Ứng Tuyển Ngay</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}

                            <div className="pagination">
                                <Pagination
                                    current={trangHienTai}
                                    total={100}
                                    onChange={setTrangHienTai}
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

export default DanhSachCongViec;
