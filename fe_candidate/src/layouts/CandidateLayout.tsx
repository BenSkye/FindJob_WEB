import React from 'react';
import { Layout } from 'antd';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Notification from '../components/common/Notification';

const { Content } = Layout;

interface CandidateLayoutProps {
    children: React.ReactNode;
}

const CandidateLayout: React.FC<CandidateLayoutProps> = ({ children }) => {
    return (
        <Layout className="min-h-screen">
            <Header userType="candidate" />
            <Content className="container mx-auto py-6">
                <div className="flex-between mb-4">
                    <h2>Xin chào, [Tên ứng viên]</h2>
                    <Notification />
                </div>
                {children}
            </Content>
            <Footer />
        </Layout>
    );
};

export default CandidateLayout;