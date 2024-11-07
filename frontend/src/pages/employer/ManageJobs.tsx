import React, { useState } from 'react';
import { Table, Button, Space, Typography, Modal, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface Job {
    key: string;
    title: string;
    location: string;
    type: string;
    status: string;
}

const initialJobs: Job[] = [
    {
        key: '1',
        title: 'Software Engineer',
        location: 'New York',
        type: 'Full-time',
        status: 'Open',
    },
    {
        key: '2',
        title: 'Product Manager',
        location: 'San Francisco',
        type: 'Part-time',
        status: 'Closed',
    },
    {
        key: '3',
        title: 'UX Designer',
        location: 'Remote',
        type: 'Contract',
        status: 'Open',
    },
];

const ManageJobs: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const showEditModal = (job: Job) => {
        setSelectedJob(job);
        setIsModalVisible(true);
    };

    const handleDelete = (key: string) => {
        setJobs(jobs.filter(job => job.key !== key));
    };

    const handleOk = (values: any) => {
        if (selectedJob) {
            setJobs(jobs.map(job => (job.key === selectedJob.key ? { ...job, ...values } : job)));
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Job Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Job) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Manage Jobs</Title>
            <Table columns={columns} dataSource={jobs} />

            <Modal
                title="Edit Job"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedJob && (
                    <Form
                        initialValues={selectedJob}
                        onFinish={handleOk}
                        layout="vertical"
                    >
                        <Form.Item
                            name="title"
                            label="Job Title"
                            rules={[{ required: true, message: 'Please enter the job title' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter the location' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Job Type"
                            rules={[{ required: true, message: 'Please select the job type' }]}
                        >
                            <Select>
                                <Option value="Full-time">Full-time</Option>
                                <Option value="Part-time">Part-time</Option>
                                <Option value="Contract">Contract</Option>
                                <Option value="Internship">Internship</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select the status' }]}
                        >
                            <Select>
                                <Option value="Open">Open</Option>
                                <Option value="Closed">Closed</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default ManageJobs;
