import React from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';

interface AddModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    title: string;
    mainFieldLabel: string;
    mainFieldPlaceholder: string;
    submitButtonText?: string;
    cancelButtonText?: string;
}

const AddModalLevel: React.FC<AddModalProps> = ({
    isVisible,
    onCancel,
    onSubmit,
    title,
    mainFieldLabel,
    mainFieldPlaceholder,
    submitButtonText = "Tạo mới",
    cancelButtonText = "Hủy",
}) => {
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={title}
            open={isVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
            >
                <Form.Item
                    name="name"
                    label={mainFieldLabel}
                    rules={[
                        { required: true, message: `Vui lòng nhập ${mainFieldLabel.toLowerCase()}` },
                        {
                            validator: (_, value) =>
                                value && value.trim() !== ''
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Không được chỉ nhập khoảng trắng')),
                        },
                    ]}
                >
                    <Input placeholder={mainFieldPlaceholder} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả' },
                        {
                            validator: (_, value) =>
                                value && value.trim() !== ''
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Không được chỉ nhập khoảng trắng')),
                        },
                    ]}
                >
                    <Input.TextArea placeholder="Nhập mô tả cấp độ" rows={4} />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {submitButtonText}
                        </Button>
                        <Button onClick={handleCancel}>
                            {cancelButtonText}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddModalLevel;
