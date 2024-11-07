import React, { useEffect, useState } from 'react';
import { Button, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Category } from '../../services/types/category.types';
import { adminGetCategory, adminCreateCategory } from '../../services/api/adminCategoryService';
import CustomTable from '../../components/Category/Table';
import AddModal from '../../components/Category/AddModalCate';

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await adminGetCategory();
            console.log('response:', response);
            setCategories(response.metadata);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Không thể tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCreate = async (values: any) => {
        try {
            setLoading(true);
            console.log('values:', values);
            await adminCreateCategory({
                name: values.name,
                subCategories: values.subCategories || []
            });
            message.success('Tạo danh mục thành công');
            setIsModalVisible(false);
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error('Error creating category:', error);
            message.error('Không thể tạo danh mục');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Category> = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Danh mục con',
            dataIndex: 'subCategories',
            key: 'subCategories',
            width: '30%',
            render: (subCategories) => (
                <ul>
                    {subCategories.map((sub: { name: string }, index: number) => (
                        <li key={index}>{sub.name}</li>
                    ))}
                </ul>
            ),
        },
    ];

    const handleEdit = (category: Category) => {
        console.log('Edit category:', category);
    };

    const handleDelete = (id: string) => {
        console.log('Delete category:', id);
    };

    return (
        <div className="category-page">
            <div className="page-header" style={{ marginBottom: 20 }}>
                <h2>Quản lý Danh mục</h2>
                <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
                    Thêm danh mục mới
                </Button>
            </div>

            <CustomTable<Category>
                data={categories}
                loading={loading}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pageSize={10}
            />

            <AddModal
                isVisible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleCreate}
                title="Thêm Danh Mục Mới"
                mainFieldLabel="Tên danh mục"
                mainFieldPlaceholder="Nhập tên danh mục"
            />
        </div>
    );
};

export default CategoryPage;
