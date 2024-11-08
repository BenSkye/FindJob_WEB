import React from 'react';
import { Modal, Typography } from 'antd';

const { Text } = Typography;

interface PaymentConfirmModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const PaymentConfirmModal: React.FC<PaymentConfirmModalProps> = ({
    visible,
    onConfirm,
    onCancel,
    loading = false
}) => {
    return (
        <Modal
            title="Confirm Payment"
            open={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Confirm Payment"
            cancelText="Cancel"
            confirmLoading={loading}
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Text>Would you like to download this CV?</Text>
                <br />
                <Text strong style={{ fontSize: '18px' }}>
                    Price: 5,000 VND
                </Text>
            </div>
        </Modal>
    );
};

export default PaymentConfirmModal;