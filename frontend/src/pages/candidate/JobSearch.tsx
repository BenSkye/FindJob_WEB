import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Input, Select, Button, Spin } from 'antd';
import { SearchOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import JobList from '../../components/candidate/JobList';
import { Job } from '../../services/types/job.types';
import { getListJobByCandidate } from '../../services/api/jobService';
import { getListLevel } from '../../services/api/levelService';
import { getListCategory } from '../../services/api/categoryService';
import { Province } from '../../services/types/province.type';
import { fetchProvinces } from '../../services/api/districtWardService';

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
};

const JobSearch: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    // States
    const [title, setTitle] = useState<string>();
    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedLevels, setSelectedLevels] = useState<string>();
    const [selectedLocation, setSelectedLocation] = useState<any>();
    const [searchResults, setSearchResults] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [provinces, setProvinces] = useState<Province[]>([]);

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
        const queryLevel = queryParams.get('level');
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
        if (queryLevel) {
            for (const level of levels) {
                if (level._id === queryLevel) {
                    setSelectedLevels(level);
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

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await getListJobByCandidate({
                    title,
                    mainCategory: selectedCategory,
                    level: selectedLevels,
                    location: selectedLocation,
                });
                setSearchResults(response.metadata);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [title, selectedCategory, selectedLevels, selectedLocation]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (title) params.set('title', title);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedLevels) params.set('level', selectedLevels);
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
                    <Col xs={24} md={8}>
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
                    <Col xs={24} md={8}>
                        <Select
                            placeholder="Chọn cấp bậc"
                            style={{ width: '100%', height: '50px' }}
                            value={selectedLevels?.name}
                            onChange={setSelectedLevels}
                            maxTagCount={2}
                        >
                            {levels.map((level: any) => (
                                <Select.Option key={level._id} value={level._id}>
                                    {level.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            placeholder="Chọn địa điểm"
                            style={{ width: '100%', height: '50px' }}
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