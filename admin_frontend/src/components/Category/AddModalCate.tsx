import React from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

interface AddModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    title: string;
    mainFieldLabel: string;
    mainFieldPlaceholder: string;
    subFieldsLabel?: string;
    subFieldsPlaceholder?: string;
    addSubFieldButtonText?: string;
    submitButtonText?: string;
    cancelButtonText?: string;
    showSubCategories?: boolean;
}

const AddModal: React.FC<AddModalProps> = ({
    isVisible,
    onCancel,
    onSubmit,
    title,
    mainFieldLabel,
    mainFieldPlaceholder,
    subFieldsLabel = "Danh mục con",
    subFieldsPlaceholder = "Nhập tên danh mục con",
    addSubFieldButtonText = "Thêm danh mục con",
    submitButtonText = "Tạo mới",
    cancelButtonText = "Hủy",
    showSubCategories = true,
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
                    rules={[{ required: true, message: `Vui lòng nhập ${mainFieldLabel.toLowerCase()}` }]}
                >
                    <Input placeholder={mainFieldPlaceholder} />
                </Form.Item>

                {showSubCategories && (
                    <Form.List name="subCategories">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        required={false}
                                        key={field.key}
                                        label={index === 0 ? subFieldsLabel : ""}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: `Vui lòng nhập ${subFieldsLabel.toLowerCase()}`,
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input 
                                                placeholder={subFieldsPlaceholder} 
                                                style={{ width: '90%' }} 
                                            />
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            onClick={() => remove(field.name)}
                                            style={{ marginLeft: 8 }}
                                        />
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                        block
                                    >
                                        {addSubFieldButtonText}
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                )}

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

export default AddModal;
