import React from 'react';
import { Typography, Input, Button, Card, Tag, Row, Col, Statistic } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Search } = Input;

// Mock data
const featuredJobs = [
    {
        id: 1,
        title: 'Senior React Developer',
        company: 'Tech Corp',
        location: 'TP.HCM',
        salary: '$1500-$3000',
        tags: ['React', 'TypeScript', 'Remote'],
        urgent: true,
    },
    {
        id: 2,
        title: 'Product Manager',
        company: 'Innovation Inc',
        location: 'Hà Nội',
        salary: '$2000-$4000',
        tags: ['Management', 'Agile', 'Product'],
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        location: 'Đà Nẵng',
        salary: '$1000-$2000',
        tags: ['Figma', 'Adobe XD', 'UI/UX'],
    },
];

const categories = [
    { title: 'IT & Phần mềm', count: 1200, icon: <TeamOutlined /> },
    { title: 'Marketing', count: 800, icon: <TeamOutlined /> },
    { title: 'Tài chính - Kế toán', count: 600, icon: <TeamOutlined /> },
    { title: 'Thiết kế', count: 450, icon: <TeamOutlined /> },
];

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '3rem',

    },
    heroSection: {
        background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
        color: 'white',
        padding: '4rem 2rem',
        borderRadius: '0.5rem',
    },
    heroContent: {
        maxWidth: '64rem',
        margin: '0 auto',
        textAlign: 'center' as const,
    },
    searchWrapper: {
        maxWidth: '32rem',
        margin: '0 auto',
    },
    whiteText: {
        color: 'white',
        marginBottom: '1.5rem',
    },
    statsSection: {
        textAlign: 'center' as const,
    },
    // cardHover: {
    //     transition: 'all 0.3s ease',
    //     height: '100%',
    //     cursor: 'pointer',
    //     '&:hover': {
    //         transform: 'translateY(-4px)',
    //         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    //     },
    // },
    jobMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '0.5rem',
    },
    sectionTitle: {
        marginBottom: '1.5rem',
    },
    buttonContainer: {
        textAlign: 'center' as const,
        marginTop: '2rem',
    },
    categoryIcon: {
        fontSize: '2.5rem',
        color: '#3b82f6',
        marginBottom: '1rem',
    },
    ctaSection: {
        background: '#f3f4f6',
        padding: '3rem',
        borderRadius: '0.5rem',
        textAlign: 'center' as const,
    },
    button: {
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
    },
};

const HomePage: React.FC = () => {
    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <Title level={1} style={styles.whiteText}>
                        Tìm kiếm công việc mơ ước của bạn
                    </Title>
                    <Paragraph style={styles.whiteText}>
                        Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu
                    </Paragraph>
                    <div style={styles.searchWrapper}>
                        <Search
                            placeholder="Nhập từ khóa tìm kiếm (vị trí, công ty, kỹ năng...)"
                            enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
                            size="large"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <Row gutter={16} style={styles.statsSection}>
                <Col span={6} className='card-hover'>
                    <Statistic title="Việc làm đang tuyển" value={5000} />
                </Col>
                <Col span={6} className='card-hover'>
                    <Statistic title="Công ty đối tác" value={2000} />
                </Col>
                <Col span={6} className='card-hover'>
                    <Statistic title="Ứng viên" value={50000} />
                </Col>
                <Col span={6} className='card-hover'>
                    <Statistic title="Tuyển dụng thành công" value={10000} />
                </Col>
            </Row>

            {/* Featured Jobs Section */}
            <div>
                <Title level={2} style={styles.sectionTitle}>Việc làm nổi bật</Title>
                <Row gutter={[16, 16]}>
                    {featuredJobs.map(job => (
                        <Col key={job.id} xs={24} sm={12} lg={8}>
                            <Card className='card-hover'>
                                {job.urgent && (
                                    <Tag color="red" style={{ marginBottom: '0.5rem' }}>
                                        Tuyển gấp
                                    </Tag>
                                )}
                                <Title level={4}>{job.title}</Title>
                                <Paragraph>{job.company}</Paragraph>
                                <div style={styles.jobMeta}>
                                    <span>
                                        <EnvironmentOutlined /> {job.location}
                                    </span>
                                    <span>
                                        <DollarOutlined /> {job.salary}
                                    </span>
                                </div>
                                <div style={styles.tagContainer}>
                                    {job.tags.map(tag => (
                                        <Tag key={tag} color="blue">
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div style={styles.buttonContainer}>
                    <Button className='button-hover' type="primary" size="large" style={styles.button}>
                        Xem tất cả việc làm
                    </Button>
                </div>
            </div>

            {/* Categories Section */}
            <div>
                <Title level={2} style={styles.sectionTitle}>Ngành nghề phổ biến</Title>
                <Row gutter={[16, 16]}>
                    {categories.map(category => (
                        <Col key={category.title} xs={24} sm={12} lg={6}>
                            <Card className='card-hover'>
                                <div style={styles.categoryIcon}>
                                    {category.icon}
                                </div>
                                <Title level={4}>{category.title}</Title>
                                <Paragraph>{category.count} việc làm</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* CTA Section */}
            <div style={styles.ctaSection}>
                <Title level={2}>Bạn là nhà tuyển dụng?</Title>
                <Paragraph style={{ marginBottom: '2rem' }}>
                    Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp ngay hôm nay
                </Paragraph>
                <Button className='button-hover' type="primary" size="large" style={styles.button}>
                    Đăng tin tuyển dụng
                </Button>
            </div>
        </div>
    );
};

export default HomePage;