import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const { Title } = Typography;

// Sample data for charts
const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const lineData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
    return (
        <div>
            <Title level={2}>Employer Dashboard</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Total Candidates" bordered={false}>
                        120
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Active Jobs" bordered={false}>
                        45
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Teams" bordered={false}>
                        10
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="Candidates Distribution" bordered={false}>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={pieData}
                                cx={200}
                                cy={200}
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Monthly Activity" bordered={false}>
                        <LineChart
                            width={500}
                            height={300}
                            data={lineData}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
