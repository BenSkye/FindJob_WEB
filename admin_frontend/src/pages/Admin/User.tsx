import React, { useEffect, useState } from 'react';
import { message, Tag, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { User } from '../../services/types/user.types';
import { Company } from '../../services/types/company.types';
import { adminGetUser } from '../../services/api/userApi';
import CustomTableUser from '../../components/User/TableUser';

interface UserWithCompany extends User {
    company?: Company;
}

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<UserWithCompany[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('candidate');

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

    const filteredUsers = users.filter(user => {
        return user.roles.includes(activeTab);
    });

    const tabItems = [
        {
            key: 'candidate',
            label: 'Ứng viên',
        },
        {
            key: 'employer',
            label: 'Nhà tuyển dụng',
        },
    ];

    const columns: ColumnsType<UserWithCompany> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
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
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            width: '10%',
            render: (roles: string[]) => (
                <span>
                    {Array.isArray(roles) ? roles.map((role) => (
                        <Tag color={role === 'employer' ? 'blue' :
                            role === 'candidate' ? 'green' :
                                role === 'admin' ? 'red' :
                                    'default'} key={role}>
                            {role === 'employer' ? 'Nhà tuyển dụng' :
                                role === 'candidate' ? 'Ứng viên' :
                                    role === 'admin' ? 'Quản trị viên' :
                                        role.toUpperCase()}
                        </Tag>
                    )) : roles}
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
        {
            title: 'Công ty',
            dataIndex: ['company', 'name'],
            key: 'companyName',
            width: '15%',
            render: (_text: string, record: UserWithCompany) => (
                <span>
                    {record.company?.name || 'Chưa có công ty'}
                </span>
            ),
        },
    ];

    return (
        <div className="user-page">
            <div className="page-header" style={{ marginBottom: 20 }}>
                <h2>Quản lý Người dùng</h2>
            </div>

            <Tabs
                items={tabItems}
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                style={{ marginBottom: 16 }}
            />

            <CustomTableUser<UserWithCompany>
                data={filteredUsers}
                loading={loading}
                columns={columns}
                pageSize={10}
            />
        </div>
    );
};

export default UserPage;