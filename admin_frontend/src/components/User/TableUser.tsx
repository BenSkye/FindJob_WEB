import React from 'react';
import { Table as AntTable } from 'antd';
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
}

const CustomTableUser = <T extends DataType>({
    data,
    loading,
    columns,
    pageSize = 10,
}: CustomTableProps<T>) => {
    return (
        <AntTable
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="_id"
            pagination={{
                pageSize: pageSize,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} người dùng`,
            }}
        />
    );
};

export default CustomTableUser;
