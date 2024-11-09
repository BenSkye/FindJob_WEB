import React, { Suspense } from 'react';
const CKEditor = React.lazy(() => import('@ckeditor/ckeditor5-react').then(module => ({
    default: module.CKEditor
})));
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CustomCKEditorProps {
    data?: string;
    onChange: (data: string) => void;
    placeholder?: string;
    height?: string;
}

const CustomCKEditor: React.FC<CustomCKEditorProps> = ({
    data = '',
    onChange,
    placeholder = 'Nhập nội dung...',
    height = '200px'
}) => {
    return (
        <Suspense fallback={
            <div style={{
                height,
                border: '1px solid #d9d9d9',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                Đang tải editor...
            </div>
        }>
            <div style={{ minHeight: height }}>
                <CKEditor
                    editor={ClassicEditor}
                    data={data}
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
                        placeholder: placeholder,
                    }}
                    onChange={(event: any, editor: any) => {
                        const data = editor.getData();
                        onChange(data);
                    }}
                />
            </div>
        </Suspense>
    );
};

export default CustomCKEditor;