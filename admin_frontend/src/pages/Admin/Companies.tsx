import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Company } from '../../services/types/company.types';
import { adminGetListCompany } from '../../services/api/companyApi';
import CustomTableCompany from '../../components/Company/TableCompany';

const CompaniesPage: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await adminGetListCompany();
            setCompanies(response);
        } catch (error) {
            console.error('Error fetching companies:', error);
            message.error('Không thể tải danh sách công ty');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const columns: ColumnsType<Company> = [
        {
            title: 'Tên công ty',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '15%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '10%',
            render: (phone: string | null) => phone || 'Chưa cập nhật',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: '15%',
            render: (address: string | null) => address || 'Chưa cập nhật',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            width: '15%',
            render: (website: string | null) => website || 'Chưa cập nhật',
        },
        {
            title: 'Quy mô',
            dataIndex: 'companySize',
            key: 'companySize',
            width: '10%',
        },
        {
            title: 'Mã số thuế',
            dataIndex: 'taxNumber',
            key: 'taxNumber',
            width: '10%',
        },
        {
            title: 'Mạng xã hội',
            key: 'social',
            width: '10%',
            render: (_: any, record: Company) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {record.facebook && (
                        <a href={record.facebook} target="_blank" rel="noopener noreferrer">
                            FB
                        </a>
                    )}
                    {record.linkedin && (
                        <a href={record.linkedin} target="_blank" rel="noopener noreferrer">
                            IN
                        </a>
                    )}
                    {record.twitter && (
                        <a href={record.twitter} target="_blank" rel="noopener noreferrer">
                            TW
                        </a>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="companies-page">
            <div className="page-header" style={{ marginBottom: 20 }}>
                <h2>Quản lý Công ty</h2>
            </div>

            <CustomTableCompany<Company>
                data={companies}
                loading={loading}
                columns={columns}
                pageSize={10}
            />
        </div>
    );
};

export default CompaniesPage;
