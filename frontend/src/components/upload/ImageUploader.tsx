import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { uploadImageToFirebase } from '../../utils/firebaseUpload';

interface UploadedImage {
    url: string;
    base64: string;
}

interface ImageUploaderProps {
    onUploadSuccess: (images: UploadedImage[]) => void;
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
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    const getBase64 = (file: RcFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async (file: RcFile) => {
        try {
            // Get base64 before upload to Firebase
            const base64 = await getBase64(file);

            // Upload to Firebase
            const url = await uploadImageToFirebase(file, storagePath);

            // Create new image object with both URL and base64
            const newImage: UploadedImage = { url, base64 };

            // Update state
            setUploadedImages(prev => [...prev, newImage]);
            onUploadSuccess([...uploadedImages, newImage]);

            message.success(`${file.name} file uploaded successfully`);
            return newImage;
        } catch (error) {
            console.error('Error uploading file:', error);
            message.error(`${file.name} file upload failed.`);
            return null;
        }
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);

            // Remove the corresponding image from uploadedImages
            const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newUploadedImages);
            onUploadSuccess(newUploadedImages);
        },
        beforeUpload: async (file) => {
            const result = await handleUpload(file);
            if (result) {
                setFileList(prev => [...prev, {
                    ...file,
                    url: result.url,
                    preview: result.base64
                }]);
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