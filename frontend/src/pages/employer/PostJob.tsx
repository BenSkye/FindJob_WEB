import React from 'react';
import { Form, Input, Button, Card, Typography, Select, DatePicker } from 'antd';
import './PostJob.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PostJob: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Job Details:', values);
        // Here you would typically send the job details to your backend API
    };

    return (
        <div className="post-job-container">
            <Card className="post-job-card">
                <Title level={2}>Post a New Job</Title>
                <Form
                    name="post-job"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="title"
                        label="Job Title"
                        rules={[{ required: true, message: 'Please enter the job title' }]}
                    >
                        <Input placeholder="Enter job title" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Job Description"
                        rules={[{ required: true, message: 'Please enter the job description' }]}
                    >
                        <TextArea rows={4} placeholder="Enter job description" />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please enter the job location' }]}
                    >
                        <Input placeholder="Enter location" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Job Type"
                        rules={[{ required: true, message: 'Please select the job type' }]}
                    >
                        <Select placeholder="Select job type">
                            <Option value="full-time">Full-time</Option>
                            <Option value="part-time">Part-time</Option>
                            <Option value="contract">Contract</Option>
                            <Option value="internship">Internship</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="salary"
                        label="Salary"
                        rules={[{ required: true, message: 'Please enter the salary' }]}
                    >
                        <Input placeholder="Enter salary" />
                    </Form.Item>

                    <Form.Item
                        name="deadline"
                        label="Application Deadline"
                        rules={[{ required: true, message: 'Please select the application deadline' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Post Job
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PostJob;
