import React from 'react';
import { Table as AntTable, Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
    _id: string;
    [key: string]: any;
}

interface CustomTableProps<T extends DataType> {
    data: T[];
    loading: boolean;
    columns: ColumnsType<T>;
    pageSize?: number;
    onDelete?: (record: T) => void;
    onUpdate?: (record: T) => void;
}

const CustomTableLevel = <T extends DataType>({
    data,
    loading,
    columns,
    pageSize = 10,
    onDelete,
    onUpdate,
}: CustomTableProps<T>) => {
    const finalColumns: ColumnsType<T> = [
        ...columns,
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onUpdate?.(record)}
                    >
                        Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <AntTable
            columns={finalColumns}
            dataSource={data}
            loading={loading}
            rowKey="_id"
            pagination={{
                pageSize: pageSize,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} cấp độ`,
            }}
        />
    );
};

export default CustomTableLevel;
