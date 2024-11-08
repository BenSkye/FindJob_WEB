import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';
import { Level } from '../../services/types/level.types';

interface UpdateModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: Level) => void;
    currentLevel: Level | null;
}

const UpdateModalLevel: React.FC<UpdateModalProps> = ({
    isVisible,
    onCancel,
    onSubmit,
    currentLevel,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (currentLevel) {
            form.setFieldsValue({
                name: currentLevel.name,
                description: currentLevel.description,
            });
        }
    }, [currentLevel, form]);

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const handleSubmit = (values: any) => {
        if (currentLevel) {
            onSubmit({ ...values, _id: currentLevel._id });
        }
    };

    return (
        <Modal
            title="Cập nhật cấp độ"
            open={isVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Tên cấp độ"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên cấp độ' },
                        {
                            validator: (_, value) =>
                                value && value.trim() !== ''
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Không được chỉ nhập khoảng trắng')),
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên cấp độ" />
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
                            Cập nhật
                        </Button>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateModalLevel;
