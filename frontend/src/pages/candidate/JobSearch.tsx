import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Input, Select, Button, Spin, Checkbox, Pagination } from 'antd';
import { SearchOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import JobList from '../../components/candidate/JobList';
import { Job } from '../../services/types/job.types';
import { getListJobByCandidate } from '../../services/api/jobService';
import { getListLevel } from '../../services/api/levelService';
import { getListCategory } from '../../services/api/categoryService';
import { Province } from '../../services/types/province.type';
import { fetchProvinces } from '../../services/api/districtWardService';
import { JOB_TYPE_OPTIONS } from '../../config';

const { Title } = Typography;

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
    },
    searchWrapper: {
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
    },
    contentContainer: {
        display: 'flex',
        gap: '2rem',
    },
    filterSidebar: {
        width: '280px',
        flexShrink: 0,
    },
    mainContent: {
        flex: 1,
    },
    filterContainer: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    filterHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    filterTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#262626',
        margin: 0,
    },
    resetButton: {
        color: '#1890ff',
        cursor: 'pointer',
        fontSize: '14px',
    },
    filterButtons: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.8rem',
    },
    filterButton: {
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: '14px',
        backgroundColor: 'white',
        '&:hover': {
            borderColor: '#1890ff',
            color: '#1890ff',
        },
    },
    activeFilterButton: {
        backgroundColor: '#1890ff',
        color: 'white',
        border: '1px solid #1890ff',
    }, resultsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    }, loadingContainer: {
        textAlign: 'center' as const,
        padding: '2rem',
    },
    searchInput: {
        width: 'calc(100% - 120px)',
        height: '50px',
        borderRadius: '8px',
        border: '1px solid #d9d9d9',
        transition: 'border-color 0.3s',
    },
    searchButton: {
        width: '120px',
        height: '50px',
        borderRadius: '8px',
        backgroundColor: '#1890ff',
        color: 'white',
        border: 'none',
        transition: 'background-color 0.3s',
    },
    select: {
        width: '100%',
        height: '50px',
        borderRadius: '8px',
    },
    filterSection: {
        marginBottom: '1.5rem',
    },
    filterSectionTitle: {
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '1rem',
        color: '#595959',
    },
    filterOptions: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.8rem',
    },
    checkboxGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px',
    },
    checkboxLabel: {
        fontSize: '14px',
        color: '#262626',
    },

};

const JobSearch: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    // States
    const [title, setTitle] = useState<string>();
    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedLocation, setSelectedLocation] = useState<any>();
    const [searchResults, setSearchResults] = useState<Job[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        const fetchCategoriesAndLevels = async () => {
            try {
                const [categoriesResponse, levelsResponse] = await Promise.all([
                    getListCategory(),
                    getListLevel()
                ]);
                setCategories(categoriesResponse.metadata);
                setLevels(levelsResponse.metadata);
            } catch (error) {
                console.error('Error fetching categories and levels:', error);
            }
        };

        fetchCategoriesAndLevels();
    }, []);

    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);

    useEffect(() => {
        const queryCategory = queryParams.get('category');
        const queryLocation = queryParams.get('location');
        const queryTitle = queryParams.get('title');
        if (queryTitle) {
            setTitle(queryTitle);
        }
        if (queryCategory) {
            for (const category of categories) {
                if (category._id === queryCategory) {
                    console.log('category', category);
                    setSelectedCategory(category);
                    break;
                }
            }
        }
        if (queryLocation) {
            for (const province of provinces) {
                if (province.id === queryLocation) {
                    setSelectedLocation(province.name);
                    break;
                }
            }
        }

    }, [categories, levels, provinces]);

    const handleJobTypeChange = (checkedValues: string[]) => {
        setSelectedJobTypes(checkedValues);
    };

    const handleLevelChange = (checkedValues: string[]) => {
        setSelectedLevels(checkedValues);
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await getListJobByCandidate({
                    title,
                    mainCategory: selectedCategory,
                    level: selectedLevels,
                    location: selectedLocation,
                    jobType: selectedJobTypes,
                    skip: (currentPage - 1) * pageSize,
                    limit: pageSize,
                });
                setSearchResults(response.metadata.results);
                setTotal(response.metadata.totalCount);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [title, selectedCategory, selectedLevels, selectedLocation, selectedJobTypes, currentPage, pageSize]);

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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.searchWrapper}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24}>
                        <Input.Group compact>
                            <Input
                                style={styles.searchInput}
                                placeholder="Nhập vị trí công việc, công ty, kỹ năng..."
                                prefix={<SearchOutlined />}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onPressEnter={handleSearch}
                            />
                            <Button
                                className='button-hover'
                                type="primary"
                                style={styles.searchButton}
                                onClick={handleSearch}
                            >
                                Tìm kiếm
                            </Button>
                        </Input.Group>
                    </Col>
                    <Col xs={24} md={12}>
                        <Select
                            placeholder="Chọn ngành nghề"
                            style={styles.select}
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
                            style={styles.select}
                            suffixIcon={<EnvironmentOutlined />}
                            value={selectedLocation}
                            onChange={setSelectedLocation}
                        >
                            {provinces.map(province => (
                                <Select.Option key={province.id} value={province.name}>
                                    {province.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>



            <div style={styles.contentContainer}>
                <div style={styles.filterSidebar}>
                    <div style={styles.filterContainer}>
                        <div style={styles.filterHeader}>
                            <h3 style={styles.filterTitle}>Bộ Lọc</h3>
                            <span
                                style={styles.resetButton}
                                onClick={() => {
                                    setSelectedJobTypes([]);
                                    setSelectedLevels([]);
                                }}
                            >
                                Đặt lại
                            </span>
                        </div>

                        <div style={styles.filterSection}>
                            <div style={styles.filterSectionTitle}>Loại công việc</div>
                            <Checkbox.Group
                                style={styles.checkboxGroup}
                                value={selectedJobTypes}
                                onChange={handleJobTypeChange}
                            >
                                {JOB_TYPE_OPTIONS.map(({ value, label }) => (
                                    <Checkbox
                                        key={value}
                                        value={value}
                                        style={styles.checkboxLabel}
                                    >
                                        {label}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </div>

                        <div style={styles.filterSection}>
                            <div style={styles.filterSectionTitle}>Cấp bậc</div>
                            <Checkbox.Group
                                style={styles.checkboxGroup}
                                value={selectedLevels}
                                onChange={handleLevelChange}
                            >
                                {levels.map((level: any) => (
                                    <Checkbox
                                        key={level._id}
                                        value={level._id}
                                        style={styles.checkboxLabel}
                                    >
                                        {level.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>
                <div style={styles.mainContent}>
                    <div style={styles.resultsHeader}>
                        <Title level={4}>
                            {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${total} việc làm phù hợp`}
                        </Title>
                    </div>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <JobList jobs={searchResults} type="recent" />
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <Pagination
                                    current={currentPage}
                                    total={total}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger
                                    showTotal={(total) => `Tổng ${total} việc làm`}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobSearch;