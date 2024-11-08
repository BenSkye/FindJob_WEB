import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { User } from '../../services/types/user.types';
import { adminGetUser } from '../../services/api/userApi';
import CustomTableUser from '../../components/User/TableUser';

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminGetUser();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns: ColumnsType<User> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '15%',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: '20%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status: string) => (
                <span style={{ 
                    color: status === 'active' ? 'green' : 'red' 
                }}>
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
            ),
        },
        {
            title: 'Xác thực',
            dataIndex: 'verify',
            key: 'verify',
            width: '10%',
            render: (verify: boolean) => (
                <span style={{ 
                    color: verify ? 'green' : 'red' 
                }}>
                    {verify ? 'Đã xác thực' : 'Chưa xác thực'}
                </span>
            ),
        },
    ];

    return (
        <div className="user-page">
            <div className="page-header" style={{ marginBottom: 20 }}>
                <h2>Quản lý Người dùng</h2>
            </div>

            <CustomTableUser<User>
                data={users}
                loading={loading}
                columns={columns}
                pageSize={10}
            />
        </div>
    );
};

export default UserPage;
