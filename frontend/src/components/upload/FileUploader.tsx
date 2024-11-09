import React, { useState } from 'react';
import { Spin, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { uploadFileToFirebase } from '../../utils/firebaseUpload';

interface UploadedFile {
    url: string;
}

interface FileUploaderProps {
    onUploadSuccess: (files: UploadedFile[]) => void;
    maxCount?: number;
    multiple?: boolean;
    storagePath: string;
    accept?: string; // Để giới hạn loại file, ví dụ: '.pdf,.doc,.docx'
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onUploadSuccess,
    maxCount = 1,
    multiple = false,
    storagePath,
    accept = '.pdf,.doc,.docx'
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: RcFile) => {
        setUploading(true);
        try {
            const url = await uploadFileToFirebase(file, storagePath);
            const newFile: UploadedFile = { url };

            setUploadedFiles(prev => [...prev, newFile]);
            onUploadSuccess([...uploadedFiles, newFile]);

            message.success(`${file.name} đã được tải lên thành công`);
            return newFile;
        } catch (error) {
            console.error('Error uploading file:', error);
            message.error(`${file.name} tải lên thất bại.`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);

            // Remove the corresponding file from uploadedFiles
            const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
            setUploadedFiles(newUploadedFiles);
            onUploadSuccess(newUploadedFiles);
        },
        beforeUpload: async (file) => {
            // Kiểm tra định dạng file
            const isValidFormat = accept.split(',').some(format =>
                file.name.toLowerCase().endsWith(format.toLowerCase())
            );

            if (!isValidFormat) {
                message.error(`${file.name} không đúng định dạng. Chỉ chấp nhận ${accept}`);
                return Upload.LIST_IGNORE;
            }

            // Kiểm tra kích thước file (ví dụ: max 5MB)
            // const isLt5M = file.size / 1024 / 1024 < 5;
            // if (!isLt5M) {
            //     message.error('File phải nhỏ hơn 5MB!');
            //     return Upload.LIST_IGNORE;
            // }

            const result = await handleUpload(file);
            if (result) {
                setFileList(prev => [...prev, {
                    ...file,
                    url: result.url
                }]);
            }
            return false;
        },
        fileList,
        multiple,
        maxCount,
        accept,
    };

    return (
        <Spin spinning={uploading} tip="Đang tải file...">
            <Upload {...props}>
                {(!maxCount || fileList.length < maxCount) && (
                    <div style={{
                        padding: '20px',
                        border: '1px dashed #d9d9d9',
                        borderRadius: '2px',
                        background: '#fafafa',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}>
                        <UploadOutlined style={{ fontSize: '20px', color: '#40a9ff' }} />
                        <div style={{ marginTop: 8, color: '#666' }}>
                            {uploading ? 'Đang tải lên...' : 'Tải lên CV'}
                        </div>
                    </div>
                )}
            </Upload>
        </Spin>
    );
};

export default FileUploader;