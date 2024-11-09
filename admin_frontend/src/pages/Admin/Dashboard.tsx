import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined, RiseOutlined, DollarOutlined, AppstoreOutlined, AuditOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminGetUserStats } from "../../services/api/userApi";
import { adminGetPaymentStats } from "../../services/api/paymentApi";
import { getSubscriptionStats } from "../../services/api/subscriptionApi";
import { UserStats, PaymentStats, JobStats, SubscriptionStats } from '../../services/types/stats.types';
import { formatCurrency } from '../../utils/format';
import { getJobStats } from '../../services/api/jobApi';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
    const [jobStats, setJobStats] = useState<JobStats | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userStatsResponse, paymentStatsResponse, subscriptionStatsResponse, jobStatsResponse] = await Promise.all([
                    adminGetUserStats(),
                    adminGetPaymentStats(),
                    getSubscriptionStats(),
                    getJobStats()
                ]);

                // Kiểm tra dữ liệu trước khi log
                if (jobStatsResponse?.metadata?.metadata) {
                    console.log('====================================');
                    console.log("Job", jobStatsResponse.metadata.metadata);
                    console.log('====================================');
                }

                setStats(userStatsResponse.metadata);
                setPaymentStats(paymentStatsResponse.metadata);
                setSubscriptionStats(subscriptionStatsResponse.metadata);
                setJobStats(jobStatsResponse?.metadata?.metadata || null);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const prepareChartData = () => {
        if (!paymentStats) return [];

        return paymentStats.dailyStats.map(stat => ({
            date: formatDate(stat.date),
            'Doanh thu': stat.totalAmount,
            'Số giao dịch': stat.totalPayments
        }));
    };

    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>{`Ngày: ${label}`}</p>
                    {payload.map((pld: any, index: number) => (
                        <p key={index} style={{ margin: '5px 0', color: pld.color }}>
                            {`${pld.name}: ${pld.name === 'Doanh thu'
                                ? formatCurrency(pld.value)
                                : pld.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard">
            <h2 style={{ marginBottom: 24 }}>Thống kê người dùng</h2>

            {/* Thống kê Ứng viên */}
            <h3 style={{ marginBottom: 16 }}>Ứng viên</h3>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng số ứng viên"
                            value={stats.candidates.total}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Mới hôm nay"
                            value={stats.candidates.newToday}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Mới trong tuần"
                            value={stats.candidates.newThisWeek}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Mới trong tháng"
                            value={stats.candidates.newThisMonth}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Thống kê Nhà tuyển dụng */}
            <h3 style={{ margin: '24px 0 16px' }}>Nhà tuyển dụng</h3>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng số nhà tuyển dụng"
                            value={stats.employers.total}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Mới hôm nay"
                            value={stats.employers.newToday}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Mới trong tuần"
                            value={stats.employers.newThisWeek}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Mới trong tháng"
                            value={stats.employers.newThisMonth}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Thống kê Thanh toán */}
            <h3 style={{ margin: '24px 0 16px' }}>Thống kê thanh toán</h3>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu hôm nay"
                            value={paymentStats.today.totalAmount}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <div style={{ fontSize: '12px', marginTop: '8px' }}>
                            Số giao dịch: {paymentStats.today.totalPayments}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu tuần này"
                            value={paymentStats.thisWeek.totalAmount}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <div style={{ fontSize: '12px', marginTop: '8px' }}>
                            Số giao dịch: {paymentStats.thisWeek.totalPayments}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu tháng này"
                            value={paymentStats.thisMonth.totalAmount}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <div style={{ fontSize: '12px', marginTop: '8px' }}>
                            Số giao dịch: {paymentStats.thisMonth.totalPayments}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ thống kê thanh toán */}
            <Card style={{ marginTop: 16 }}>
                <h4>Biểu đồ thống kê thanh toán theo ngày</h4>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={prepareChartData()}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 10
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="left"
                                tickFormatter={formatYAxis}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickFormatter={formatYAxis}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="Doanh thu"
                                stroke="#8884d8"
                                dot={false}
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="Số giao dịch"
                                stroke="#82ca9d"
                                dot={false}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Thống kê Subscription */}
            <h3 style={{ margin: '24px 0 16px' }}>Thống kê gói đăng ký</h3>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Gói đăng ký hôm nay"
                            value={subscriptionStats?.daily[subscriptionStats.daily.length - 1]?.count || 0}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Gói đăng ký tuần này"
                            value={subscriptionStats?.weekly[0]?.count || 0}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Gói đăng ký tháng này"
                            value={subscriptionStats?.monthly[0]?.count || 0}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ subscription */}
            <Card style={{ marginTop: 16 }}>
                <h4>Biểu đồ thống kê subscription theo ngày</h4>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={subscriptionStats?.daily.map(stat => ({
                                date: formatDate(`${stat._id.year}-${stat._id.month}-${stat._id.day}`),
                                'Số subscription': stat.count
                            })) || []}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 10
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Số subscription"
                                stroke="#1890ff"
                                dot={false}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {jobStats && (
                <>
                    <h3 style={{ margin: '24px 0 16px' }}>Thống kê việc làm</h3>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Tổng số việc làm trong năm"
                                    value={jobStats?.jobStatistics?.[0]?.totalJobsInYear ?? 0}
                                    prefix={<AuditOutlined />}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Việc làm tháng này"
                                    value={jobStats?.jobStatistics?.[0]?.monthlyStats?.[0]?.totalJobsInMonth ?? 0}
                                    prefix={<AuditOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Trung bình ứng tuyển/việc làm"
                                    value={jobStats?.averageApplicationsPerJob ?? 0}
                                    prefix={<TeamOutlined />}
                                    valueStyle={{ color: '#722ed1' }}
                                    precision={1}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Top danh mục việc làm */}
                    {jobStats.topCategories && jobStats.topCategories.length > 0 && (
                        <Card style={{ marginTop: 16 }}>
                            <h4>Top danh mục việc làm</h4>
                            <Row gutter={[16, 16]}>
                                {jobStats.topCategories.map((category, index) => (
                                    <Col xs={24} sm={12} md={6} key={index}>
                                        <Card>
                                            <Statistic
                                                title={category.categoryName}
                                                value={category.jobCount}
                                                prefix={<AppstoreOutlined />}
                                                valueStyle={{ color: ['#3f8600', '#1890ff', '#722ed1', '#faad14'][index] }}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    )}

                    {/* Biểu đồ việc làm theo ngày */}
                    {jobStats.jobStatistics?.[0]?.monthlyStats?.[0]?.dailyStats && (
                        <Card style={{ marginTop: 16 }}>
                            <h4>Biểu đồ thống kê việc làm theo ngày</h4>
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={jobStats.jobStatistics[0].monthlyStats[0].dailyStats.map(stat => ({
                                            date: `${stat.day}/${jobStats.jobStatistics[0].monthlyStats[0].month}`,
                                            'Số việc làm': stat.count
                                        }))}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 10
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="Số việc làm"
                                            stroke="#1890ff"
                                            dot={false}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};



export default Dashboard;