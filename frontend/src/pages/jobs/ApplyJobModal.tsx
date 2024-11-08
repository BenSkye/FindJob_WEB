import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './ApplyJobModal.css';
import { uploadFileToFirebase } from '../../utils/firebaseUpload';

interface ApplyJobModalProps {
    isVisible: boolean;
    jobId: string;
    onCancel: () => void;
    onSubmit: (values: any) => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
    isVisible,
    jobId,
    onCancel,
    onSubmit
}) => {
    const [form] = Form.useForm();
    const [coverLetter, setCoverLetter] = useState('');

    const handleSubmit = async (values: any) => {
        if (!coverLetter.trim()) {
            message.error('Vui lòng nhập thư xin việc!');
            return;
        }

        const applicationData = {
            jobId,
            resume: {
                url: values.resume,
                name: values.name,
                email: values.email,
                phone: values.phone,
            },
            coverLetter
        };

        onSubmit(applicationData);
    };

    const handleCancel = () => {
        form.resetFields();
        setCoverLetter('');
        onCancel();
    };

    const handleUploadResume = async (file: File) => {
        const url = await uploadFileToFirebase(file, `resumes/${file.name}`);
        console.log('url', url);
        form.setFieldValue('resume', url);
        return url;
    };

    return (
        <Modal
            title="Ứng tuyển công việc"
            open={isVisible}
            onCancel={handleCancel}
            footer={null}
            width={700}
            className="apply-job-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    name: '',
                    email: '',
                    phone: ''
                }}
            >
                <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input placeholder="Nhập họ và tên của bạn" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại của bạn" />
                </Form.Item>

                <Form.Item
                    name="resume"
                    label="CV của bạn"
                    rules={[{ required: true, message: 'Vui lòng tải lên CV!' }]}
                >
                    <Upload
                        maxCount={1}
                        beforeUpload={(file) => {
                            const url = handleUploadResume(file);
                            return false;
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Tải lên CV (PDF)</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Thư xin việc"
                    required
                >
                    <div className="cover-letter-editor">
                        <CKEditor
                            editor={ClassicEditor}
                            data={coverLetter}
                            config={{
                                toolbar: [
                                    'heading',
                                    '|',
                                    'bold',
                                    'italic',
                                    'link',
                                    'bulletedList',
                                    'numberedList',
                                    '|',
                                    'undo',
                                    'redo'
                                ],
                                placeholder: 'Viết giới thiệu ngắn gọn về bản thân và lý do bạn phù hợp với vị trí này...',
                            }}
                            onChange={(event: any, editor: any) => {
                                const data = editor.getData();
                                setCoverLetter(data);
                            }}
                        />
                    </div>
                    {!coverLetter && (
                        <div className="error-message">
                            Vui lòng nhập thư xin việc!
                        </div>
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Nộp đơn ứng tuyển
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ApplyJobModal;