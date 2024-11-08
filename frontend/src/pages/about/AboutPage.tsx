import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { motion } from 'framer-motion';
import {
    TeamOutlined,
    SearchOutlined,
    TrophyOutlined,
    UserOutlined,
    BulbOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';

import job from '../../assets/images/job.png';
import job2 from '../../assets/images/job2.png';
import job3 from '../../assets/images/job3.png';
import './AboutPage.css';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerChildren = {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const statistics = [
        { number: "1000+", label: "Công việc đã đăng" },
        { number: "500+", label: "Doanh nghiệp tin dùng" },
        { number: "10000+", label: "Ứng viên thành công" },
        { number: "95%", label: "Tỷ lệ hài lòng" }
    ];

    const values = [
        {
            icon: <SearchOutlined className="value-icon" />,
            title: "Kết nối thông minh",
            description: "Sử dụng công nghệ AI để kết nối ứng viên với công việc phù hợp nhất"
        },
        {
            icon: <TeamOutlined className="value-icon" />,
            title: "Cộng đồng vững mạnh",
            description: "Xây dựng mạng lưới kết nối giữa người tìm việc và nhà tuyển dụng"
        },
        {
            icon: <TrophyOutlined className="value-icon" />,
            title: "Chất lượng hàng đầu",
            description: "Cam kết mang đến những cơ hội việc làm chất lượng cao"
        }
    ];

    return (
        <motion.div
            className="about-container"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
        >
            {/* Hero Section */}
            <motion.div
                className="hero-section"
                variants={fadeInUpVariants}
                transition={{ duration: 0.8 }}
            >
                <div className="hero-image-container">
                    <img src={job} alt="About Hero" className="hero-image" />
                    <div className="hero-overlay">
                        <Title level={1} className="hero-title">Về JobFinder</Title>
                        <Paragraph className="hero-text">
                            Chúng tôi là cầu nối vững chắc giữa người tìm việc và nhà tuyển dụng,
                            mang đến những cơ hội việc làm tốt nhất cho cộng đồng.
                        </Paragraph>
                    </div>
                </div>
            </motion.div>

            {/* Statistics Section */}
            <Row gutter={[32, 32]} className="statistics-section">
                {statistics.map((stat, index) => (
                    <Col xs={12} md={6} key={index}>
                        <motion.div
                            className="statistic-card"
                            variants={fadeInUpVariants}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                        >
                            <Title level={2}>{stat.number}</Title>
                            <Paragraph>{stat.label}</Paragraph>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* Mission Section */}
            <motion.div
                className="mission-section"
                variants={fadeInUpVariants}
                transition={{ duration: 0.8 }}
            >
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={12}>
                        <div className="mission-content">
                            <Title level={2}>Sứ mệnh của chúng tôi</Title>
                            <Paragraph>
                                JobFinder ra đời với sứ mệnh đổi mới thị trường tuyển dụng Việt Nam
                                thông qua công nghệ. Chúng tôi tin rằng mỗi người đều xứng đáng có
                                được công việc phù hợp với đam mê và năng lực của mình.
                            </Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <motion.div
                            className="image-container"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={job2} alt="Our Mission" className="section-image" />
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>

            {/* Team Section */}
            <motion.div
                className="team-section"
                variants={fadeInUpVariants}
                transition={{ duration: 0.8 }}
            >
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={12}>
                        <motion.div
                            className="image-container"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={job3} alt="Our Team" className="section-image" />
                        </motion.div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="team-content">
                            <Title level={2}>Đội ngũ của chúng tôi</Title>
                            <Paragraph>
                                Đội ngũ JobFinder gồm những chuyên gia giàu kinh nghiệm trong lĩnh vực
                                tuyển dụng và công nghệ. Chúng tôi luôn nỗ lực không ngừng để mang đến
                                trải nghiệm tốt nhất cho cả ứng viên và nhà tuyển dụng.
                            </Paragraph>
                        </div>
                    </Col>
                </Row>
            </motion.div>

            {/* Values Section */}
            <Title level={2} className="section-title">Giá trị cốt lõi</Title>
            <Row gutter={[32, 32]}>
                {values.map((value, index) => (
                    <Col xs={24} md={8} key={index}>
                        <motion.div
                            variants={fadeInUpVariants}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                        >
                            <Card className="value-card">
                                {value.icon}
                                <Title level={3}>{value.title}</Title>
                                <Paragraph>{value.description}</Paragraph>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </motion.div>
    );
};

export default AboutPage; 