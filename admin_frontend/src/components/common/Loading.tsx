import React from 'react';
import { Spin, SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps extends SpinProps {
    fullScreen?: boolean;
    text?: string;
}

// Full screen loading
export const FullPageLoading: React.FC<LoadingProps> = ({ text = 'Đang tải...' }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
            <div className="text-center">
                <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                    size="large"
                />
                {text && <div className="mt-4 text-gray-600">{text}</div>}
            </div>
        </div>
    );
};

// Content loading
export const ContentLoading: React.FC<LoadingProps> = ({ text = 'Đang tải...' }) => {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
                {text && <div className="mt-2 text-gray-600">{text}</div>}
            </div>
        </div>
    );
};

// Card loading skeleton
export const CardLoading: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
};

// Table loading
export const TableLoading: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-100 rounded mb-2"></div>
            ))}
        </div>
    );
};

// Default export as combined object
const Loading = {
    FullPage: FullPageLoading,
    Content: ContentLoading,
    Card: CardLoading,
    Table: TableLoading,
};

export default Loading;