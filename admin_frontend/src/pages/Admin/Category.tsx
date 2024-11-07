import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Category, SubCategory } from '../../services/types/category.types';
import { adminGetCategory, adminCreateCategory, addSubCategory } from '../../services/api/adminCategoryService';
import CustomTable from '../../components/Category/Table';
import AddModal from '../../components/Category/AddModalCate';

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
    const [newSubCategoryName, setNewSubCategoryName] = useState<string>('');

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
            const formattedData = {
                name: values.name,
                subCategories: values.subCategories 
                    ? values.subCategories.map((sub: string) => ({ name: sub }))
                    : []
            };

            await adminCreateCategory(formattedData);
            message.success('Tạo danh mục thành công');
            setIsModalVisible(false);
            fetchCategories();
        } catch (error) {
            console.error('Error creating category:', error);
            message.error('Không thể tạo danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubCategory = async (categoryId: string, subCategory: SubCategory) => {
        try {
            setLoading(true);
            await addSubCategory(categoryId, subCategory);
            message.success('Thêm danh mục con thành công');
            fetchCategories();
        } catch (error) {
            console.error('Error adding sub category:', error);
            message.error('Không thể thêm danh mục con');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubCategoryClick = (category: Category) => {
        if (!category._id) {
            console.error('Category ID is undefined:', category);
            return;
        }
        setCurrentCategoryId(category._id);
        setIsSubCategoryModalVisible(true);
    };

    const handleSubCategorySubmit = () => {
        if (currentCategoryId && newSubCategoryName) {
            const newSubCategory = { name: newSubCategoryName };
            handleAddSubCategory(currentCategoryId, newSubCategory);
            setIsSubCategoryModalVisible(false);
            setNewSubCategoryName('');
        } else {
            message.error('Tên danh mục con không được để trống');
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
                onAddSubCategory={handleAddSubCategoryClick}
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

            <Modal
                title="Thêm Danh Mục Con"
                visible={isSubCategoryModalVisible}
                onOk={handleSubCategorySubmit}
                onCancel={() => setIsSubCategoryModalVisible(false)}
            >
                <Input
                    placeholder="Nhập tên danh mục con"
                    value={newSubCategoryName}
                    onChange={(e) => setNewSubCategoryName(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default CategoryPage;
