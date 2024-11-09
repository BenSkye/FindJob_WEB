import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, BellOutlined, LogoutOutlined, LockFilled, FileTextOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '../../config/theme';
import logo from '../../assets/images/ME.png';
import { useAuth } from '../../hooks/useAuth';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    userType?: 'candidate' | 'employer';
}

interface User {
    name: string;
    email: string;
    avatar?: string;
}



const Header: React.FC<HeaderProps> = ({ userType }) => {
    const navigate = useNavigate();
    const [activeMenuItem, setActiveMenuItem] = useState<string>('');
    const { user, logout } = useAuth();

    useEffect(() => {

    }, [user]);

    const handleLogout = async () => {
        if (user?.roles.includes('employer')) {
            await logout();
            console.log('navigate to login');
            navigate('/login');
        } else {
            await logout();
            navigate('/');
        }
    };

    const handleMenuClick = (key: string) => {
        setActiveMenuItem(key);
        navigate(`/${key}`);
    };

    const userMenu = (
        <Menu
            items={[
                {
                    key: 'profile',
                    label: 'Thông tin cá nhân',
                    icon: <UserOutlined />,
                    onClick: () => navigate('/profile')
                },
                {
                    key: 'personal-applications',
                    label: 'Ứng tuyển của tôi',
                    icon: <FileTextOutlined />,
                    onClick: () => navigate('/personal-applications')
                },
                {
                    key: 'profile-cv',
                    label: 'Hồ sơ và CV',
                    icon: <FileTextOutlined />,
                    onClick: () => navigate(`/cv-profile`)
                },
                {
                    key: 'change-password',
                    label: 'Đổi mật khẩu',
                    icon: <LockFilled />,
                    onClick: () => navigate('/change-password')
                },
                {
                    key: 'logout',
                    label: 'Đăng xuất',
                    icon: <LogoutOutlined />,
                    onClick: handleLogout
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

                <Menu mode="horizontal" style={styles.menu}>
                    <Menu.Item
                        key="home"
                        style={activeMenuItem === 'home' ? { ...styles.menuItem, ...styles.menuItemHover } : styles.menuItem}
                        onClick={() => handleMenuClick('')}
                    >
                        Trang chủ
                    </Menu.Item>
                    <Menu.Item
                        key="jobs"
                        style={activeMenuItem === 'jobs' ? { ...styles.menuItem, ...styles.menuItemHover } : styles.menuItem}
                        onClick={() => handleMenuClick('job-search')}
                    >
                        Việc Làm
                    </Menu.Item>
                    <Menu.Item
                        key="about"
                        style={activeMenuItem === 'about' ? { ...styles.menuItem, ...styles.menuItemHover } : styles.menuItem}
                        onClick={() => handleMenuClick('about')}
                    >
                        Giới thiệu
                    </Menu.Item>
                    <Menu.Item
                        key="profile-cv"
                        style={activeMenuItem === 'profile-cv' ? { ...styles.menuItem, ...styles.menuItemHover } : styles.menuItem}
                        onClick={() => handleMenuClick('template')}
                    >
                        Hồ sơ và CV
                    </Menu.Item>
                </Menu>

                {!user ? (
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
                                <Avatar
                                    src={user.avatar}
                                    icon={<UserOutlined />}
                                    style={styles.avatar}
                                />
                                <span>{user.name}</span>
                            </div>
                        </Dropdown>
                    </div>
                )}
            </div>
        </AntHeader>
    );
};

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
    },
    menuItem: {
        transition: 'all 0.3s',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: colors.brand.primary.contrast,
        borderBottom: '2px solid transparent',
    },
    menuItemHover: {
        color: colors.brand.primary.contrast,
        backgroundColor: 'black',
        borderBottom: `2px solid ${colors.brand.primary.contrast}`,
    },
    menu: {
        flex: 1,
        justifyContent: 'center',
        display: 'flex',
        gap: '24px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.brand.primary.contrast,
        backgroundColor: 'transparent',
        // borderBottom: 'none',  // Thêm dòng này để loại bỏ border mặc định của Menu
    },
}

export default Header;