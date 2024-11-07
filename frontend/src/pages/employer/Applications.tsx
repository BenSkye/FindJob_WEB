import React, { useState } from 'react';
import { Table, Tag, Space, Button, Typography, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Application {
    key: string;
    name: string;
    position: string;
    status: string;
    date: string;
}

const initialData: Application[] = [
    {
        key: '1',
        name: 'John Doe',
        position: 'Software Engineer',
        status: 'Pending',
        date: '2023-10-01',
    },
    {
        key: '2',
        name: 'Jane Smith',
        position: 'Product Manager',
        status: 'Approved',
        date: '2023-09-15',
    },
    {
        key: '3',
        name: 'Alice Johnson',
        position: 'UX Designer',
        status: 'Rejected',
        date: '2023-09-20',
    },
];

const Applications: React.FC = () => {
    const [data, setData] = useState<Application[]>(initialData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    const handleApprove = (record: Application) => {
        setData(prevData =>
            prevData.map(item =>
                item.key === record.key ? { ...item, status: 'Approved' } : item
            )
        );
    };

    const handleReject = (record: Application) => {
        setData(prevData =>
            prevData.map(item =>
                item.key === record.key ? { ...item, status: 'Rejected' } : item
            )
        );
    };

    const showModal = (record: Application) => {
        setSelectedApplication(record);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'geekblue';
                if (status === 'Approved') {
                    color = 'green';
                } else if (status === 'Rejected') {
                    color = 'volcano';
                }
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Application) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(record)}
                        disabled={record.status === 'Approved'}
                    >
                        Approve
                    </Button>
                    <Button
                        type="danger"
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleReject(record)}
                        disabled={record.status === 'Rejected'}
                    >
                        Reject
                    </Button>
                    <Button onClick={() => showModal(record)}>View</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Manage Applications</Title>
            <Table columns={columns} dataSource={data} />

            <Modal
                title="Application Details"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {selectedApplication && (
                    <div>
                        <p><strong>Name:</strong> {selectedApplication.name}</p>
                        <p><strong>Position:</strong> {selectedApplication.position}</p>
                        <p><strong>Status:</strong> {selectedApplication.status}</p>
                        <p><strong>Date:</strong> {selectedApplication.date}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Applications;
