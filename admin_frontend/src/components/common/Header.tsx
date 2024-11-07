import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '../../config/theme';
import logo from '../../assets/images/ME.png';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    userType?: 'admin';
}

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        background: colors.gradients.primary.main,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: 0,
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px'
    },
    logoWrapper: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        padding: '8px 0'
    },
    logo: {
        height: '48px',
        width: 'auto',
        objectFit: 'contain',
        // filter: 'brightness(0) invert(1)'
    },
    authSection: {
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
    },
    loginButton: {
        backgroundColor: 'transparent',
        borderColor: colors.brand.primary.contrast,
        color: colors.brand.primary.contrast
    },
    registerButton: {
        backgroundColor: colors.brand.primary.contrast,
        color: colors.brand.primary.main,
        border: 'none'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    bellIcon: {
        fontSize: '20px',
        color: colors.brand.primary.contrast,
        cursor: 'pointer'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        color: colors.brand.primary.contrast
    },
    avatar: {
        backgroundColor: colors.brand.primary.contrast,
        color: colors.brand.primary.main
    }
};

const Header: React.FC<HeaderProps> = ({ userType }) => {
    const navigate = useNavigate();

    const userMenu = (
        <Menu
            items={[
                {
                    key: 'profile',
                    label: 'Thông tin cá nhân',
                    icon: <UserOutlined />,
                    onClick: () => navigate(`/${userType}/profile`)
                },
                {
                    key: 'logout',
                    label: 'Đăng xuất',
                    icon: <LogoutOutlined />,
                    onClick: () => navigate('/')
                },
            ]}
        />
    );

    return (
        <AntHeader style={styles.header}>
            <div style={styles.container}>
                <Link to="/" style={styles.logoWrapper} className='button-hover'>
                    <img src={logo} alt="Logo" style={styles.logo} />
                </Link>

                {!userType ? (
                    <div style={styles.authSection}>
                        <Button
                            className='button-hover'
                            style={styles.loginButton}
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            className='button-hover'
                            style={styles.registerButton}
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký
                        </Button>
                    </div>
                ) : (
                    <div style={styles.userSection}>
                        <BellOutlined style={styles.bellIcon} />
                        <Dropdown overlay={userMenu} placement="bottomRight">
                            <div style={styles.userInfo}>
                                <Avatar icon={<UserOutlined />} style={styles.avatar} />
                                <span>Tên người dùng</span>
                            </div>
                        </Dropdown>
                    </div>
                )}
            </div>
        </AntHeader>
    );
};

export default Header;