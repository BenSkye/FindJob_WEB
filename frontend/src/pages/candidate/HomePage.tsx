import React, { useEffect, useState } from 'react';
import { Typography, Input, Button, Card, Row, Col, Statistic, Select, Tag } from 'antd';
import { Link } from 'react-router-dom';
import {
    SearchOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    DownOutlined,
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons';
import JobList from '../../components/candidate/JobList';
import { Job } from '../../services/types/job.types';
import FilterTags from '../../components/candidate/FilterTags';
import { fetchProvinces } from '../../services/api/districtWardService';
import { Province } from '../../services/types/province.type';
import MultiSelect from '../../components/candidate/MultiSelect';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../config/theme';

const { Title, Paragraph } = Typography;

const featuredJobs: Job[] = [
    {
        id: '1',
        title: 'Senior React Developer',
        company: 'Tech Corp',
        location: 'TP.HCM',
        salary: '$1500-$3000',
        tags: ['React', 'TypeScript', 'Remote'],
        isHot: true,
        level: 'Senior',
        category: 'IT & Phần mềm',
    },
    {
        id: '2',
        title: 'Product Manager',
        company: 'Innovation Inc',
        location: 'Hà Nội',
        salary: '$2000-$4000',
        tags: ['Management', 'Agile', 'Product'],
        level: 'Senior',
        category: 'IT & Phần mềm',
    },
    {
        id: '3',
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        location: 'Đà Nẵng',
        salary: '$1000-$2000',
        tags: ['Figma', 'Adobe XD', 'UI/UX'],
        level: 'Senior',
        category: 'Thiết kế',
    },
];

const recentJobs: Job[] = [
    {
        id: '1',
        title: 'Nhân Viên Kinh Doanh/Sales Vật Liệu Xây Dựng',
        company: 'CÔNG TY CỔ PHẦN PHÂN PHỐI THALLO',
        location: 'Hồ Chí Minh',
        salary: 'Thoả thuận',
        logo: 'https://example.com/logo1.png',
        isHot: true,
        level: 'Entry Level',
        category: 'IT & Phần mềm',
        tags: ['Sales', 'Marketing', 'Business Development'],
    },
    {
        id: '2',
        title: 'Unreal Engine Artist',
        company: 'CÔNG TY TNHH VLAST VIỆT NAM',
        location: 'Hồ Chí Minh',
        salary: '10 - 30 triệu',
        logo: 'https://example.com/logo2.png',
        level: 'Entry Level',
        category: 'Thiết kế',
        tags: ['Unreal Engine', 'Art', '3D'],
    },
];

const categories = [
    { title: 'IT & Phần mềm', count: 1200, icon: <TeamOutlined /> },
    { title: 'Marketing', count: 800, icon: <TeamOutlined /> },
    { title: 'Tài chính - Kế toán', count: 600, icon: <TeamOutlined /> },
    { title: 'Thiết kế', count: 450, icon: <TeamOutlined /> },
];

const jobCategories = [
    'IT & Phần mềm',
    'Marketing',
    'Tài chính - Kế toán',
    'Thiết kế',
];



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
        color: colors.text.primary, // Sử dụng màu text từ theme
    },
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('')
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
    const [activeFilter, setActiveFilter] = useState<string>('Dưới 10 triệu');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (selectedCategory) params.set('category', selectedCategory);
        selectedLevels.forEach(level => params.append('level', level));
        if (selectedLocation) params.set('location', selectedLocation);

        navigate({
            pathname: '/job-search',
            search: params.toString(),
        });
    };

    const levelOptions = [
        { value: 'intern', label: 'Thực tập sinh' },
        { value: 'fresher', label: 'Mới tốt nghiệp' },
        { value: 'junior', label: 'Nhân viên' },
        { value: 'senior', label: 'Trưởng nhóm' },
        { value: 'manager', label: 'Quản lý' },
    ];

    const salaryFilters = [
        'Tất cả',
        'Dưới 10 triệu',
        'Từ 10-15 triệu',
        'Từ 15-20 triệu',
        'Từ 20-25 triệu',
        'Từ 25-30 triệu',
    ];

    const [provinces, setProvinces] = useState<Province[]>([]);

    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);

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
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
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
                            <Col xs={24} md={8}>
                                <Select
                                    placeholder="Chọn ngành nghề"
                                    style={{ width: '100%', height: '50px' }}
                                    showSearch
                                    suffixIcon={<TeamOutlined />}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    size="large"
                                >
                                    {jobCategories.map(cat => (
                                        <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={24} md={8}>
                                <MultiSelect
                                    placeholder="Chọn cấp bậc"
                                    options={levelOptions}
                                    value={selectedLevels}
                                    onChange={setSelectedLevels}
                                    maxTagCount={2}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <Select
                                    placeholder="Chọn địa điểm"
                                    style={{ width: '100%', height: '50px', }}
                                    suffixIcon={<EnvironmentOutlined />}
                                    value={selectedLocation}
                                    onChange={setSelectedLocation}
                                >
                                    {provinces.map(province => (
                                        <Select.Option key={province.id} value={province.id}>{province.name}</Select.Option>
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
                    <div style={styles.filterHeader}>
                        <div style={styles.filterDropdown}>
                            <span>Lọc theo:</span>
                            <span>Mức lương</span>
                            <DownOutlined />
                        </div>
                        <div style={styles.navigationButtons}>
                            <div style={styles.navButton}>
                                <LeftOutlined />
                            </div>
                            <div style={styles.navButton}>
                                <RightOutlined />
                            </div>
                        </div>
                    </div>
                    <FilterTags
                        filters={salaryFilters}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        color="#00b14f"
                    />
                </div>

                <JobList jobs={recentJobs} type="recent" />

                <div style={styles.buttonContainer}>
                    <Button type="primary" className='button-hover'>Xem tất cả việc làm</Button>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div>

                <Title level={2} style={styles.sectionTitle}>Việc làm nổi bật</Title>
                <Link to="/jobsdetail">
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
                </Link>
                <div style={styles.buttonContainer}>
                    <Button type="primary" className='button-hover'>Xem tất cả việc làm</Button>
                </div>
            </div >

            {/* Categories Section */}
            < div >
                <Title level={2} style={styles.sectionTitle}>Ngành nghề phổ biến</Title>
                <Link to="/jobslist">
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
                </Link>
            </div >

            {/* CTA Section */}
            < div style={styles.ctaSection} className='card-hover' >
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