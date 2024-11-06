import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { uploadImageToFirebase } from '../../utils/firebaseUpload';

interface ImageUploaderProps {
    onUploadSuccess: (urls: string[]) => void;
    maxCount?: number;
    multiple?: boolean;
    storagePath: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    onUploadSuccess,
    maxCount,
    multiple = true,
    storagePath,
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const handleUpload = async (file: RcFile) => {
        try {
            const url = await uploadImageToFirebase(file, storagePath);
            setUploadedUrls(prev => [...prev, url]);
            onUploadSuccess([...uploadedUrls, url]);
            message.success(`${file.name} file uploaded successfully`);
            return url;
        } catch (error) {
            console.error('Error uploading file:', error);
            message.error(`${file.name} file upload failed.`);
            return '';
        }
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);

            // Remove the corresponding URL from uploadedUrls
            const newUploadedUrls = uploadedUrls.filter((_, i) => i !== index);
            setUploadedUrls(newUploadedUrls);
            onUploadSuccess(newUploadedUrls);
        },
        beforeUpload: async (file) => {
            const url = await handleUpload(file);
            if (url) {
                setFileList(prev => [...prev, { ...file, url }]);
            }
            return false;
        },
        fileList,
        listType: "picture-card",
        multiple,
        maxCount,
    };

    return (
        <Upload {...props}>
            {maxCount !== undefined && fileList.length < maxCount && (
                <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Select Images</div>
                </div>
            )}
        </Upload>
    );
};

export default ImageUploader;