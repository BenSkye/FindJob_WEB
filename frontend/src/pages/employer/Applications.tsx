import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Typography, Modal, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import * as applicationApi from '../../services/api/applicationService';
import { Application } from '../../services/types/applications.types';
import dayjs from 'dayjs';
import './Applications.css';

const { Title, Text } = Typography;

const Applications: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState<string>('');
    const [data, setData] = useState<Application[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await applicationApi.getEmployerApplications();
            if (response.error) {
                message.error(response.error);
                return;
            }
            setData(response.metadata || []);
        } catch (error) {
            message.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (record: Application, newStatus: 'approved' | 'rejected') => {
        try {
            setUpdateLoading(record._id);
            const response = await applicationApi.updateApplicationStatus(record._id, { status: newStatus });
            if (response.error) {
                message.error(response.error);
                return;
            }
            message.success(`Application ${newStatus} successfully`);
            await fetchApplications();
        } catch (error) {
            message.error('Failed to update application status');
        } finally {
            setUpdateLoading('');
        }
    };

    const showModal = (record: Application) => {
        setSelectedApplication(record);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedApplication(null);
    };

    const columns = [
        {
            title: 'Candidate',
            dataIndex: ['candidateId'],
            key: 'candidate',
            render: (candidate: Application['candidateId']) => (
                <div>
                    <div>{`${candidate.firstName} ${candidate.lastName}`}</div>
                    <Text type="secondary">{candidate.email}</Text>
                </div>
            ),
        },
        {
            title: 'Position',
            dataIndex: ['jobId'],
            key: 'position',
            render: (job: Application['jobId']) => (
                <div>
                    <div>{job.title}</div>
                    <Text type="secondary">{job.location}</Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Approved', value: 'approved' },
                { text: 'Rejected', value: 'rejected' },
            ],
            onFilter: (value: string, record: Application) => record.status === value,
            render: (status: string) => {
                const colorMap = {
                    pending: 'geekblue',
                    approved: 'green',
                    rejected: 'volcano',
                };
                return (
                    <Tag color={colorMap[status as keyof typeof colorMap]}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Applied Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: Application, b: Application) =>
                dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Application) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleStatusUpdate(record, 'approved')}
                        disabled={record.status === 'approved' || updateLoading === record._id}
                        loading={updateLoading === record._id}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleStatusUpdate(record, 'rejected')}
                        disabled={record.status === 'rejected' || updateLoading === record._id}
                        loading={updateLoading === record._id}
                    >
                        Reject
                    </Button>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => showModal(record)}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="applications-container">
            <Title level={2}>Manage Applications</Title>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="_id"
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} applications`,
                }}
            />

            <Modal
                title="Application Details"
                open={isModalVisible}
                onOk={handleCloseModal}
                onCancel={handleCloseModal}
                width={700}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>
                ]}
            >
                {selectedApplication && (
                    <div className="application-details">
                        <div className="detail-section">
                            <Title level={4}>Candidate Information</Title>
                            <p><strong>Name:</strong> {`${selectedApplication.candidateId.firstName} ${selectedApplication.candidateId.lastName}`}</p>
                            <p><strong>Email:</strong> {selectedApplication.candidateId.email}</p>
                            <p><strong>Phone:</strong> {selectedApplication.candidateId.phone}</p>
                        </div>

                        <div className="detail-section">
                            <Title level={4}>Job Information</Title>
                            <p><strong>Position:</strong> {selectedApplication.jobId.title}</p>
                            <p><strong>Location:</strong> {selectedApplication.jobId.location}</p>
                            <p><strong>Salary:</strong> {selectedApplication.jobId.salary}</p>
                        </div>

                        <div className="detail-section">
                            <Title level={4}>Application Details</Title>
                            <p><strong>Status:</strong> {selectedApplication.status.toUpperCase()}</p>
                            <p><strong>Applied Date:</strong> {dayjs(selectedApplication.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                            <p><strong>Cover Letter:</strong></p>
                            <div className="cover-letter">{selectedApplication.coverLetter}</div>
                            {selectedApplication.resume && (
                                <Button type="link" href={selectedApplication.resume} target="_blank">
                                    View Resume
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Applications;
