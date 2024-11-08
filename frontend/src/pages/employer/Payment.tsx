import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Tag, Typography, Spin } from 'antd';
import { getPersonalJobHasPay } from '../../services/api/jobService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { useSubscription } from '../../hooks/useSubscription';
import { getPersonalSubcriptions } from '../../services/api/subscriptionService';

const { TabPane } = Tabs;
const { Title } = Typography;

const styles = {
    container: {
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
    pageTitle: {
        marginBottom: '24px',
        color: '#1890ff',
    },
    tabContent: {
        marginTop: '16px',
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    tag: {
        borderRadius: '4px',
        padding: '0 8px',
    },
    statusTag: {
        minWidth: '100px',
        textAlign: 'center' as const,
    },
}

const Payment = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [paidJobs, setPaidJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [jobsRes, subcriptionRes] = await Promise.all([
                getPersonalJobHasPay(),
                getPersonalSubcriptions()
            ]);
            console.log('subcription', subcriptionRes);
            setSubscriptions(subcriptionRes.metadata.history);
            setPaidJobs(jobsRes.metadata);
        } catch (error) {
            console.error('Error fetching payment data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('subscriptions', subscriptions);
    }, [subscriptions]);

    useEffect(() => {
        console.log('paidJobs', paidJobs);
    }, [paidJobs]);


    const subscriptionColumns = [
        {
            title: 'Mã thanh toán',
            dataIndex: ['paymentId', '_id'],
            key: 'paymentId',
        },
        {
            title: 'Giá tiền',
            dataIndex: ['paymentId', 'amount'],
            key: 'amount',
            render: (amount: number) => formatCurrency(amount),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date: string) => formatDateTime.dateOnly(date),
        },
    ];

    const jobColumns = [
        {
            title: 'Mã bài đăng',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Giá tiền',
            dataIndex: ['paymentId', 'amount'],
            key: 'amount',
            render: (amount: number) => formatCurrency(amount),
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => formatDateTime.dateOnly(date),
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status: string) => (
        //         <Tag color={status === 'active' ? 'success' : 'default'}>
        //             {status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
        //         </Tag>
        //     ),
        // },
    ];

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Card>
                <Title level={3} style={styles.pageTitle}>
                    Lịch sử thanh toán
                </Title>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Gói đăng tin" key="1">
                        <Table
                            columns={subscriptionColumns}
                            dataSource={subscriptions}
                            rowKey="_id"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Tổng ${total} giao dịch`,
                            }}
                        />
                    </TabPane>
                    <TabPane tab="Bài đăng đã thanh toán" key="2">
                        <Table
                            columns={jobColumns}
                            dataSource={paidJobs}
                            rowKey="_id"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Tổng ${total} bài đăng`,
                            }}
                        />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default Payment;