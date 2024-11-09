import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Radio, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getApplicationByUserCompany } from '../../services/api/applicationService';
import './Dashboard.css';
import { getCompanyJob } from '../../services/api/jobService';

const { Title } = Typography;

interface ApplicationData {
    date: string;
    count: number;
}

interface JobStats {
    name: string;
    value: number;
    color: string;
}

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
    const [chartData, setChartData] = useState<ApplicationData[]>([]);
    const [totalApplications, setTotalApplications] = useState(0);
    const [jobStats, setJobStats] = useState<JobStats[]>([]);
    const [totalJobs, setTotalJobs] = useState(0);

    useEffect(() => {
        fetchApplicationData();
    }, [timeRange]);

    const fetchApplicationData = async () => {
        try {
            setLoading(true);
            const response = await getApplicationByUserCompany();
            const applications = response.metadata;
            console.log('applications', applications);
            processChartData(filterApplicationsByTimeRange(applications));
            setTotalApplications(applications.length);
        } catch (error) {
            console.error('Error fetching application data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterApplicationsByTimeRange = (applications: any[]) => {
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case 'week':
                // Lấy ngày đầu tuần (Thứ 2)
                const day = now.getDay() || 7; // Chuyển Chủ nhật từ 0 thành 7
                startDate.setDate(now.getDate() - day + 1);
                break;
            case 'month':
                startDate.setDate(1);
                break;
            case 'year':
                startDate.setMonth(0, 1);
                break;
        }
        startDate.setHours(0, 0, 0, 0);

        return applications.filter((app: any) => {
            const appDate = new Date(app.createdAt);
            return appDate >= startDate && appDate <= now;
        });
    };

    const processChartData = (applications: any[]) => {
        const groupedData = applications.reduce((acc: any, curr: any) => {
            const date = new Date(curr.createdAt);
            let dateStr;

            switch (timeRange) {
                case 'week':
                    dateStr = getWeekDayName(date);
                    break;
                case 'month':
                    dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                    break;
                case 'year':
                    dateStr = `Tháng ${date.getMonth() + 1}`;
                    break;
            }

            acc[dateStr] = (acc[dateStr] || 0) + 1;
            return acc;
        }, {});

        const filledData = fillMissingDates(groupedData);
        const formattedData = formatDataForChart(filledData);
        setChartData(formattedData);
    };

    const getWeekDayName = (date: Date) => {
        const weekDays = [
            'Chủ nhật',
            'Thứ hai',
            'Thứ ba',
            'Thứ tư',
            'Thứ năm',
            'Thứ sáu',
            'Thứ bảy'
        ];
        return weekDays[date.getDay()];
    };

    const fillMissingDates = (groupedData: any) => {
        const result: { [key: string]: number } = {};
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case 'week': {
                const day = now.getDay() || 7;
                startDate.setDate(now.getDate() - day + 1);
                startDate.setHours(0, 0, 0, 0);

                const weekDays = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
                weekDays.forEach(day => {
                    result[day] = groupedData[day] || 0;
                });
                break;
            }
            case 'month': {
                startDate.setDate(1);
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

                for (let i = 1; i <= lastDay; i++) {
                    const dateStr = `${i.toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
                    result[dateStr] = groupedData[dateStr] || 0;
                }
                break;
            }
            case 'year': {
                for (let i = 1; i <= 12; i++) {
                    const monthStr = `Tháng ${i}`;
                    result[monthStr] = groupedData[monthStr] || 0;
                }
                break;
            }
        }

        return result;
    };

    const formatDataForChart = (data: { [key: string]: number }) => {
        return Object.entries(data).map(([date, count]) => ({
            date,
            count
        }));
    };



    useEffect(() => {
        fetchJobData();
    }, []);

    const fetchJobData = async () => {
        try {
            const response = await getCompanyJob();
            const jobs = response.metadata;

            const stats = [
                {
                    name: 'Đang tuyển',
                    value: jobs.filter((job: any) => job.status === 'published').length,
                    color: '#52c41a'
                },
                {
                    name: 'Nháp',
                    value: jobs.filter((job: any) => job.status === 'draft').length,
                    color: '#faad14'
                },
                {
                    name: 'Hết hạn',
                    value: jobs.filter((job: any) => job.status === 'expired').length,
                    color: '#ff4d4f'
                }
            ];

            setJobStats(stats);
            setTotalJobs(jobs.length);
        } catch (error) {
            console.error('Error fetching job data:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <Title level={2}>Thống kê đơn ứng tuyển</Title>
            <Row gutter={16} className="stats-row">
                <Col xs={24} sm={8}>
                    <Card
                        title="Tổng đơn ứng tuyển"
                        bordered={false}
                        className="stats-card"
                        headStyle={{ textAlign: 'center' }}
                    >
                        <span className="stats-number">{totalApplications}</span>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card
                        title="Tổng tin tuyển dụng"
                        bordered={false}
                        className="stats-card"
                        headStyle={{ textAlign: 'center' }}
                    >
                        <span className="stats-number">{totalJobs}</span>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24}>
                    <Card
                        title="Biểu đồ đơn ứng tuyển"
                        className="chart-card"
                        extra={
                            <Radio.Group
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="radio-group"
                            >
                                <Radio.Button value="week">Tuần này</Radio.Button>
                                <Radio.Button value="month">Tháng này</Radio.Button>
                                <Radio.Button value="year">Năm nay</Radio.Button>
                            </Radio.Group>
                        }
                    >
                        {loading ? (
                            <div className="loading-container">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            interval={0}
                                            angle={timeRange === 'month' ? -45 : 0}
                                            textAnchor={timeRange === 'month' ? 'end' : 'middle'}
                                            height={60}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                            contentStyle={{
                                                background: '#fff',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '10px'
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="count"
                                            name="Số đơn ứng tuyển"
                                            fill="#1890ff"
                                            radius={[4, 4, 0, 0]} // Bo góc trên của cột
                                            maxBarSize={50} // Giới hạn độ rộng tối đa của cột
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card title="Thống kê tin tuyển dụng" className="chart-card">
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={jobStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {jobStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [`${value} tin`, 'Số lượng']}
                                        contentStyle={{
                                            background: '#fff',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '10px'
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value: string) => {
                                            const item = jobStats.find(stat => stat.name === value);
                                            return `${value}: ${item?.value || 0} tin`;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
