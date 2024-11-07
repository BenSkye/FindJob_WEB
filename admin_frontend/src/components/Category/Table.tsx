import React from 'react';
import { Table as AntTable, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface DataType {
    id: string;
    [key: string]: any;
}

interface CustomTableProps<T extends DataType> {
    data: T[];
    loading: boolean;
    columns: ColumnsType<T>;
    onEdit?: (record: T) => void;
    onDelete?: (id: string) => void;
    pageSize?: number;
}

const CustomTable = <T extends DataType>({
    data,
    loading,
    columns,
    onEdit,
    onDelete,
    pageSize = 10,
}: CustomTableProps<T>) => {
    // Thêm action column nếu có onEdit hoặc onDelete
    const actionColumn = (onEdit || onDelete) ? {
        title: 'Thao tác',
        key: 'action',
        width: '20%',
        render: (_: any, record: T) => (
            <Space size="middle">
                {onEdit && (
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        Sửa
                    </Button>
                )}
                {onDelete && (
                    <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record.id)}
                    >
                        Xóa
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
            rowKey="id"
            pagination={{
                pageSize: pageSize,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} bản ghi`,
            }}
        />
    );
};

export default CustomTable;
