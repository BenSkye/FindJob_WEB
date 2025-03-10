import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import './ApplyJobModal.css';
import { uploadFileToFirebase } from '../../utils/firebaseUpload';
import { FIREBASE_STORAGE_PATH } from '../../utils/constants';
import FileUploader from '../../components/upload/FileUploader';
import Editor from '../../components/editor/Editor';
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
    const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);

    const editorConfig = {
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
    };

    const handleSubmit = async (values: any) => {
        if (!coverLetter.trim()) {
            message.error('Vui lòng nhập thư xin việc!');
            return;
        }

        const applicationData = {
            jobId,
            resume: {
                url: uploadedFileUrls[0].url,
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

    const handleFileUpload = (urls: any[]) => {
        setUploadedFileUrls(urls);
        form.setFieldValue('resume', urls[0].url);
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

                    <FileUploader
                        onUploadSuccess={handleFileUpload}
                        storagePath={FIREBASE_STORAGE_PATH.RESUME_ME}
                        accept=".pdf,.doc,.docx"
                    />
                </Form.Item>

                <Form.Item
                    label="Thư xin việc"
                    required
                >
                    <div className="cover-letter-editor">
                        <Editor
                            data={coverLetter}
                            config={editorConfig}
                            onChange={(data: string) => setCoverLetter(data)}
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