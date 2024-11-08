import React from 'react';
import { Card, Row, Col, Tag, Button, Empty, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ProfileCVList = ({ cvList }) => {
    if (!cvList || cvList.length === 0) {
        return (
            <Empty
                description="Bạn chưa có CV nào"
                style={{ margin: '40px 0' }}
            />
        );
    }

    return (
        <div style={styles.container}>
            <Title level={2} style={styles.title}>Danh sách CV của bạn</Title>

            <Row gutter={[24, 24]}>
                {cvList.map((cv) => (
                    <Col xs={24} sm={12} lg={8} key={cv._id}>
                        <Card
                            hoverable
                            style={styles.card}
                            cover={
                                cv.content.avatar && (
                                    <img
                                        alt="CV Preview"
                                        src={cv.content.avatar}
                                        style={styles.cardImage}
                                    />
                                )
                            }
                            actions={[
                                <Button type="text" icon={<EyeOutlined />}>Xem</Button>,
                                <Button type="text" icon={<EditOutlined />}>Sửa</Button>,
                                <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
                            ]}
                        >
                            <Card.Meta
                                title={cv.content.fullName}
                                description={
                                    <div style={styles.cardContent}>
                                        <p>{cv.content.email}</p>
                                        <p>{cv.content.phone}</p>
                                        <div style={styles.tags}>
                                            <Tag color={cv.status === 'active' ? 'green' : 'orange'}>
                                                {cv.status === 'active' ? 'Hoạt động' : 'Bản nháp'}
                                            </Tag>
                                            <Tag color={cv.isPaid ? 'blue' : 'default'}>
                                                {cv.isPaid ? 'Premium' : 'Free'}
                                            </Tag>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
    },
    title: {
        marginBottom: '24px',
        textAlign: 'center',
    },
    card: {
        height: '100%',
    },
    cardImage: {
        height: '200px',
        objectFit: 'cover',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    tags: {
        display: 'flex',
        gap: '8px',
        marginTop: '8px',
    },
};

export default ProfileCVList;