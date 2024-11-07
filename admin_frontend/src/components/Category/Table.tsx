import React from 'react';
import { Table as AntTable, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
    _id: string;
    [key: string]: any;
}

interface CustomTableProps<T extends DataType> {
    data: T[];
    loading: boolean;
    columns: ColumnsType<T>;
    onAddSubCategory?: (record: T) => void;
    pageSize?: number;
}

const CustomTable = <T extends DataType>({
    data,
    loading,
    columns,
    onAddSubCategory,
    pageSize = 10,
}: CustomTableProps<T>) => {
    const actionColumn = onAddSubCategory ? {
        title: 'Thao tác',
        key: 'action',
        width: '20%',
        render: (_: any, record: T) => (
            <Space size="middle">
                {onAddSubCategory && (
                    <Button 
                        type="default" 
                        onClick={() => onAddSubCategory(record)}
                    >
                        Thêm danh mục con
                    </Button>
                )}
            </Space>
        ),
    } : null;

    const finalColumns = actionColumn 
        ? [...columns, actionColumn] 
        : columns;

    return (
        <AntTable
            columns={finalColumns}
            dataSource={data}
            loading={loading}
            rowKey="_id"
            pagination={{
                pageSize: pageSize,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} danh mục`,
            }}
        />
    );
};

export default CustomTable;
