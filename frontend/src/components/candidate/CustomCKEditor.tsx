import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
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
    );
};

export default CustomCKEditor;