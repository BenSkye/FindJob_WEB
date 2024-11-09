import React, { Suspense } from 'react';
import { Spin } from 'antd';

// Chỉ lazy load CKEditor component
const CKEditor = React.lazy(() =>
    import('@ckeditor/ckeditor5-react').then(module => ({
        default: module.CKEditor
    }))
);

// Import ClassicEditor trực tiếp
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface EditorProps {
    onChange: (data: string) => void;
    data?: string;
    config?: any;
}

const Editor: React.FC<EditorProps> = ({ onChange, data = '', config }) => {
    return (
        <Suspense fallback={<Spin />}>
            <CKEditor
                editor={ClassicEditor}
                data={data}
                config={config}
                onChange={(event: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
        </Suspense>
    );
};

export default Editor;