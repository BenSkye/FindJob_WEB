import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Level } from '../../services/types/level.types';
import { adminGetLevel, adminCreateLevel, adminDeleteLevel, adminUpdateLevel } from '../../services/api/adminLevelService';
import CustomTableLevel from '../../components/Level/TableLevel';
import AddModalLevel from '../../components/Level/AddModalLevel';
import UpdateModalLevel from '../../components/Level/UpdateModalLevel';

const LevelPage: React.FC = () => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);

    const fetchLevels = async () => {
        try {
            setLoading(true);
            const response = await adminGetLevel();
            setLevels(response.metadata);
        } catch (error) {
            console.error('Error fetching levels:', error);
            message.error('Không thể tải danh sách cấp độ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    const showModal = () => {
        setIsAddModalVisible(true);
    };

    const handleCreate = async (values: any) => {
        try {
            setLoading(true);
            await adminCreateLevel(values);
            message.success('Tạo cấp độ thành công');
            setIsAddModalVisible(false);
            fetchLevels();
        } catch (error) {
            console.error('Error creating level:', error);
            message.error('Không thể tạo cấp độ');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (record: Level) => {
        try {
            setLoading(true);
            await adminDeleteLevel(record);
            message.success('Xóa cấp độ thành công');
            fetchLevels();
        } catch (error) {
            console.error('Error deleting level:', error);
            message.error('Không thể xóa cấp độ');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values: Level) => {
        try {
            setLoading(true);
            await adminUpdateLevel(values);
            message.success('Cập nhật cấp độ thành công');
            setIsUpdateModalVisible(false);
            fetchLevels();
        } catch (error) {
            console.error('Error updating level:', error);
            message.error('Không thể cập nhật cấp độ');
        } finally {
            setLoading(false);
        }
    };

    const showUpdateModal = (record: Level) => {
        setCurrentLevel(record);
        setIsUpdateModalVisible(true);
    };

    const columns: ColumnsType<Level> = [
        {
            title: 'Tên cấp độ',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '50%',
        },
    ];

    return (
        <div className="level-page">
            <div className="page-header" style={{ marginBottom: 20 }}>
                <h2>Quản lý Cấp độ</h2>
                <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
                    Thêm cấp độ mới
                </Button>
            </div>

            <CustomTableLevel<Level>
                data={levels}
                loading={loading}
                columns={columns}
                pageSize={10}
                onDelete={handleDelete}
                onUpdate={showUpdateModal}
            />

            <AddModalLevel
                isVisible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onSubmit={handleCreate}
                title="Thêm Cấp Độ Mới"
                mainFieldLabel="Tên cấp độ"
                mainFieldPlaceholder="Nhập tên cấp độ"
            />

            <UpdateModalLevel
                isVisible={isUpdateModalVisible}
                onCancel={() => {
                    setIsUpdateModalVisible(false);
                    setCurrentLevel(null);
                }}
                onSubmit={handleUpdate}
                currentLevel={currentLevel}
            />
        </div>
    );
};

export default LevelPage;
