import React from 'react';
import { Layout } from 'antd';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';
import { colors } from '../config/theme';

const { Content } = Layout;

const styles: { [key: string]: React.CSSProperties } = {
    layout: {
        minHeight: '100vh',
        backgroundColor: colors.background.default
    },
    content: {
        // maxWidth: '1200px',
        margin: 'auto 10rem',
        padding: '24px 16px'
    },
    contentWrapper: {
        backgroundColor: colors.background.paper,
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '24px'
    }
};

const MainLayout: React.FC = () => {
    return (
        <Layout style={styles.layout}>
            <Header />
            <Content style={styles.content}>
                <div style={styles.contentWrapper}>
                    <Outlet />
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default MainLayout;