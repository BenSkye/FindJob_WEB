import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    InstagramOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { colors } from '../../config/theme';
import logo from '../../assets/images/ME.png';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const styles: { [key: string]: React.CSSProperties } = {
    footer: {
        background: colors.gradients.dark,
        padding: '64px 0 32px',
        color: colors.text.inverse
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
    },
    logoSection: {
        marginBottom: '24px'
    },
    logo: {
        height: '48px',
        width: 'auto',
        // filter: 'brightness(0) invert(1)',
        marginBottom: '16px'
    },
    description: {
        color: `${colors.text.inverse}cc`
    },
    socialLinks: {
        marginTop: '24px'
    },
    socialIcon: {
        fontSize: '24px',
        color: `${colors.text.inverse}cc`,
        cursor: 'pointer'
    },
    sectionTitle: {
        color: colors.text.inverse,
        marginBottom: '24px'
    },
    linkList: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    linkItem: {
        marginBottom: '16px'
    },
    link: {
        color: `${colors.text.inverse}cc`,
        textDecoration: 'none'
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        color: `${colors.text.inverse}cc`
    },
    contactIcon: {
        color: colors.brand.primary.main
    },
    divider: {
        backgroundColor: `${colors.text.inverse}1a`,
        margin: '32px 0'
    },
    bottomSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: `${colors.text.inverse}cc`
    },
    bottomLinks: {
        display: 'flex',
        gap: '24px'
    }
};

const Footer: React.FC = () => {
    const quickLinks = [
        { label: 'Về chúng tôi', href: '/about' },
        { label: 'Tìm việc làm', href: '/jobs' },
        { label: 'Nhà tuyển dụng', href: '/employers' },
        { label: 'Bảng giá', href: '/pricing' },
        { label: 'Blog', href: '/blog' },
        { label: 'Liên hệ', href: '/contact' },
        { label: 'Điều khoản', href: '/terms' },
        { label: 'Bảo mật', href: '/privacy' }
    ];

    const socialLinks = [
        { icon: <FacebookOutlined />, href: 'https://facebook.com' },
        { icon: <TwitterOutlined />, href: 'https://twitter.com' },
        { icon: <LinkedinOutlined />, href: 'https://linkedin.com' },
        { icon: <InstagramOutlined />, href: 'https://instagram.com' }
    ];

    const contactInfo = [
        { icon: <PhoneOutlined />, text: '0909090909' },
        { icon: <MailOutlined />, text: 'nhatdm9a7@gmail.com' },
        { icon: <EnvironmentOutlined />, text: '123 Đường ABC, Quận XYZ, TP.HCM' }
    ];

    return (
        <AntFooter style={styles.footer}>
            <div style={styles.container}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div style={styles.logoSection}>
                            <Col>
                                <img src={logo} alt="Logo" style={styles.logo} />
                            </Col>
                            <Col>
                                <Text style={styles.description}>
                                    Nền tảng kết nối ứng viên và nhà tuyển dụng hàng đầu.
                                    Chúng tôi giúp ứng viên tìm được công việc phù hợp và
                                    hỗ trợ doanh nghiệp tìm kiếm nhân tài.
                                </Text>
                            </Col>
                        </div>
                        <Space size="large" style={styles.socialLinks}>
                            {socialLinks.map((link, index) => (
                                <Link key={index} href={link.href} target="_blank" style={styles.socialIcon}>
                                    {link.icon}
                                </Link>
                            ))}
                        </Space>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Title level={4} style={styles.sectionTitle}>Liên kết nhanh</Title>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ul style={styles.linkList}>
                                    {quickLinks.slice(0, 4).map((link, index) => (
                                        <li key={index} style={styles.linkItem}>
                                            <Link href={link.href} style={styles.link}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                            <Col span={12}>
                                <ul style={styles.linkList}>
                                    {quickLinks.slice(4).map((link, index) => (
                                        <li key={index} style={styles.linkItem}>
                                            <Link href={link.href} style={styles.link}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Title level={4} style={styles.sectionTitle}>Liên hệ</Title>
                        {contactInfo.map((item, index) => (
                            <div key={index} style={styles.contactItem}>
                                <span style={styles.contactIcon}>{item.icon}</span>
                                <Text style={styles.description}>{item.text}</Text>
                            </div>
                        ))}
                    </Col>
                </Row>

                <Divider style={styles.divider} />

                <div style={styles.bottomSection}>
                    <Text style={styles.description}>
                        © {new Date().getFullYear()} Job Portal. All rights reserved.
                    </Text>
                    <Space split={<Divider type="vertical" style={{ backgroundColor: `${colors.text.inverse}1a` }} />}>
                        {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Cookies'].map((text, index) => (
                            <Link key={index} href="#" style={styles.link}>
                                {text}
                            </Link>
                        ))}
                    </Space>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;