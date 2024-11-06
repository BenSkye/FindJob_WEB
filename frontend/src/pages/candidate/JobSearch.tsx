import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Input, Select, Button, Spin } from 'antd';
import { SearchOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import JobList from '../../components/candidate/JobList';
import FilterTags from '../../components/candidate/FilterTags';
import MultiSelect from '../../components/candidate/MultiSelect';
import { Job } from '../../services/types/job.types';

const { Title } = Typography;

const jobCategories = [
    'IT & Phần mềm',
    'Marketing',
    'Tài chính - Kế toán',
    'Thiết kế',
    'Kinh doanh',
    'Nhân sự',
    'Hành chính - Văn phòng',
    'Khác'
];

const locations = [
    'TP.HCM',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'Bình Dương',
    'Đồng Nai',
    'Tất cả tỉnh/thành'
];

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
    },
    searchBar: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    },
    filterSection: {
        marginBottom: '2rem',
    },
    resultsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    loadingContainer: {
        textAlign: 'center' as const,
        padding: '2rem',
    },
    searchInput: {
        width: 'calc(100% - 120px)',
        height: '40px',
    },
    searchButton: {
        width: '120px',
        height: '40px',
    },
    select: {
        width: '100%',
        height: '40px',
    },
};

// Mock data for testing
const mockSearchResults: Job[] = [
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

const JobSearch: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    // States
    const [keyword, setKeyword] = useState(queryParams.get('keyword') || '');
    const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || '');
    const [selectedLevels, setSelectedLevels] = useState<string[]>(queryParams.getAll('level') || []);
    const [selectedLocation, setSelectedLocation] = useState(queryParams.get('location') || '');
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const [searchResults, setSearchResults] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // TODO: Replace with actual API call
                // const response = await searchJobsAPI({
                //     keyword,
                //     category: selectedCategory,
                //     levels: selectedLevels,
                //     location: selectedLocation,
                //     salaryFilter: activeFilter
                // });
                // setSearchResults(response.data);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setSearchResults(mockSearchResults);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [keyword, selectedCategory, selectedLevels, selectedLocation, activeFilter]);

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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.searchBar}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24}>
                        <Input.Group compact>
                            <Input
                                style={styles.searchInput}
                                placeholder="Nhập vị trí công việc, công ty, kỹ năng..."
                                prefix={<SearchOutlined />}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Button
                                type="primary"
                                style={styles.searchButton}
                                onClick={handleSearch}
                                loading={loading}
                            >
                                Tìm kiếm
                            </Button>
                        </Input.Group>
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            placeholder="Chọn ngành nghề"
                            style={styles.select}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            suffixIcon={<TeamOutlined />}
                        >
                            {jobCategories.map(category => (
                                <Select.Option key={category} value={category}>
                                    {category}
                                </Select.Option>
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
                            style={styles.select}
                            value={selectedLocation}
                            onChange={setSelectedLocation}
                            suffixIcon={<EnvironmentOutlined />}
                        >
                            {locations.map(location => (
                                <Select.Option key={location} value={location}>
                                    {location}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>

            <div style={styles.filterSection}>
                <FilterTags
                    filters={salaryFilters}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    color="#00b14f"
                />
            </div>

            <div style={styles.resultsHeader}>
                <Title level={4}>
                    {loading ? (
                        'Đang tìm kiếm...'
                    ) : (
                        `Tìm thấy ${searchResults.length} việc làm phù hợp`
                    )}
                </Title>
            </div>

            {loading ? (
                <div style={styles.loadingContainer}>
                    <Spin size="large" />
                </div>
            ) : (
                <JobList jobs={searchResults} type="recent" />
            )}
        </div>
    );
};

export default JobSearch;