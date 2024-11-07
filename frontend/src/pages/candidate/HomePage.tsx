import React, { useEffect, useState } from 'react';
import { Typography, Input, Button, Card, Row, Col, Statistic, Select } from 'antd';
import JobList from '../../components/candidate/JobList';
import { Job } from '../../services/types/job.types';
import FilterTags from '../../components/candidate/FilterTags';
import { fetchProvinces } from '../../services/api/districtWardService';
import { Province } from '../../services/types/province.type';
import MultiSelect from '../../components/candidate/MultiSelect';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../config/theme';
import { Link } from 'react-router-dom';
import { getHotListJobByCandidate, getListJobByCandidate } from '../../services/api/jobService';
import { getListCategory } from '../../services/api/categoryService';
import { getListLevel } from '../../services/api/levelService';
import { SearchOutlined, EnvironmentOutlined, TeamOutlined, DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '3rem',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    heroSection: {
        background: `linear-gradient(90deg, ${colors.brand.primary.dark}, ${colors.brand.primary.light})`,
        color: 'white',
        padding: '4rem 2rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        width: '100vw',
        position: 'relative' as const,
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
    },
    heroContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center' as const,
    },
    searchWrapper: {
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '1000px',
        margin: '2rem auto 0',
    },
    whiteText: {
        color: 'white',
        marginBottom: '1.5rem',
    },
    statsSection: {
        textAlign: 'center' as const,
        marginBottom: '2rem',
    },
    sectionTitle: {
        marginBottom: '1.5rem',
        textAlign: 'center' as const,
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
        backgroundImage: 'url(https://img.timviec.com.vn/2021/06/dang-tin-tuyen-dung-1.jpg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        padding: '3rem',
        borderRadius: '0.5rem',
        textAlign: 'center' as const,
    },
    filterSection: {
        marginBottom: '24px',
    },
    filterHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    },
    filterDropdown: {
        width: '200px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterTags: {
        display: 'flex',
        gap: '8px',
        overflowX: 'auto' as const,
        padding: '4px 0',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    navigationButtons: {
        display: 'flex',
        gap: '8px',
        marginLeft: 'auto',
    },
    navButton: {
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e5e7eb',
        borderRadius: '50%',
        cursor: 'pointer',
        '&:hover': {
            borderColor: '#00b14f',
            color: '#00b14f',
        },
    },
    ctaContent: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        width: '50%',
        margin: '0 auto',
        padding: '2rem',
        borderRadius: '0.5rem',
        textAlign: 'center' as const,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        color: colors.text.primary,
    },
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
    const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState<Province[]>([]);

    useEffect(() => {
        const fetchCategoriesAndLevels = async () => {
            try {
                const [categoriesResponse] = await Promise.all([
                    getListCategory(),
                ]);
                setCategories(categoriesResponse.metadata);
            } catch (error) {
                console.error('Error fetching categories and levels:', error);
            }
        };

        fetchCategoriesAndLevels();
    }, []);

    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);

    const fetchListJobByCandidate = async () => {
        const response = await getListJobByCandidate({ skip: 0, limit: 5 });
        console.log('response:', response);
        setRecentJobs(response.metadata);
        const hotResponse = await getHotListJobByCandidate({ skip: 0, limit: 5 });
        console.log('hotResponse:', hotResponse);
        setFeaturedJobs(hotResponse.metadata);
    };

    useEffect(() => {
        fetchListJobByCandidate();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (title) params.set('title', title);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedLocation) params.set('location', selectedLocation);

        navigate({
            pathname: '/job-search',
            search: params.toString(),
        });
    };

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
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={24}>
                                <Input.Group compact>
                                    <Input
                                        style={{ width: 'calc(100% - 120px)', height: '50px' }}
                                        placeholder="Nhập vị trí công việc, công ty, kỹ năng..."
                                        prefix={<SearchOutlined />}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        onPressEnter={handleSearch}
                                    />
                                    <Button
                                        className='button-hover'
                                        type="primary"
                                        style={{ width: '120px', height: '50px' }}
                                        onClick={handleSearch}
                                    >
                                        Tìm kiếm
                                    </Button>
                                </Input.Group>
                            </Col>
                            <Col xs={24} md={12}>
                                <Select
                                    placeholder="Chọn ngành nghề"
                                    style={{ width: '100%', height: '50px' }}
                                    showSearch
                                    suffixIcon={<TeamOutlined />}
                                    value={selectedCategory?.name}
                                    onChange={setSelectedCategory}
                                    size="large"
                                >
                                    {categories.map((category: any) => (
                                        <Select.Option key={category._id} value={category._id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col xs={24} md={12}>
                                <Select
                                    placeholder="Chọn địa điểm"
                                    style={{ width: '100%', height: '50px' }}
                                    suffixIcon={<EnvironmentOutlined />}
                                    value={selectedLocation}
                                    onChange={setSelectedLocation}
                                >
                                    {provinces.map(province => (
                                        <Select.Option key={province.id} value={province.id}>
                                            {province.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <Row gutter={16} style={styles.statsSection}>
                <Col xs={12} md={6}>
                    <Card className='card-hover'>
                        <Statistic title="Việc làm đang tuyển" value={5000} />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className='card-hover'>
                        <Statistic title="Công ty đối tác" value={2000} />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className='card-hover'>
                        <Statistic title="Ứng viên" value={50000} />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className='card-hover'>
                        <Statistic title="Tuyển dụng thành công" value={10000} />
                    </Card>
                </Col>
            </Row>

            {/* Recent Jobs Section */}
            <div>
                <Title level={2} style={styles.sectionTitle}>Việc làm mới nhất</Title>

                <div style={styles.filterSection}>


                </div>
                <JobList jobs={recentJobs} type="recent" />

                <div style={styles.buttonContainer}>
                    <Link to='/job-search'>
                        <Button type="primary" className='button-hover'>Xem tất cả việc làm</Button>
                    </Link>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div>
                <Title level={2} style={styles.sectionTitle}>Việc làm nổi bật</Title>
                <Link to='jobsdetail'>
                    <JobList jobs={featuredJobs} type="featured" />
                </Link>
                <div style={styles.buttonContainer}>
                    <Button type="primary" className='button-hover'>Xem tất cả việc làm</Button>
                </div>
            </div >

            {/* Categories Section */}
            <div>
                <Title level={2} style={styles.sectionTitle}>Ngành nghề phổ biến</Title>
                <Link to='/jobslist'>
                    <Row gutter={[16, 16]}>
                        {categories.map(category => (
                            <Col key={category.id} xs={24} sm={12} lg={6}>
                                <Card className='card-hover' hoverable>
                                    <div style={styles.categoryIcon}>
                                        <TeamOutlined />
                                    </div>
                                    <Title level={4}>{category.name}</Title>
                                    <Paragraph>{category.count} việc làm</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Link>
            </div >

            {/* CTA Section */}
            <div style={styles.ctaSection} className='card-hover'>
                <div style={styles.ctaContent}>
                    <Title level={2}>Bạn là nhà tuyển dụng?</Title>
                    <Paragraph style={{ marginBottom: '2rem' }}>
                        Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp ngay hôm nay
                    </Paragraph>
                    <Button type="primary" size="large" className='button-hover'>
                        Đăng tin tuyển dụng
                    </Button>
                </div>
            </div >
        </div >
    );
};

export default HomePage;