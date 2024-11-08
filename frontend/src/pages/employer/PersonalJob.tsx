import React, { useState, useEffect } from 'react';
import { Tabs, Card, Table, Tag, Button, message, Spin, Modal } from 'antd';
import { EditOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getPersonalJob, getCompanyJob, publishJobWhenActiveSubscription } from '../../services/api/jobService';
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS, JOB_TYPE_LABELS } from '../../config';
import { formatCurrency } from '../../utils/formatters';
import { useSubscription } from '../../hooks/useSubscription';

const { TabPane } = Tabs;

const SubscriptionModal = ({ visible, onCancel, onSubscribe }: { visible: boolean, onCancel: () => void, onSubscribe: (type: string) => void }) => (
    <Modal
        title="Yêu cầu gói đăng tin"
        visible={visible}
        onCancel={onCancel}
        footer={[
            <Button key="cancel" onClick={onCancel}>
                Hủy
            </Button>,
            <Button
                key="basic"
                type="primary"
                onClick={() => onSubscribe('basic')}
                style={{ marginRight: 8 }}
            >
                Gói đăng 1 bài - 5.000đ
            </Button>,
            <Button
                key="premium"
                type="primary"
                onClick={() => onSubscribe('premium')}
            >
                Gói 30 ngày - 50.000đ
            </Button>,
        ]}
    >
        <p>Bạn cần mua gói đăng tin để đăng bài tuyển dụng.</p>
        <ul>
            <li>Gói đăng 1 bài: 5.000đ/bài đăng</li>
            <li>Gói 30 ngày: 50.000đ/tháng không giới hạn bài đăng</li>
        </ul>
    </Modal>
);


const PersonalJob = () => {
    const { subcription } = useSubscription();
    const [personalJobs, setPersonalJobs] = useState([]);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pendingJobId, setPendingJobId] = useState(null);
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const [personalRes, companyRes] = await Promise.all([
                getPersonalJob(),
                getCompanyJob()
            ]);
            setPersonalJobs(personalRes.metadata);
            setCompanyJobs(companyRes.metadata);
        } catch (error) {
            message.error('Lỗi khi tải danh sách công việc');
        } finally {
            setLoading(false);
        }
    };


    const handlePublish = async (jobId: string) => {
        // Kiểm tra subscription
        const hasActiveSubscription = subcription?.status === 'active';
        console.log('hasActiveSubscription', hasActiveSubscription);

        if (!hasActiveSubscription) {
            setPendingJobId(jobId);
            setIsModalVisible(true);
            return;
        }

        try {
            setLoading(true);
            const response = await publishJobWhenActiveSubscription(jobId);
            if (response.status === 200) {
                message.success('Đăng tin thành công');
                fetchJobs();
            } else {
                message.error('Lỗi khi đăng tin');
            }
        } catch (error) {
            message.error('Lỗi khi đăng tin');
        } finally {
            setLoading(false);
        }
    };


    const handleSubscribe = async (type: 'basic' | 'premium') => {
        try {
            // Redirect to payment page with subscription type and pending job id
            navigate(`/employer/payment?type=${type}&jobId=${pendingJobId}`);
        } catch (error) {
            message.error('Lỗi khi xử lý yêu cầu');
        } finally {
            setIsModalVisible(false);
            setPendingJobId(null);
        }
    };


    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
        },
        {
            title: 'Địa điểm',
            dataIndex: 'location',
            key: 'location',
            width: '15%',
        },
        {
            title: 'Loại công việc',
            dataIndex: 'jobType',
            key: 'jobType',
            width: '15%',
            render: (jobType: keyof typeof JOB_TYPE_LABELS) => JOB_TYPE_LABELS[jobType],
        },
        {
            title: 'Mức lương',
            dataIndex: 'salary',
            key: 'salary',
            width: '15%',
            render: (salary: any) =>
                salary.negotiable
                    ? 'Thỏa thuận'
                    : `${formatCurrency(salary.min)} - ${formatCurrency(salary.max)}`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            render: (status: keyof typeof JOB_STATUS_LABELS) => (
                <Tag color={JOB_STATUS_COLORS[status]}>
                    {JOB_STATUS_LABELS[status]}
                </Tag>
            ),
        },
    ];

    const personalColumns = [
        ...columns,
        {
            title: 'Thao tác',
            key: 'action',
            width: '15%',
            render: (_, record: any) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/employer/edit-job/${record._id}`)}
                    >
                        Sửa
                    </Button>
                    {record.status === 'draft' && (
                        <Button
                            type="default"
                            icon={<SendOutlined />}
                            onClick={() => handlePublish(record._id)}
                        >
                            Đăng
                        </Button>
                    )}
                    {/* <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/employer/jobs/${record._id}`)}
                    >
                        Chi tiết
                    </Button> */}
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Việc làm của tôi" key="1">
                        <Table
                            columns={personalColumns}
                            dataSource={personalJobs}
                            rowKey="_id"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Tổng ${total} việc làm`,
                            }}
                        />
                    </TabPane>
                    <TabPane tab="Việc làm của công ty" key="2">
                        <Table
                            columns={columns}
                            dataSource={companyJobs}
                            rowKey="_id"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Tổng ${total} việc làm`,
                            }}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            <SubscriptionModal
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setPendingJobId(null);
                }}
                onSubscribe={handleSubscribe}
            />
        </div>
    );
};

export default PersonalJob;
